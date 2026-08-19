import React, {
  useEffect,
  useState,
} from 'react';

import {
  categories,
  getGallery,
} from '../services/gallery';

import {
  isSupabaseConfigured,
} from '../lib/supabase';

import {
  fallbackGallery,
} from '../data';

import PublicNav from './PublicNav';


/* =========================================================
   FALLBACK GALLERY
========================================================= */

function createFallbackGallery() {
  return fallbackGallery.map(
    ([category, image_url], index) => ({
      id: `fallback-${index}`,
      category,
      image_url,
      title: category,
    })
  );
}


/* =========================================================
   GALLERY GRID
========================================================= */

export default function Gallery({
  category = '',
  limit,
}) {
  const [items, setItems] =
    useState([]);

  const [loading, setLoading] =
    useState(isSupabaseConfigured);


  useEffect(() => {
    let cancelled = false;

    async function loadGallery() {

      /* -----------------------------------------
         SUPABASE NOT CONFIGURED
      ----------------------------------------- */

      if (!isSupabaseConfigured) {
        if (!cancelled) {
          setItems(
            createFallbackGallery()
          );

          setLoading(false);
        }

        return;
      }


      /* -----------------------------------------
         LOAD FROM SUPABASE
      ----------------------------------------- */

      setLoading(true);

      try {
        const data =
          await getGallery(category);


        if (cancelled) {
          return;
        }


        /*
         * IMPORTANT:
         *
         * DO NOT use:
         *
         * data.length
         *   ? data
         *   : createFallbackGallery()
         *
         * because an empty result for Birthday,
         * Party, etc. is a valid result.
         */

        setItems(data);


      } catch (error) {

        console.error(
          'Gallery loading failed:',
          error
        );


        /*
         * Fallback only when Supabase
         * request actually fails.
         */
        if (!cancelled) {
          setItems(
            createFallbackGallery()
          );
        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }
    }


    loadGallery();


    return () => {
      cancelled = true;
    };

  }, [category]);


  /* -----------------------------------------
     LIMIT RESULTS
  ----------------------------------------- */

  const shown = limit
    ? items.slice(0, limit)
    : items;


  /* -----------------------------------------
     LOADING
  ----------------------------------------- */

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="gallery-spinner" />

        <span>
          Loading photographs…
        </span>
      </div>
    );
  }


  /* -----------------------------------------
     EMPTY CATEGORY
  ----------------------------------------- */

  if (!shown.length) {
    return (
      <div className="gallery-empty">

        <h3>
          No photographs found
        </h3>

        <p>
          There are no photographs in this
          category yet.
        </p>

      </div>
    );
  }


  /* -----------------------------------------
     GALLERY
  ----------------------------------------- */

  return (
    <div className="gallery-grid">

      {shown.map(
        (item, index) => (

          <figure
            key={item.id}
            className="gallery-card"
          >

            <img
              src={
                item.thumb_url ||
                item.image_url
              }

              srcSet={
                item.thumb_url
                  ? `
                    ${item.thumb_url} 500w,
                    ${item.medium_url} 900w,
                    ${item.large_url} 1400w
                  `
                  : undefined
              }

              sizes="
                (max-width: 600px) 92vw,
                (max-width: 1000px) 45vw,
                30vw
              "

              /*
               * First two images load immediately.
               * Rest are lazy loaded.
               */
              loading={
                index < 2
                  ? 'eager'
                  : 'lazy'
              }

              decoding="async"

              fetchPriority={
                index < 2
                  ? 'high'
                  : 'auto'
              }

              width="900"
              height="1100"

              alt={
                item.title ||
                item.category ||
                'Green Hill Studio photograph'
              }
            />

            <figcaption>
              {item.title ||
                item.category}
            </figcaption>

          </figure>

        )
      )}

    </div>
  );
}


/* =========================================================
   GALLERY PAGE
========================================================= */

export function GalleryPage() {

  const [filter, setFilter] =
    useState('');


  return (
    <>
      <PublicNav />


      <main className="section page">


        {/* =====================================
            HEADER
        ===================================== */}

        <p className="eyebrow">
          OUR GALLERY
        </p>


        <h1>
          {filter
            ? `${filter} Stories`
            : 'Wedding Stories'}
        </h1>


        {/* =====================================
            FILTERS
        ===================================== */}

        <div className="filters">


          {/* ALL */}

          <button
            type="button"

            className={
              !filter
                ? 'active'
                : ''
            }

            onClick={() =>
              setFilter('')
            }
          >
            All
          </button>


          {/* CATEGORIES */}

          {categories.map(
            (category) => (

              <button
                type="button"

                key={category}

                className={
                  filter === category
                    ? 'active'
                    : ''
                }

                onClick={() =>
                  setFilter(category)
                }
              >
                {category}
              </button>

            )
          )}

        </div>


        {/* =====================================
            GALLERY
        ===================================== */}

        <Gallery
          category={filter}
        />


      </main>
    </>
  );
}