import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  categories,
  deleteGalleryImage,
  getAllGallery,
  updateGalleryImage,
  uploadGalleryImage,
} from '../services/gallery';
import './admin-dashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Wedding',
    display_order: 0,
  });

  const refresh = () =>
    getAllGallery()
      .then(setImages)
      .catch(() =>
        setNotice('Gallery could not be loaded. Please try again.')
      );

  useEffect(() => {
    refresh();
  }, []);

  const visible = useMemo(
    () =>
      images.filter(
        (image) =>
          (category === 'All' || image.category === category) &&
          `${image.title} ${image.category}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [images, category, query]
  );

  async function upload(e) {
  e.preventDefault();

  if (!file) {
    setNotice('Choose an image to upload.');
    return;
  }

  setBusy(true);
  setNotice('');

  try {
    const newImage =
      await uploadGalleryImage({
        ...form,
        file,
      });

    /*
     * Add newly uploaded image directly
     * to the existing gallery.
     *
     * No complete gallery reload.
     */
    setImages((current) => [
      newImage,
      ...current,
    ]);

    setFile(null);

    setForm({
      title: '',
      description: '',
      category: 'Wedding',
      display_order: 0,
    });

    setUploadOpen(false);

    setNotice(
      'Image uploaded successfully.'
    );

  } catch (error) {
    console.error(error);

    setNotice(
      'Upload failed. Please try again.'
    );
  } finally {
    setBusy(false);
  }
}

  async function remove(image) {
    if (
      !window.confirm(
        `Are you sure you want to delete “${image.title}”?`
      )
    ) {
      return;
    }

    try {
      await deleteGalleryImage(image);

      setImages((items) =>
        items.filter((item) => item.id !== image.id)
      );

      setNotice('Image deleted.');
    } catch {
      setNotice('Unable to delete this image.');
    }
  }

  async function toggle(image) {
    try {
      await updateGalleryImage(image.id, {
        is_active: !image.is_active,
      });

      setImages((items) =>
        items.map((item) =>
          item.id === image.id
            ? {
                ...item,
                is_active: !item.is_active,
              }
            : item
        )
      );
    } catch {
      setNotice('Unable to update this image.');
    }
  }

  async function edit(image) {
    const title = window.prompt(
      'Image title',
      image.title
    );

    if (title === null || !title.trim()) {
      return;
    }

    const description = window.prompt(
      'Description (optional)',
      image.description || ''
    );

    try {
      await updateGalleryImage(image.id, {
        title: title.trim(),
        description,
      });

      await refresh();

      setNotice('Image details updated.');
    } catch {
      setNotice('Unable to save image details.');
    }
  }

  const active = images.filter(
    (image) => image.is_active
  ).length;

  const categoryCount = new Set(
    images.map((image) => image.category)
  ).size;

  return (
    <main className="studio-admin">
      {/* SIDEBAR */}
      <aside className="studio-sidebar">
        <Link to="/" className="studio-mark">
          <img
            src="/logo.png"
            alt="Green Hill Studio"
          />

          <span>
            GREEN HILL
            <br />
            STUDIO
          </span>
        </Link>

        <nav>
          <a
            className="selected"
            href="#overview"
          >
            ▦ <span>Dashboard</span>
          </a>

          <a href="#gallery">
            ▧ <span>Gallery</span>
          </a>

          <button
            onClick={() => setUploadOpen(true)}
          >
            ＋ <span>Upload</span>
          </button>

         
        </nav>

        <div className="sidebar-bottom">
          <Link to="/">
            ↗ <span>View website</span>
          </Link>

          <button
            onClick={async () => {
              await supabase.auth.signOut();

              navigate('/admin/login', {
                replace: true,
              });
            }}
          >
            ↪ <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <section className="studio-content">
        {/* HEADER */}
        <header
          className="studio-header"
          id="overview"
        >
          <div>
            <p>STUDIO MANAGEMENT</p>

            <h1>Welcome back.</h1>

            <span>
              Manage your stories, photographs and
              gallery from one place.
            </span>
          </div>

          <button
            className="admin-primary"
            onClick={() => setUploadOpen(true)}
          >
            ＋ Upload photos
          </button>
        </header>

        {/* METRICS */}
        <div className="metrics">
          <Metric
            value={images.length}
            label="Total images"
          />

          <Metric
            value={active}
            label="Active images"
          />

          <Metric
            value={categoryCount}
            label="Categories"
          />
        </div>

        {/* MEDIA LIBRARY */}
        <section
          className="media-library"
          id="gallery"
        >
          <div className="library-head">
            <div>
              <p>MEDIA LIBRARY</p>

              <h2>Gallery</h2>
            </div>

            <div className="library-controls">
              <input
                aria-label="Search gallery"
                placeholder="Search images"
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
              />

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >
                <option>All</option>

                {categories.map((item) => (
                  <option key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* NOTICE */}
          {notice && (
            <div className="admin-toast">
              {notice}

              <button
                onClick={() => setNotice('')}
              >
                ×
              </button>
            </div>
          )}

          {/* IMAGE GRID */}
          <div className="admin-media-grid">
            {visible.map((image) => (
              <article key={image.id}>
                <img
                  src={image.image_url}
                  alt={image.title}
                />

                <div className="media-meta">
                  <span
                    className={
                      image.is_active
                        ? 'status active'
                        : 'status'
                    }
                  >
                    {image.is_active
                      ? 'Active'
                      : 'Hidden'}
                  </span>

                  <h3>{image.title}</h3>

                  <p>
                    {image.category} ·{' '}
                    {new Date(
                      image.created_at
                    ).toLocaleDateString()}
                  </p>

                  <div>
                    <button
                      onClick={() =>
                        edit(image)
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        toggle(image)
                      }
                    >
                      {image.is_active
                        ? 'Hide'
                        : 'Show'}
                    </button>

                    <button
                      className="delete"
                      onClick={() =>
                        remove(image)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* EMPTY STATE */}
          {!visible.length && (
            <div className="admin-empty">
              <b>◫</b>

              <h3>No images found</h3>

              <p>
                Upload a photograph or adjust your
                filters.
              </p>

              <button
                className="admin-primary"
                onClick={() =>
                  setUploadOpen(true)
                }
              >
                Upload photo
              </button>
            </div>
          )}
        </section>
      </section>

      {/* UPLOAD MODAL */}
      {uploadOpen && (
        <div
          className="upload-overlay"
          role="dialog"
          aria-modal="true"
        >
          <form
            className="upload-panel"
            onSubmit={upload}
          >
            <button
              className="close-upload"
              type="button"
              onClick={() =>
                setUploadOpen(false)
              }
            >
              ×
            </button>

            <p>ADD TO GALLERY</p>

            <h2>Upload a photograph</h2>

            {/* FILE DROP AREA */}
            <label
              className={
                file
                  ? 'drop-zone chosen'
                  : 'drop-zone'
              }
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFile(
                    e.target.files?.[0] || null
                  )
                }
              />

              <b>{file ? '✓' : '↑'}</b>

              <strong>
                {file
                  ? file.name
                  : 'Drag & drop an image here'}
              </strong>

              <span>
                {file
                  ? `${Math.round(
                      file.size / 1024
                    )} KB selected`
                  : 'or browse files from your device'}
              </span>
            </label>

            {/* FORM FIELDS */}
            <div className="upload-fields">
              <label>
                Title

                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Category

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                >
                  {categories.map((item) => (
                    <option key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="wide">
                Description

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description:
                        e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Display order

                <input
                  type="number"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      display_order: Number(
                        e.target.value
                      ),
                    })
                  }
                />
              </label>
            </div>

            {/* UPLOAD BUTTON */}
            <button
              className="admin-primary"
              disabled={busy}
            >
              {busy
                ? 'Uploading…'
                : 'Upload image'}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

function Metric({ value, label }) {
  return (
    <article>
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}