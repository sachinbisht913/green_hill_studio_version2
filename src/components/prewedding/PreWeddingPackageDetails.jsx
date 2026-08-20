import React from "react";
import { Link, useParams } from "react-router-dom";
import { preWedPackages } from "../../data";
import "./prewedpackagedetail.css";

export default function PreWeddingPackage() {
  const { slug } = useParams();

  const pkg = preWedPackages.find((item) => item.slug === slug);

  if (!pkg) {
    return (
      <main className="package-not-found">
        <h1>Package Not Found</h1>
        <Link to="/pre-wedding">← All Packages</Link>
      </main>
    );
  }

  return (
    <main className="prewedding-package-page">

      {/* Back */}
      <div className="package-container">
        <Link to="/pre-wedding" className="back-link">
          ← ALL PACKAGES
        </Link>
      </div>

      {/* Hero */}
      <section className="package-hero package-container">

        <div className="package-eyebrow">
          GREEN HILL STUDIO · PRE-WEDDING COLLECTION
        </div>

        <h1>
          {pkg.name}
          <br />
          <em>Collection.</em>
        </h1>

        <div className="package-price">
          {pkg.price}
        </div>

        <p className="package-description">
          {pkg.description}
        </p>

        <Link to="/booking" className="package-book-btn">
          BOOK THIS COLLECTION
          <span>↗</span>
        </Link>

      </section>

      {/* Included Section */}
      <section className="package-included package-container">

        <div className="included-intro">

          <div className="section-label">
            WHAT'S INCLUDED
          </div>

          <h2>
            A complete
            <br />
            <em>pre-wedding story.</em>
          </h2>

          <p>
            Every collection is delivered with the Green Hill Studio
            attention to detail.
          </p>

        </div>

       <div className="included-content">

  <div className="included-category">

    <h3>What's Included</h3>

    <div className="included-grid">

      <ul>
        {pkg.items
          .slice(0, Math.ceil(pkg.items.length / 2))
          .map((item, index) => (
            <li key={index}>{item}</li>
          ))}
      </ul>

      <ul>
        {pkg.items
          .slice(Math.ceil(pkg.items.length / 2))
          .map((item, index) => (
            <li key={index}>{item}</li>
          ))}
      </ul>

    </div>

  </div>

</div>

      </section>

      {/* Bottom CTA */}
      <section className="package-cta package-container">

        <span className="cta-number">01</span>

        <p>
          Crafted around your story, your connection
          <br />
          — never just a checklist.
        </p>

        <Link to="/booking">
          RESERVE YOUR DATE →
        </Link>

      </section>

    </main>
  );
}