import React, {
  useEffect,
  useState,
} from "react";

import {
  categories,
  getGallery,
} from "../services/gallery";

import {
  isSupabaseConfigured,
} from "../lib/supabase";

import {
  fallbackGallery,
} from "../data";

import PublicNav from "./PublicNav";


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
   GALLERY
========================================================= */

export default function Gallery({

  category = "",

  limit,

}) {

  const [items, setItems] = useState([]);

  const [loading, setLoading] =
    useState(isSupabaseConfigured);


  useEffect(() => {

    let cancelled = false;


    async function loadGallery() {

      /* =========================================
         SUPABASE NOT CONFIGURED
      ========================================= */

      if (!isSupabaseConfigured) {

        const fallback =
          createFallbackGallery();


        /*
         * IMPORTANT:
         * Filter fallback images too.
         */

        const filtered =
          category
            ? fallback.filter(
                (item) =>
                  item.category
                    ?.trim()
                    .toLowerCase() ===
                  category
                    .trim()
                    .toLowerCase()
              )
            : fallback;


        if (!cancelled) {

          setItems(filtered);

          setLoading(false);

        }

        return;

      }


      /* =========================================
         LOAD FROM SUPABASE
      ========================================= */

      setLoading(true);


      try {

        /*
         * getGallery(category) should return
         * only the selected category.
         */

        const data =
  await getGallery(category, limit);


        if (cancelled) {
          return;
        }


        /*
         * Extra frontend filtering.
         *
         * This protects us if getGallery()
         * returns more records than expected.
         */

        const filtered =
          category
            ? data.filter(
                (item) =>
                  item.category
                    ?.trim()
                    .toLowerCase() ===
                  category
                    .trim()
                    .toLowerCase()
              )
            : data;


        setItems(filtered);

      }

      catch (error) {

        console.error(
          "Gallery loading failed:",
          error
        );


        /*
         * IMPORTANT:
         *
         * If a category was selected,
         * DON'T show unrelated fallback images.
         */

        if (!cancelled) {

          const fallback =
            createFallbackGallery();


          const filtered =
            category
              ? fallback.filter(
                  (item) =>
                    item.category
                      ?.trim()
                      .toLowerCase() ===
                    category
                      .trim()
                      .toLowerCase()
                )
              : fallback;


          setItems(filtered);

        }

      }

      finally {

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


  /* =========================================
     LIMIT
  ========================================= */

  const shown = limit
    ? items.slice(0, limit)
    : items;


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="gallery-grid gallery-skeleton-grid">
        {Array.from({ length: limit || 6 }).map((_, index) => (
          <div
            className="gallery-skeleton"
            key={index}
          />
        ))}
      </div>
    );
  }


  /* =========================================
     EMPTY CATEGORY
  ========================================= */

  if (!shown.length) {

    return (

      <div className="gallery-empty">

        <div className="gallery-empty-icon">
          ✦
        </div>

        <h3>
          No {category || "photographs"} yet
        </h3>

        <p>
          We haven't added photographs to
          this collection yet.
        </p>

      </div>

    );

  }


  /* =========================================
     GALLERY GRID
  ========================================= */

  return (

    <div className="gallery-grid">

      {shown.map(
        (item, index) => (

          <figure
            key={item.id}
            className="gallery-card"
          >

<img
  src={item.thumb_url || item.image_url}
  srcSet={
    item.thumb_url
      ? `
          ${item.thumb_url} 400w,
          ${item.medium_url} 800w,
          ${item.large_url} 1200w
        `
      : undefined
  }
  sizes="
    (max-width: 600px) 92vw,
    (max-width: 1000px) 45vw,
    30vw
  "
  loading={index === 0 ? "eager" : "lazy"}
  decoding="async"
  fetchPriority={index === 0 ? "high" : "auto"}
  width="900"
  height="1100"
  alt={
    item.title ||
    item.category ||
    "Green Hill Studio photograph"
  }
  onLoad={(event) => {
    event.currentTarget.classList.add("loaded");
  }}
  className="gallery-image"

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
    useState("");


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
            : "Wedding Stories"}

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
                ? "active"
                : ""
            }

            onClick={() =>
              setFilter("")
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
                    ? "active"
                    : ""
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