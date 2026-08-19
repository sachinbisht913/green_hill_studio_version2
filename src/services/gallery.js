import { supabase } from '../lib/supabase';

const bucket = 'gallery-images';

export const categories = [
  'Wedding',
  'Mehndi',
  'Pre-Wedding',
  'Engagement / Ring Ceremony',
  'Birthday',
  'Naming Ceremony',
  'Janeu',
  'Retirement',
  'Party',
  'Photoshoot',
  'Other',
];

/* =========================================================
   IMAGE COMPRESSION
========================================================= */

async function compressImage(file) {
  // Small images don't need compression
  if (file.size < 500 * 1024) {
    return file;
  }

  const image = new Image();
  const objectUrl = URL.createObjectURL(file);

  try {
    image.src = objectUrl;

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    const MAX_WIDTH = 2400;
    const MAX_HEIGHT = 2400;

    let width = image.naturalWidth;
    let height = image.naturalHeight;

    if (
      width > MAX_WIDTH ||
      height > MAX_HEIGHT
    ) {
      const ratio = Math.min(
        MAX_WIDTH / width,
        MAX_HEIGHT / height
      );

      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d', {
      alpha: false,
    });

    ctx.drawImage(
      image,
      0,
      0,
      width,
      height
    );

    const blob = await new Promise((resolve) => {
      canvas.toBlob(
        resolve,
        'image/webp',
        0.84
      );
    });

    if (!blob) {
      return file;
    }

    const originalName = file.name
      .replace(/\.[^/.]+$/, '');

    return new File(
      [blob],
      `${originalName}.webp`,
      {
        type: 'image/webp',
        lastModified: Date.now(),
      }
    );
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}


/* =========================================================
   GET GALLERY
========================================================= */

export async function getGallery(category = '') {
  let query = supabase
    .from('gallery_images')
    .select(
      `
      id,
      title,
      description,
      category,
      image_url,
      storage_path,
      display_order,
      created_at,
      is_active
      `
    )
    .eq('is_active', true)
    .order('display_order', {
      ascending: true,
    })
    .order('created_at', {
      ascending: false,
    });

  /*
   * IMPORTANT:
   * Only apply category filter when a category
   * is actually selected.
   */
  if (category && category.trim()) {
    query = query.eq(
      'category',
      category.trim()
    );
  }

  const {
    data,
    error,
  } = await query;

  if (error) {
    throw error;
  }

  /*
   * Generate optimized image URLs.
   */
  return (data || []).map((image) => {
    if (!image.storage_path) {
      return {
        ...image,
        thumb_url: image.image_url,
        medium_url: image.image_url,
        large_url: image.image_url,
      };
    }

    const storage =
      supabase.storage.from(bucket);

    const thumb =
      storage.getPublicUrl(
        image.storage_path,
        {
          transform: {
            width: 500,
            height: 650,
            resize: 'cover',
            quality: 70,
          },
        }
      );

    const medium =
      storage.getPublicUrl(
        image.storage_path,
        {
          transform: {
            width: 900,
            height: 1100,
            resize: 'cover',
            quality: 78,
          },
        }
      );

    const large =
      storage.getPublicUrl(
        image.storage_path,
        {
          transform: {
            width: 1400,
            height: 1600,
            resize: 'cover',
            quality: 82,
          },
        }
      );

    return {
      ...image,

      thumb_url:
        thumb.data.publicUrl,

      medium_url:
        medium.data.publicUrl,

      large_url:
        large.data.publicUrl,
    };
  });
}


/* =========================================================
   GET ALL GALLERY
========================================================= */

export async function getAllGallery() {
  const {
    data,
    error,
  } = await supabase
    .from('gallery_images')
    .select('*')
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data || [];
}


/* =========================================================
   UPLOAD GALLERY IMAGE
========================================================= */

export async function uploadGalleryImage({
  file,
  title,
  description,
  category,
  display_order = 0,
}) {
  if (!file) {
    throw new Error(
      'No image selected.'
    );
  }

  if (!category) {
    throw new Error(
      'Please select a category.'
    );
  }

  /*
   * Compress before upload.
   */
  const optimizedFile =
    await compressImage(file);

  /*
   * Always store optimized image as WebP.
   */
  const storage_path =
    `${crypto.randomUUID()}.webp`;

  /*
   * Upload image.
   */
  const {
    error: uploadError,
  } = await supabase.storage
    .from(bucket)
    .upload(
      storage_path,
      optimizedFile,
      {
        cacheControl: '31536000',
        contentType: 'image/webp',
        upsert: false,
      }
    );

  if (uploadError) {
    throw uploadError;
  }

  /*
   * Public URL.
   */
  const {
    data: urlData,
  } =
    supabase.storage
      .from(bucket)
      .getPublicUrl(
        storage_path
      );

  const image_url =
    urlData.publicUrl;

  /*
   * Save database record.
   */
  const {
    data,
    error,
  } = await supabase
    .from('gallery_images')
    .insert({
      title: title?.trim() || '',
      description:
        description?.trim() || null,
      category: category.trim(),
      image_url,
      storage_path,
      display_order:
        Number(display_order) || 0,
      is_active: true,
    })
    .select()
    .single();

  /*
   * Cleanup storage if DB insert fails.
   */
  if (error) {
    await supabase.storage
      .from(bucket)
      .remove([
        storage_path,
      ]);

    throw error;
  }

  return data;
}


/* =========================================================
   UPDATE IMAGE
========================================================= */

export async function updateGalleryImage(
  id,
  values
) {
  const {
    data,
    error,
  } = await supabase
    .from('gallery_images')
    .update(values)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}


/* =========================================================
   DELETE IMAGE
========================================================= */

export async function deleteGalleryImage(
  image
) {
  /*
   * Delete database record.
   */
  const {
    error,
  } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', image.id);

  if (error) {
    throw error;
  }

  /*
   * Delete storage file.
   */
  if (image.storage_path) {
    const {
      error: storageError,
    } = await supabase.storage
      .from(bucket)
      .remove([
        image.storage_path,
      ]);

    if (storageError) {
      console.warn(
        'Image metadata deleted, but storage cleanup failed.',
        storageError
      );
    }
  }
}