import React from "react";
import { Link } from "react-router-dom";
import { preWedPackages } from "../../data";
import "./prewedding.css";

export default function PreWedding() {
  return (
    <main className="pre-wedding-page">

      {/* HERO */}
      <section className="pre-wedding-hero">

        <p className="pre-wedding-eyebrow">
          GREEN HILL STUDIO · PRE-WEDDING COLLECTIONS
        </p>

        <h1>
          Choose how your
          <br />
          <em>story is told.</em>
        </h1>

        <p className="pre-wedding-intro">
          Thoughtfully composed collections for
          <br />
          every meaningful celebration.
        </p>

      </section>


      {/* PACKAGES */}
      <section className="pre-wedding-packages">

        {preWedPackages.map((pkg, index) => (

          <article
            key={pkg.slug}
            className={`pre-wedding-package ${
              index === 2 ? "featured-package" : ""
            }`}
          >

            {/* NUMBER */}
            <div className="package-number">
              {String(index + 1).padStart(2, "0")}
            </div>


            {/* NAME + DESCRIPTION */}
            <div className="package-info">

              <h2>{pkg.name}</h2>

              <p>{pkg.description}</p>

            </div>


            {/* PRICE */}
            <div className="package-price">
              {pkg.price}
            </div>


            {/* ITEMS */}
            <div className="package-items">

              {pkg.items?.slice(0, 3).map((item, itemIndex) => (

                <span key={itemIndex}>
                  <b>✦</b> {item}
                </span>

              ))}

            </div>


            {/* LINK */}
            <Link
              to={`/pre-wedding/${pkg.slug}`}
              className="package-link"
            >
              EXPLORE COLLECTION <span>→</span>
            </Link>

          </article>

        ))}

      </section>

    </main>
  );
}