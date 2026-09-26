import React, {
  lazy,
  Suspense,
} from "react";

import {
  Link,
  Route,
  Routes,
  useParams,
} from "react-router-dom";

import PageLoader from "./components/PageLoader";
import PublicNav from "./components/PublicNav";

import {
  packages,
  preWedPackages,
  photoshootPackages,
  birthdayPackages,
  namingPackages,
  janeuPackages,
  retirementPackages,
  ringPackages,
} from "./data";


// =========================================================
// LAZY LOADED COMPONENTS
// =========================================================

const EditorialHome = lazy(() =>
  import("./components/EditorialHome")
);

const GalleryPage = lazy(() =>
  import("./components/Gallery").then(
    (module) => ({
      default: module.GalleryPage,
    })
  )
);

const Collections = lazy(() =>
  import("./components/Collections")
);

const PremiumPackages = lazy(() =>
  import("./components/PremiumPackages").then(
    (module) => ({
      default: module.PremiumPackages,
    })
  )
);

const PremiumPackageDetail = lazy(() =>
  import("./components/PremiumPackages").then(
    (module) => ({
      default: module.PremiumPackageDetail,
    })
  )
);

const PremiumBooking = lazy(() =>
  import("./components/PremiumBooking")
);

const AdminLoginPage = lazy(() =>
  import("./components/AdminLoginPage")
);

const AdminDashboard = lazy(() =>
  import("./components/AdminDashboard")
);

const AdminGuard = lazy(() =>
  import("./components/AdminGuard")
);


// =========================================================
// FOOTER
// =========================================================

const phone =
  "6397078586 | 8193079242";

function Footer() {
  return (
    <footer>
      <img
        src="/scanner.png"
        alt="Green Hill Studio QR code"
      />

      <p>
        <strong>
          GREEN HILL STUDIO
        </strong>
      </p>

      <p>
        📞 {phone}
      </p>

      <p>
        ✉️ greenhillstudio13@gmail.com
      </p>

      <p>
        © {new Date().getFullYear()}{" "}
        Green Hill Studio.
        All Rights Reserved.
      </p>
    </footer>
  );
}


// =========================================================
// LAYOUT
// =========================================================

function Layout({ children }) {
  return (
    <>
      <PublicNav />

      {children}

      <Footer />
    </>
  );
}


// =========================================================
// SERVICE PAGE
// =========================================================

