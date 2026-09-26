import React, { useEffect, useState } from 'react';
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import './public-nav.css';

export default function PublicNav({ overHero = false }) {
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const close = () => setOpen(false);

  /*
   * Keep the Home page at the top when navigating
   * directly to "/".
   */
  useEffect(() => {
    if (
      location.pathname === '/' &&
      !location.hash
    ) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      });
    }
  }, [location.pathname, location.hash]);

  /*
   * HOME
   *
   * Always return to the top of the Home page.
   */
  const handleHome = () => {
    close();

    if (location.pathname === '/') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } else {
      navigate('/');
    }
  };

  /*
   * ABOUT
   *
   * If already on Home, smoothly scroll to About.
   * Otherwise navigate to Home + #about.
   */
  const handleAbout = (e) => {
    e.preventDefault();
    close();

    if (location.pathname === '/') {
      const aboutSection =
        document.getElementById('about');

      if (aboutSection) {
        aboutSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    } else {
      navigate('/#about');
    }
  };

  return (
    <nav
      className={`public-nav ${
        overHero ? 'over-hero' : ''
      }`}
      aria-label="Main navigation"
    >
      {/* LOGO */}
      <Link
        className="public-brand"
        to="/"
        onClick={handleHome}
      >
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

      {/* MOBILE MENU */}
      <button
        className="public-menu"
        type="button"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* NAVIGATION LINKS */}
      <div
        className={
          open
            ? 'public-links open'
            : 'public-links'
        }
      >
        {/* HOME */}
        <button
          type="button"
          className="nav-home-button"
          onClick={handleHome}
        >
          Home
        </button>

        {/* ABOUT */}
        <a
          href="/#about"
          onClick={handleAbout}
        >
          About
        </a>

        {/* GALLERY */}
        <NavLink
          to="/gallery"
          onClick={close}
        >
          Gallery
        </NavLink>

        {/* COLLECTIONS */}
        <NavLink
          to="/collections"
          onClick={close}
        >
          Collections
        </NavLink>

       

        {/* BOOKING */}
        <NavLink
          to="/booking"
          onClick={close}
        >
          Booking
        </NavLink>

        {/* ADMIN */}
        <NavLink
          className="nav-admin"
          to="/admin/login"
          onClick={close}
        >
          Admin
        </NavLink>
      </div>
    </nav>
  );
}