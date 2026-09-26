let supabasePromise;

async function getSupabase() {
  if (!supabasePromise) {
    supabasePromise = import('../lib/supabase').then(
      ({ supabase }) => supabase
    );
  }

  const supabase = await supabasePromise;

  if (!supabase) {
    throw new Error(
      'Supabase is not configured.'
    );
  }

  return supabase;
}

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
  const image = new Image();
  const objectUrl = URL.createObjectURL(file);

  try {
      image.src = objectUrl;

      await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = reject;
      });

      const MAX_WIDTH = 2000;
      const MAX_HEIGHT = 2000;

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

      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d", {
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
              "image/webp",
              0.82
          );
      });

      if (!blob) {
          throw new Error(
              "Image compression failed."
          );
      }

      const originalName = file.name
          .replace(/\.[^/.]+$/, "");

      return new File(
          [blob],
          `${originalName}.webp`,
          {
              type: "image/webp",
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

export async function getGallery(
  category = "",
  limit = null
) {
  const supabase = await getSupabase();
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
  
  if (limit) {
    query = query.limit(limit);
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
                  width: 400,
                  height: 550,
                  resize: "cover",
                  quality: 68,
              },
          }
      );
  
  const medium =
      storage.getPublicUrl(
          image.storage_path,
          {
              transform: {
                  width: 800,
                  height: 1000,
                  resize: "cover",
                  quality: 75,
              },
          }
      );
  
  const large =
      storage.getPublicUrl(
          image.storage_path,
          {
              transform: {
                  width: 1200,
                  height: 1500,
                  resize: "cover",
                  quality: 80,
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
  const supabase = await getSupabase();

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
  const supabase = await getSupabase();

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
}
  // rest of your existing code...


/* =========================================================
   UPDATE IMAGE
========================================================= */

export async function updateGalleryImage(
  id,
  values
) {
  const supabase = await getSupabase();

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
  const supabase = await getSupabase();

  // Delete database record.
  const {
    error,
  } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', image.id);

  if (error) {
    throw error;
  }

  // Delete storage file.
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