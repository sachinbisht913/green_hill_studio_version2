import React from "react";
import { Link, useParams } from "react-router-dom";
import { packages } from "../data";
import "./premium-pages.css";
const icons = ["◈", "◉", "✦", "▱"];
export function PremiumPackages() {
  return (
    <main className="premium-page collections-page">
      <header>
        <p>GREEN HILL STUDIO · WEDDING COLLECTIONS</p>
        <h1>
          Choose how your
          <br />
          <i>story is told.</i>
        </h1>
        <span>
          Thoughtfully composed collections for every meaningful celebration.
        </span>
      </header>
      <section className="collection-list">
        {packages.map((p, i) => (
          <article className={i === 2 ? "featured" : ""} key={p.slug}>
            {i === 2 && <b className="most-chosen">Most chosen</b>}
            <div className="collection-number">0{i + 1}</div>
            <div>
              <h2>{p.name}</h2>
              <p>
                {i === 0
                  ? "For beautifully captured wedding memories."
                  : i === 1
                  ? "For a richer cinematic wedding story."
                  : i === 2
                  ? "Our complete storytelling experience."
                  : "For a grand, two-sided celebration."}
              </p>
            </div>
            <strong>{p.price}</strong>
            <ul>
              {p.items.slice(0, 3).map((x, n) => (
                <li key={x}>
                  <i>{icons[n]}</i>
                  {x}
                </li>
              ))}
            </ul>
            <Link to={`/packages/${p.slug}`}>
              Explore collection <b>→</b>
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
export function PremiumPackageDetail() {
  const { slug } = useParams();
  const p = packages.find((x) => x.slug === slug);
  if (!p) return <PremiumPackages />;
  const groups = [
    ["Photography & Film", p.items.slice(0, 5)],
    ["Creative Deliverables", p.items.slice(5, 9)],
    ["Keepsakes", p.items.slice(9)],
  ];
  return (
    <main className="premium-page package-presentation">
      <Link className="collection-back" to="/packages">
        ← All collections
      </Link>
      <header>
        <p>GREEN HILL STUDIO · WEDDING COLLECTION</p>
        <h1>
          {p.name.replace("Package", "")}
          <br />
          <i>Collection.</i>
        </h1>
        <strong>{p.price}</strong>
        <span>
          Everything you need to preserve the feeling of your wedding day — with
          care, craft, and a cinematic eye.
        </span>
        <Link className="premium-cta" to={`/booking?package=${p.slug}`}>
          Book this collection <b>↗</b>
        </Link>
      </header>
      <section className="inclusion-section">
        <aside>
          <p>WHAT’S INCLUDED</p>
          <h2>
            A complete
            <br />
            <i>memory archive.</i>
          </h2>
          <small>
            Every collection is delivered with the Green Hill Studio attention
            to detail.
          </small>
        </aside>
        <div>
          {groups.map(([name, items]) =>
            items.length ? (
              <article key={name}>
                <h3>{name}</h3>
                <ul>
                  {items.map((item) => (
                    <li key={item}>
                      <i>✦</i>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ) : null
          )}
        </div>
      </section>
      <section className="package-note">
        <span>01</span>
        <p>
          Crafted around your celebrations, rituals and people — never just a
          checklist.
        </p>
        <Link to={`/booking?package=${p.slug}`}>Reserve your date →</Link>
      </section>
    </main>
  );
}
