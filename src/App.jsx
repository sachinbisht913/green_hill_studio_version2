import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';

import { supabase, isSupabaseConfigured } from './lib/supabase';

import {
  categories,
  getAllGallery,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from './services/gallery';

import { services, packages } from './data';

import AdminGuard from './components/AdminGuard';
import AdminLoginPage from './components/AdminLoginPage';
import EditorialHome from './components/EditorialHome';
import AdminDashboard from './components/AdminDashboard';
import PremiumBooking from './components/PremiumBooking';
import PublicNav from './components/PublicNav';

import {
  PremiumPackages,
  PremiumPackageDetail,
} from './components/PremiumPackages';

import Gallery, { GalleryPage } from './components/Gallery';

const phone = '6397078586 | 8193079242';

function Footer() {
  return (
    <footer>
      <img
        src="/scanner.png"
        alt="Green Hill Studio QR code"
      />

      <p>
        <strong>GREEN HILL STUDIO</strong>
      </p>

      <p>📞 {phone}</p>

      <p>✉️ greenhillstudio13@gmail.com</p>

      <p>
        © {new Date().getFullYear()} Green Hill Studio. All Rights Reserved.
      </p>
    </footer>
  );
}

function Layout({ children }) {
  return (
    <>
      <PublicNav />
      {children}
      <Footer />
    </>
  );
}

function Home() {
  return (
    <Layout>
      <section className="section">
        <p className="eyebrow">OUR SERVICES</p>

        <h2>Moments made timeless</h2>

        <div className="card-grid">
          {services.map(([name, desc, path]) => (
            <article
              className="service-card"
              key={name}
            >
              <h3>{name}</h3>

              <p>{desc}</p>

              <Link to={path}>
                See More <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <GalleryPreview />

      <section className="cta">
        <p className="eyebrow">LET’S CELEBRATE</p>

        <h2>
          Your story deserves to be remembered beautifully.
        </h2>

        <Link
          className="button"
          to="/booking"
        >
          Book your date
        </Link>
      </section>
    </Layout>
  );
}

function GalleryPreview() {
  return (
    <section className="section gallery-section">
      <p className="eyebrow">WEDDING STORIES</p>

      <h2>Love, in every frame</h2>

      <Gallery limit={6} />

      <div className="center">
        <Link
          className="button outline"
          to="/gallery"
        >
          View all stories
        </Link>
      </div>
    </section>
  );
}

function Packages() {
  return (
    <Layout>
      <main className="section page">
        <p className="eyebrow">
          WEDDING COLLECTIONS
        </p>

        <h1>
          Packages tailored to your celebration
        </h1>

        <div className="package-grid">
          {packages.map((p) => (
            <article
              className="package-card"
              key={p.slug}
            >
              <h2>{p.name}</h2>

              <p className="price">
                {p.price}
              </p>

              <ul>
                {p.items.slice(0, 6).map((x) => (
                  <li key={x}>
                    {x}
                  </li>
                ))}
              </ul>

              <Link
                className="button"
                to={`/packages/${p.slug}`}
              >
                View details
              </Link>
            </article>
          ))}
        </div>
      </main>
    </Layout>
  );
}

function PackageDetail() {
  const { slug } = useParams();

  const p = packages.find(
    (x) => x.slug === slug
  );

  if (!p) {
    return <Packages />;
  }

  return (
    <Layout>
      <main className="section package-detail">
        <Link
          className="back"
          to="/packages"
        >
          ← All packages
        </Link>

        <article className="detail-card">
          <p className="eyebrow">
            WEDDING PACKAGE
          </p>

          <h1>{p.name}</h1>

          <p className="price">
            {p.price}
          </p>

          <ul>
            {p.items.map((x) => (
              <li key={x}>
                ✦ {x}
              </li>
            ))}
          </ul>

          <Link
            className="button"
            to={`/booking?package=${p.slug}`}
          >
            Book this package
          </Link>
        </article>
      </main>
    </Layout>
  );
}

function Service() {
  const { name } = useParams();

  const item = services.find(
    (x) => x[2] === `/services/${name}`
  );

  return (
    <Layout>
      <main className="section package-detail">
        <Link
          className="back"
          to="/"
        >
          ← Home
        </Link>

        <article className="detail-card">
          <p className="eyebrow">
            GREEN HILL STUDIO
          </p>

          <h1>
            {item?.[0] || 'Photography Services'}
          </h1>

          <p>{item?.[1]}</p>

          <Gallery
            category={
              name === 'pre-wedding'
                ? 'Pre-Wedding'
                : name === 'ring'
                  ? 'Engagement / Ring Ceremony'
                  : undefined
            }
            limit={3}
          />

          <Link
            className="button"
            to="/booking"
          >
            Enquire now
          </Link>
        </article>
      </main>
    </Layout>
  );
}

function Booking() {
  const nav = useNavigate();

  const initial =
    packages.find(
      (p) =>
        p.slug ===
        new URLSearchParams(
          location.search
        ).get('package')
    )?.name || '';

  const [data, setData] = useState({
    name: '',
    phone: '',
    email: '',
    couple: '',
    address: '',
    package: initial,
    notes: '',
    events: [
      {
        name: '',
        date: '',
        time: '',
      },
    ],
  });

  const [errors, setErrors] = useState({});

  const change = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const eventChange = (i, key, value) => {
    setData({
      ...data,
      events: data.events.map(
        (e, n) =>
          n === i
            ? {
                ...e,
                [key]: value,
              }
            : e
      ),
    });
  };

  function submit(e) {
    e.preventDefault();

    let er = {};

    if (!data.name.trim()) {
      er.name = 'Please enter your name.';
    }

    if (
      !/^\+?[0-9\s-]{10,15}$/.test(
        data.phone
      )
    ) {
      er.phone =
        'Enter a valid phone number.';
    }

    if (!data.address.trim()) {
      er.address =
        'Please enter the event address.';
    }

    if (!data.package) {
      er.package =
        'Please select a package.';
    }

    data.events.forEach((x) => {
      if (!x.name || !x.date || !x.time) {
        er.events =
          'Complete every event entry or remove it.';
      }
    });

    setErrors(er);

    if (Object.keys(er).length) {
      return;
    }

    const events = data.events
      .map(
        (x, i) =>
          `Event ${i + 1}: ${x.name} | ${x.date} | ${x.time}`
      )
      .join('\n');

    const msg =
      `📸 *NEW BOOKING – GREEN HILL STUDIO*\n\n` +
      `*Package:* ${data.package}\n` +
      `*Name:* ${data.name}\n` +
      `*Phone:* ${data.phone}\n` +
      `*Email:* ${data.email || 'Not provided'}\n` +
      `*Couple:* ${data.couple || 'Not provided'}\n\n` +
      `*Events:*\n${events}\n\n` +
      `*Address:* ${data.address}\n` +
      `*Notes:* ${data.notes || 'None'}`;

    const number =
      import.meta.env.VITE_WHATSAPP_NUMBER;

    if (!number) {
      setErrors({
        form:
          'Booking setup is incomplete. Please call the studio directly.',
      });

      return;
    }

    window.open(
      `https://wa.me/${number.replace(
        /\D/g,
        ''
      )}?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener'
    );
  }

  return (
    <Layout>
      <main className="booking-wrap">
        <form
          className="booking-card"
          onSubmit={submit}
        >
          <p className="eyebrow">
            GREEN HILL STUDIO
          </p>

          <h1>Booking Form</h1>

          <p className="form-intro">
            Ph: {phone} · greenhillstudio13@gmail.com
          </p>

          {errors.form && (
            <p className="error">
              {errors.form}
            </p>
          )}

          <div className="form-grid">
            <Field
              label="Name *"
              error={errors.name}
            >
              <input
                value={data.name}
                onChange={(e) =>
                  change(
                    'name',
                    e.target.value
                  )
                }
              />
            </Field>

            <Field
              label="Phone No. *"
              error={errors.phone}
            >
              <input
                inputMode="tel"
                value={data.phone}
                onChange={(e) =>
                  change(
                    'phone',
                    e.target.value
                  )
                }
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                value={data.email}
                onChange={(e) =>
                  change(
                    'email',
                    e.target.value
                  )
                }
              />
            </Field>

            <Field label="Couple Name">
              <input
                value={data.couple}
                onChange={(e) =>
                  change(
                    'couple',
                    e.target.value
                  )
                }
              />
            </Field>
          </div>

          <label>Event details *</label>

          {data.events.map((ev, i) => (
            <div
              className="event-row"
              key={i}
            >
              <input
                placeholder="Event name"
                value={ev.name}
                onChange={(e) =>
                  eventChange(
                    i,
                    'name',
                    e.target.value
                  )
                }
              />

              <input
                type="date"
                value={ev.date}
                onChange={(e) =>
                  eventChange(
                    i,
                    'date',
                    e.target.value
                  )
                }
              />

              <input
                type="time"
                value={ev.time}
                onChange={(e) =>
                  eventChange(
                    i,
                    'time',
                    e.target.value
                  )
                }
              />

              {data.events.length > 1 && (
                <button
                  type="button"
                  className="remove"
                  onClick={() =>
                    change(
                      'events',
                      data.events.filter(
                        (_, n) => n !== i
                      )
                    )
                  }
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {errors.events && (
            <p className="error">
              {errors.events}
            </p>
          )}

          <button
            type="button"
            className="add"
            onClick={() =>
              change(
                'events',
                [
                  ...data.events,
                  {
                    name: '',
                    date: '',
                    time: '',
                  },
                ]
              )
            }
          >
            + Add another event
          </button>

          <div className="form-grid">
            <Field
              label="Address *"
              error={errors.address}
            >
              <input
                value={data.address}
                onChange={(e) =>
                  change(
                    'address',
                    e.target.value
                  )
                }
              />
            </Field>

            <Field
              label="Selected package *"
              error={errors.package}
            >
              <select
                value={data.package}
                onChange={(e) =>
                  change(
                    'package',
                    e.target.value
                  )
                }
              >
                <option value="">
                  Choose a package
                </option>

                {packages.map((p) => (
                  <option key={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Booking notes">
            <textarea
              value={data.notes}
              onChange={(e) =>
                change(
                  'notes',
                  e.target.value
                )
              }
            />
          </Field>

          <Payment />

          <button className="button submit">
            Prepare WhatsApp booking
          </button>
        </form>
      </main>
    </Layout>
  );
}

function Field({
  label,
  error,
  children,
}) {
  return (
    <div className="field">
      <label>{label}</label>

      {children}

      {error && (
        <small className="error">
          {error}
        </small>
      )}
    </div>
  );
}

function Payment() {
  return (
    <aside className="payment">
      <h2>Mode of Payment</h2>

      <div>
        <span>20% at Booking</span>
        <span>60% Before Event Day</span>
        <span>20% on Final Delivery</span>
      </div>

      <p>
        Booking without advance payment will not
        be considered. Transportation and electricity
        arrangements are the customer's responsibility.
        Full payment is required before delivery.
      </p>
    </aside>
  );
}

function AdminLogin() {
  const nav = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] =
    useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function login(e) {
    e.preventDefault();

    if (!supabase) {
      return setMessage(
        'Supabase is not configured. Add your environment values first.'
      );
    }

    setBusy(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setBusy(false);

    if (error) {
      return setMessage(
        'Unable to sign in. Check your email and password.'
      );
    }

    nav('/admin');
  }

  return (
    <main className="admin-login">
      <form
        className="login-card"
        onSubmit={login}
      >
        <p className="eyebrow">
          GREEN HILL STUDIO
        </p>

        <h1>Admin sign in</h1>

        <p>For the studio owner only.</p>

        <Field label="Email">
          <input
            type="email"
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </Field>

        <Field label="Password">
          <input
            type="password"
            required
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </Field>

        {message && (
          <p className="error">
            {message}
          </p>
        )}

        <button
          className="button"
          disabled={busy}
        >
          {busy
            ? 'Signing in…'
            : 'Sign in'}
        </button>
      </form>
    </main>
  );
}

function Admin() {
  const nav = useNavigate();

  const [session, setSession] =
    useState(undefined);

  const [images, setImages] = useState([]);
  const [notice, setNotice] =
    useState('');
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Wedding',
    file: null,
  });

  useEffect(() => {
    if (!supabase) {
      setSession(null);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data }) =>
        setSession(data.session)
      );

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_e, s) => setSession(s)
    );

    return () =>
      subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      getAllGallery()
        .then(setImages)
        .catch(() =>
          setNotice(
            'Could not load gallery images.'
          )
        );
    }
  }, [session]);

  if (session === undefined) {
    return (
      <main className="admin-page">
        Loading…
      </main>
    );
  }

  if (!session) {
    nav('/admin/login');
    return null;
  }

  async function upload(e) {
    e.preventDefault();

    if (!form.file) {
      return setNotice(
        'Please choose an image.'
      );
    }

    setBusy(true);

    try {
      await uploadGalleryImage(form);

      setForm({
        title: '',
        description: '',
        category: 'Wedding',
        file: null,
      });

      setImages(await getAllGallery());

      setNotice(
        'Image uploaded successfully.'
      );
    } catch {
      setNotice(
        'Upload failed. Confirm your admin role and storage policies.'
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove(img) {
    if (
      !confirm(
        `Delete “${img.title}”?`
      )
    ) {
      return;
    }

    try {
      await deleteGalleryImage(img);

      setImages(
        images.filter(
          (x) => x.id !== img.id
        )
      );
    } catch {
      setNotice(
        'Unable to delete this image'
      );
    }
  }

  async function toggle(img) {
    try {
      await updateGalleryImage(
        img.id,
        {
          is_active: !img.is_active,
        }
      );

      setImages(
        images.map((x) =>
          x.id === img.id
            ? {
                ...x,
                is_active:
                  !x.is_active,
              }
            : x
        )
      );
    } catch {
      setNotice(
        'Unable to update this image.'
      );
    }
  }

  return (
    <main className="admin-page">
      <header className="admin-head">
        <div>
          <p className="eyebrow">
            DASHBOARD
          </p>

          <h1>Gallery management</h1>
        </div>

        <button
          className="button outline"
          onClick={() =>
            supabase.auth.signOut()
          }
        >
          Log out
        </button>
      </header>

      <div className="admin-grid">
        <form
          className="upload-card"
          onSubmit={upload}
        >
          <h2>Upload new image</h2>

          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category:
                    e.target.value,
                })
              }
            >
              {categories.map((c) => (
                <option key={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Title">
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
          </Field>

          <Field label="Description (optional)">
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
          </Field>

          <Field label="Image">
            <input
              required
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm({
                  ...form,
                  file: e.target.files[0],
                })
              }
            />
          </Field>

          <button
            className="button"
            disabled={busy}
          >
            {busy
              ? 'Uploading…'
              : 'Upload image'}
          </button>

          {notice && (
            <p className="admin-notice">
              {notice}
            </p>
          )}
        </form>

        <section>
          <h2>
            Existing images{' '}
            <small>
              ({images.length})
            </small>
          </h2>

          <div className="admin-images">
            {images.map((img) => (
              <article
                key={img.id}
                className={
                  !img.is_active
                    ? 'inactive'
                    : ''
                }
              >
                <img
                  src={img.image_url}
                  alt={img.title}
                />

                <div>
                  <strong>
                    {img.title}
                  </strong>

                  <small>
                    {img.category} ·{' '}
                    {new Date(
                      img.created_at
                    ).toLocaleDateString()}
                  </small>

                  <div>
                    <button
                      onClick={() =>
                        toggle(img)
                      }
                    >
                      {img.is_active
                        ? 'Disable'
                        : 'Enable'}
                    </button>

                    <button
                      className="danger"
                      onClick={() =>
                        remove(img)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
  path="/"
  element={<EditorialHome />}
/>

<Route
  path="/gallery"
  element={<GalleryPage />}
/>

<Route
  path="/packages"
  element={
    <Layout>
      <PremiumPackages />
    </Layout>
  }
/>

<Route
  path="/packages/:slug"
  element={
    <Layout>
      <PremiumPackageDetail />
    </Layout>
  }
/>

<Route
  path="/services/:name"
  element={<Service />}
/>

<Route
  path="/booking"
  element={
    <Layout>
      <PremiumBooking />
    </Layout>
  }
/>

<Route
  path="/admin/login"
  element={<AdminLoginPage />}
/>

<Route
  path="/admin"
  element={
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  }
/>

<Route
  path="*"
  element={<EditorialHome />}
/>
    </Routes>
  );
}