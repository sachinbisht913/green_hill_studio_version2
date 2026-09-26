import React from "react";
import { Link } from "react-router-dom";

import { services } from "../data";

import "./collections.css";


// =========================================================
// COLLECTIONS
// =========================================================

export default function Collections() {

  // Wedding and Pre-Wedding are explicitly included first.
  // Then the remaining services are added without duplicates.

  const mainCollections = [
    [
      "Wedding Packages",
      "Complete wedding day coverage capturing every ritual, emotion, and celebration with cinematic photography and films.",
      "/services/wedding",
    ],

    [
      "Pre-Wedding",
      "Romantic and cinematic pre-wedding shoots at beautiful locations, telling your love story before the big day.",
      "/services/pre-wedding",
    ],
  ];


  const otherCollections = Array.isArray(services)
    ? services.filter(
        (service) =>
          Array.isArray(service) &&
          service.length >= 3 &&
          service[0] !== "Wedding Packages" &&
          service[0] !== "Pre-Wedding"
      )
    : [];


  const collectionServices = [
    ...mainCollections,
    ...otherCollections,
  ];


  return (
    <main className="collections-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="collections-hero">

        <p className="collections-eyebrow">
          WHAT WE CREATE
        </p>

        <h1>
          Stories with a
          <br />
          <i>lasting feeling.</i>
        </h1>

        <p className="collections-intro">
          Thoughtfully composed collections for
          every meaningful celebration.
        </p>

      </section>


      {/* =====================================================
          COLLECTION LIST
      ===================================================== */}

      <section className="collections-list">

        {collectionServices.map(
          ([name, description, path], index) => (

            <Link
              key={`${name}-${index}`}
              to={path}
              className="collection-row"
            >

              {/* NUMBER */}

              <span className="collection-number">
                {String(index + 1).padStart(2, "0")}
              </span>


              {/* NAME */}

              <h2>
                {name}
              </h2>


              {/* DESCRIPTION */}

              <p>
                {description}
              </p>


              {/* ARROW */}

              <span className="collection-arrow">
                ↗
              </span>

            </Link>

          )
        )}

      </section>

    </main>
  );
}