function Service() {
  const { name } = useParams();

  const serviceMap = {
    // -----------------------------------------------------
    // WEDDING
    // -----------------------------------------------------

    wedding: {
      title: "Wedding Packages",

      eyebrow:
        "GREEN HILL STUDIO · WEDDING COLLECTIONS",

      intro:
        "Complete wedding photography and cinematography collections capturing every ritual, emotion, and celebration.",

      packages,
    },


    // -----------------------------------------------------
    // PRE-WEDDING
    // -----------------------------------------------------

    "pre-wedding": {
      title: "Pre-Wedding",

      eyebrow:
        "GREEN HILL STUDIO · PRE-WEDDING COLLECTIONS",

      intro:
        "Romantic and cinematic pre-wedding collections created to tell your love story before the big day.",

      packages: preWedPackages,
    },


    // -----------------------------------------------------
    // PHOTOSHOOT
    // -----------------------------------------------------

    photoshoot: {
      title: "Photoshoot",

      eyebrow:
        "GREEN HILL STUDIO · PHOTOSHOOT COLLECTIONS",

      intro:
        "Thoughtfully composed photography for couples, individuals, maternity, baby shoots, and special occasions.",

      packages: photoshootPackages,
    },


    // -----------------------------------------------------
    // BIRTHDAY
    // -----------------------------------------------------

    birthday: {
      title: "Birthday Ceremony",

      eyebrow:
        "GREEN HILL STUDIO · BIRTHDAY COLLECTIONS",

      intro:
        "Beautifully crafted collections for birthdays, family celebrations, and unforgettable moments.",

      packages: birthdayPackages,
    },


    // -----------------------------------------------------
    // NAMING CEREMONY
    // -----------------------------------------------------

    naming: {
      title: "Naming Ceremony",

      eyebrow:
        "GREEN HILL STUDIO · NAMING CEREMONY COLLECTIONS",

      intro:
        "Thoughtfully composed collections for your baby's special naming ceremony.",

      packages: namingPackages,
    },


    // -----------------------------------------------------
    // RING CEREMONY
    // -----------------------------------------------------

    ring: {
      title: "Ring Ceremony",

      eyebrow:
        "GREEN HILL STUDIO · RING CEREMONY COLLECTIONS",

      intro:
        "Elegant photography collections for engagement rituals, family moments, and celebrations.",

      packages: ringPackages,
    },


    // -----------------------------------------------------
    // JANEU
    // -----------------------------------------------------

    janeu: {
      title: "Janeu Ceremony",

      eyebrow:
        "GREEN HILL STUDIO · JANEU COLLECTIONS",

      intro:
        "Traditional photography collections capturing every sacred ritual and family moment.",

      packages: janeuPackages,
    },


    // -----------------------------------------------------
    // RETIREMENT
    // -----------------------------------------------------

    retirement: {
      title: "Retirement Celebration",

      eyebrow:
        "GREEN HILL STUDIO · RETIREMENT COLLECTIONS",

      intro:
        "Meaningful photography collections for celebrating a lifetime of achievements and memories.",

      packages: retirementPackages,
    },
  };


  const service = serviceMap[name];


  // =======================================================
  // UNKNOWN SERVICE
  // =======================================================

  if (!service) {
    return (
      <Layout>

        <main className="service-packages-page">

          <Link
            className="service-back"
            to="/"
          >
            ← Home
          </Link>

          <p className="service-eyebrow">
            GREEN HILL STUDIO
          </p>

          <h1>
            Photography Services
          </h1>

          <p className="service-intro">
            Explore our photography and
            cinematography services.
          </p>

        </main>

      </Layout>
    );
  }


  // =======================================================
  // SERVICE PAGE
  // =======================================================

  const servicePackages =
    Array.isArray(service.packages)
      ? service.packages
      : [];


  return (
    <Layout>

      <main className="service-packages-page">

        {/* BACK */}

        <Link
          className="service-back"
          to="/"
        >
          ← Home
        </Link>


        {/* HEADER */}

        <header className="service-packages-header">

          <p className="service-eyebrow">
            {service.eyebrow}
          </p>

          <h1>
            Choose how your
            <br />
            <i>story is told.</i>
          </h1>

          <p className="service-intro">
            {service.intro}
          </p>

        </header>


        {/* PACKAGES */}

        {servicePackages.length > 0 ? (

          <section className="service-package-list">

            {servicePackages.map(
              (pkg, index) => {

                const items =
                  Array.isArray(pkg.items)
                    ? pkg.items
                    : [];


                return (
                  <article
                    className="service-package"
                    key={
                      pkg.slug ||
                      `${name}-${index}`
                    }
                  >

                    {/* NUMBER */}

                    <span className="service-package-number">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>


                    {/* PACKAGE INFO */}

                    <div className="service-package-info">

                      <h2>
                        {pkg.name}
                      </h2>

                      {pkg.description && (
                        <p>
                          {pkg.description}
                        </p>
                      )}

                    </div>


                    {/* PRICE */}

                    <div className="service-package-price">

                      {pkg.price}

                      {pkg.extraDayPrice && (
                        <small>
                          {pkg.extraDayPrice}
                        </small>
                      )}

                    </div>


                    {/* ALL PACKAGE ITEMS */}

                    <div className="service-package-items">

                      {items.map(
                        (item, itemIndex) => (
                          <span
                            key={`${item}-${itemIndex}`}
                          >
                            <b>✦</b>
                            {item}
                          </span>
                        )
                      )}

                    </div>


                    {/* BOOKING LINK */}

                    <Link
                      className="service-package-link"
                      to={`/booking?service=${encodeURIComponent(
                        name
                      )}&package=${encodeURIComponent(
                        pkg.slug || ""
                      )}`}
                    >
                      Explore collection

                      <span>
                        →
                      </span>
                    </Link>

                  </article>
                );
              }
            )}

          </section>

        ) : (

          // =================================================
          // NO PACKAGES
          // =================================================

          <section className="service-no-packages">

            <p>
              COLLECTIONS COMING SOON
            </p>

            <h2>
              We are preparing
              <i>
                {" "}
                something special.
              </i>
            </h2>

            <Link
              to="/booking"
              className="service-package-link"
            >
              Enquire with the studio

              <span>
                →
              </span>
            </Link>

          </section>

        )}

      </main>

    </Layout>
  );
}


// =========================================================
// APP
// =========================================================

export default function App() {

  return (
    <Suspense
      fallback={<PageLoader />}
    >

      <Routes>

        {/* ===============================================
            HOME
        =============================================== */}

        <Route
          path="/"
          element={
            <EditorialHome />
          }
        />


        {/* ===============================================
            GALLERY
        =============================================== */}

        <Route
          path="/gallery"
          element={
            <GalleryPage />
          }
        />


        {/* ===============================================
            COLLECTIONS
        =============================================== */}

        <Route
          path="/collections"
          element={
            <Layout>
              <Collections />
            </Layout>
          }
        />


        {/* ===============================================
            MAIN WEDDING PACKAGES
        =============================================== */}

        <Route
          path="/packages"
          element={
            <Layout>
              <PremiumPackages />
            </Layout>
          }
        />


        {/* ===============================================
            WEDDING PACKAGE DETAIL
        =============================================== */}

        <Route
          path="/packages/:slug"
          element={
            <Layout>
              <PremiumPackageDetail />
            </Layout>
          }
        />


        {/* ===============================================
            ALL SERVICE COLLECTIONS

            Wedding
            Pre-Wedding
            Photoshoot
            Birthday
            Naming
            Ring
            Janeu
            Retirement
        =============================================== */}

        <Route
          path="/services/:name"
          element={
            <Service />
          }
        />


        {/* ===============================================
            BOOKING
        =============================================== */}

        <Route
          path="/booking"
          element={
            <Layout>
              <PremiumBooking />
            </Layout>
          }
        />


        {/* ===============================================
            ADMIN LOGIN
        =============================================== */}

        <Route
          path="/admin/login"
          element={
            <AdminLoginPage />
          }
        />


        {/* ===============================================
            ADMIN DASHBOARD
        =============================================== */}

        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          }
        />


        {/* ===============================================
            FALLBACK
        =============================================== */}

        <Route
          path="*"
          element={
            <EditorialHome />
          }
        />

      </Routes>

    </Suspense>
  );
}