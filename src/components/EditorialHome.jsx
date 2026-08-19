import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getGallery } from '../services/gallery';
import { isSupabaseConfigured } from '../lib/supabase';

import {
  fallbackGallery,
  packages,
  services,
} from '../data';

import './editorial.css';
import PublicNav from './PublicNav';

const localPhotos = fallbackGallery.map(
  ([category, image_url], id) => ({
    id,
    category,
    image_url,
    title: category,
  })
);

export default function EditorialHome() {
  const [photos, setPhotos] = useState(localPhotos);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    /*
     * Load gallery images from Supabase
     */
    if (isSupabaseConfigured) {
      getGallery()
        .then((data) => {
          if (data.length) {
            setPhotos(data);
          }
        })
        .catch(() => {
          // Keep fallback gallery
        });
    }

    /*
     * Reveal sections on scroll
     */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    document
      .querySelectorAll(
        '.editorial-intro, ' +
        '.editorial-services, ' +
        '.portfolio-editorial, ' +
        '.story-editorial, ' +
        '.collections-editorial, ' +
        '.editorial-book'
      )
      .forEach((section) => {
        observer.observe(section);
      });

    /*
     * Navbar appearance
     */
    const onScroll = () => {
      setScrolled(window.scrollY > 28);
    };

    window.addEventListener(
      'scroll',
      onScroll,
      { passive: true }
    );

    return () => {
      observer.disconnect();
      window.removeEventListener(
        'scroll',
        onScroll
      );
    };
  }, []);

  return (
    <main className="editorial">

      {/* =====================================================
          HERO / LANDING PAGE
      ===================================================== */}

      <section className="editorial-hero">

        <PublicNav
          overHero={!scrolled}
        />

        {/* HERO IMAGE */}
        <img
          className="hero-image"
          src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e"
          alt="Green Hill Studio wedding photography"
        />

        {/* DARK CINEMATIC OVERLAY */}
        <div className="hero-overlay" />

        {/* SUBTLE GRAIN */}
        <div className="hero-grain" />

        <div className="editorial-nav-spacer" />

        {/* ================= HERO CONTENT ================= */}

        <div className="hero-copy-new">

          <div className="hero-eyebrow">
            <span className="hero-eyebrow-line" />
            <span>GREEN HILL STUDIO</span>
          </div>

          <h1>
            Candid &
            <br />
            <i>Cinematic</i>
            <br />
            Film
          </h1>

          <p className="hero-description">
            Wedding stories told with
            <br />
            emotion, movement and soul.
          </p>

          <div className="hero-location">
            <span>HALDWANI</span>
            <b>·</b>
            <span>GARUR</span>
            <b>·</b>
            <span>UTTARAKHAND</span>
          </div>

          <div className="hero-actions">

            <Link
              to="/gallery"
              className="editorial-button light"
            >
              Explore our stories
              <b>↗</b>
            </Link>

            <Link
              to="/booking"
              className="hero-secondary-link"
            >
              Book your date
              <span>→</span>
            </Link>

          </div>

        </div>


        {/* ================= HERO SIDE LABEL ================= */}

        <div className="hero-side-label">
          <span>WEDDING PHOTOGRAPHY</span>
          <i />
          <span>EST. UTTARAKHAND</span>
        </div>


        {/* ================= HERO BOTTOM INFO ================= */}

        <div className="hero-bottom">

          <div className="hero-bottom-item">
            <strong>01</strong>
            <span>
              WEDDINGS
            </span>
          </div>

          <div className="hero-bottom-item">
            <strong>02</strong>
            <span>
              PRE-WEDDINGS
            </span>
          </div>

          <div className="hero-bottom-item">
            <strong>03</strong>
            <span>
              CINEMATIC FILMS
            </span>
          </div>

          <div className="hero-bottom-note">
            <span>
              Creating photographs
              <br />
              that feel like memories.
            </span>
          </div>

        </div>


        {/* ================= SCROLL INDICATOR ================= */}

        <div className="scroll-cue">
          <span>SCROLL TO EXPLORE</span>
          <i />
        </div>

      </section>


      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section
        id="about"
        className="editorial-intro"
      >

        <img
          src="/images/pre1.jpeg"
          alt="Cinematic pre-wedding photography"
        />

        <div>

          <p className="kicker">
            OUR APPROACH
          </p>

          <h2>
            Memories, made
            <i> tangible.</i>
          </h2>

          <blockquote>
            “We don't simply photograph weddings.
            We preserve the emotions, people, and
            moments that make them yours.”
          </blockquote>

          <Link
            to="/services/wedding"
            className="text-link"
          >
            Discover our story
            <b>→</b>
          </Link>

        </div>

      </section>


      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section className="editorial-services">

        <div>

          <p className="kicker">
            WHAT WE CREATE
          </p>

          <h2>
            Stories with a
            <br />
            <i>lasting feeling.</i>
          </h2>

        </div>

        <ol>

          {services
            .slice(0, 5)
            .map(
              (
                [name, description, path],
                index
              ) => (
                <li key={name}>

                  <span>
                    0{index + 1}
                  </span>

                  <Link to={path}>

                    <strong>
                      {name}
                    </strong>

                    <em>
                      {description}
                    </em>

                    <b>
                      ↗
                    </b>

                  </Link>

                </li>
              )
            )}

        </ol>

      </section>


      {/* =====================================================
          PORTFOLIO
      ===================================================== */}

      <section className="portfolio-editorial">

        <header>

          <div>

            <p className="kicker">
              SELECTED WORK
            </p>

            <h2>
              Frames of
              <i> feeling.</i>
            </h2>

          </div>

          <Link
            to="/gallery"
            className="text-link"
          >
            Explore portfolio
            <b>→</b>
          </Link>

        </header>

        <div className="masonry">

          {photos
            .slice(0, 8)
            .map((photo, index) => (

              <Link
                key={photo.id}
                to="/gallery"
                className={`photo-${index + 1}`}
              >

                <img
                  loading="lazy"
                  src={photo.image_url}
                  alt={
                    photo.title ||
                    photo.category
                  }
                />

                <span>
                  {photo.category}
                </span>

              </Link>

            ))}

        </div>

      </section>


      {/* =====================================================
          STORIES
      ===================================================== */}

      <section
        id="stories"
        className="story-editorial"
      >

        <img
          src="/images/wed3.jpeg"
          alt="Wedding celebration"
        />

        <div>

          <p className="kicker">
            WEDDING STORIES
          </p>

          <h2>
            A celebration of love,
            family and
            <i> new beginnings.</i>
          </h2>

          <p>
            From quiet morning rituals to joyous
            late-night dancing, every frame carries
            a piece of the day.
          </p>

          <Link
            to="/gallery"
            className="editorial-button"
          >
            View story
            <b>↗</b>
          </Link>

        </div>

      </section>


      {/* =====================================================
          COLLECTIONS
      ===================================================== */}

      <section className="collections-editorial">

        <p className="kicker">
          THE COLLECTIONS
        </p>

        <h2>
          Made for your
          <i> once-in-a-lifetime</i>
          moments.
        </h2>

        <div>

          {packages.map(
            (p, index) => (

              <article
                key={p.slug}
              >

                <span>
                  0{index + 1}
                </span>

                <h3>
                  {p.name.replace(
                    'Package',
                    ''
                  )}
                </h3>

                <p>
                  {p.price}
                </p>

                <em>
                  {p.items
                    .slice(0, 2)
                    .join(' · ')}
                </em>

                <Link
                  to={`/packages/${p.slug}`}
                >
                  View collection
                  <b>→</b>
                </Link>

              </article>
            )
          )}

        </div>

      </section>


      {/* =====================================================
          BOOKING CTA
      ===================================================== */}

      <section className="editorial-book">

        <p className="kicker">
          YOUR STORY STARTS HERE
        </p>

        <h2>
          Let's create something
          <br />
          <i>worth remembering.</i>
        </h2>

        <Link
          to="/booking"
          className="editorial-button light"
        >
          Book your date
          <b>↗</b>
        </Link>

      </section>

    </main>
  );
}