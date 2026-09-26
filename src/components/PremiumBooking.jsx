import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  packages,
  preWedPackages,
  photoshootPackages,
  birthdayPackages,
  namingPackages,
  ringPackages,
  janeuPackages,
  retirementPackages,
} from "../data";

import "./premium-pages.css";

export default function PremiumBooking() {
  /* =========================================================
     SERVICE / PACKAGE GROUPS
  ========================================================= */

  const serviceOptions = [
    {
      value: "Wedding Packages",
      label: "Wedding Packages",
      packages,
    },
    {
      value: "Pre-Wedding",
      label: "Pre-Wedding",
      packages: preWedPackages,
    },
    {
      value: "Photoshoot",
      label: "Photoshoot",
      packages: photoshootPackages,
    },
    {
      value: "Birthday Ceremony",
      label: "Birthday Ceremony",
      packages: birthdayPackages,
    },
    {
      value: "Naming Ceremony",
      label: "Naming Ceremony",
      packages: namingPackages,
    },
    {
      value: "Ring Ceremony",
      label: "Ring Ceremony",
      packages: ringPackages,
    },
    {
      value: "Janeu Package",
      label: "Janeu Package",
      packages: janeuPackages,
    },
    {
      value: "Retirement Package",
      label: "Retirement Package",
      packages: retirementPackages,
    },
  ];

  /* =========================================================
     SERVICE URL ALIASES

     This allows existing URLs like:

     /booking?service=ring&package=classic

     to work correctly.
  ========================================================= */

  const serviceAliases = {
    wedding: "Wedding Packages",
    "wedding-packages": "Wedding Packages",
    packages: "Wedding Packages",

    "pre-wedding": "Pre-Wedding",
    prewedding: "Pre-Wedding",

    photoshoot: "Photoshoot",

    birthday: "Birthday Ceremony",
    "birthday-ceremony": "Birthday Ceremony",

    naming: "Naming Ceremony",
    "naming-ceremony": "Naming Ceremony",

    ring: "Ring Ceremony",
    "ring-ceremony": "Ring Ceremony",

    janeu: "Janeu Package",
    "janeu-ceremony": "Janeu Package",

    retirement: "Retirement Package",
    "retirement-party": "Retirement Package",
  };

  /* =========================================================
     GET SERVICE CONFIG
  ========================================================= */

  const getServiceConfig = (service) => {
    const normalizedService =
      serviceAliases[service] || service;

    return (
      serviceOptions.find(
        (item) =>
          item.value === normalizedService
      ) || null
    );
  };

  /* =========================================================
     URL SERVICE / PACKAGE
  ========================================================= */

  const params = new URLSearchParams(
    window.location.search
  );

  const packageSlug = params.get("package");

  const requestedService =
    params.get("service") ||
    "Wedding Packages";

  const initialServiceConfig =
    getServiceConfig(requestedService) ||
    serviceOptions[0];

  const initialService =
    initialServiceConfig.value;

  const initialPackages =
    initialServiceConfig.packages;

  /*
    If URL contains:

    ?service=ring&package=classic

    this finds the classic package from ringPackages.
  */

  const chosen =
    initialPackages.find(
      (p) => p.slug === packageSlug
    )?.name || "";

  /* =========================================================
     STATE
  ========================================================= */

  const [openCollection, setOpenCollection] =
    useState(false);

  const [openService, setOpenService] =
    useState(false);

  const [form, setForm] = useState({
    service: initialService,

    name: "",
    phone: "",
    email: "",
    couple: "",

    address: "",

    package: chosen,

    notes: "",

    events: [
      {
        name: "",
        date: "",
        time: "",
      },
    ],
  });

  const [error, setError] = useState("");

  /* =========================================================
     NORMAL FIELD UPDATE
  ========================================================= */

  const set = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setError("");
  };

  /* =========================================================
     EVENT UPDATE
  ========================================================= */

  const event = (index, key, value) => {
    setForm((prev) => ({
      ...prev,

      events: prev.events.map(
        (item, i) =>
          i === index
            ? {
                ...item,
                [key]: value,
              }
            : item
      ),
    }));

    setError("");
  };

  /* =========================================================
     SERVICE CHANGE
  ========================================================= */

  const handleServiceChange = (service) => {
    setForm((prev) => ({
      ...prev,

      service,

      // Reset package whenever service changes
      package: "",
    }));

    setOpenCollection(false);
    setError("");
  };

  /* =========================================================
     PACKAGE CHANGE
  ========================================================= */

  const handlePackageChange = (
    packageName
  ) => {
    setForm((prev) => ({
      ...prev,

      package: packageName,
    }));

    setOpenCollection(false);
    setError("");
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  function submit(e) {
    e.preventDefault();

    /* -----------------------------------------
       REQUIRED VALIDATION
    ----------------------------------------- */

    if (!form.name.trim()) {
      return setError(
        "Please enter your name."
      );
    }

    if (
      !/^\+?[0-9\s-]{10,15}$/.test(
        form.phone
      )
    ) {
      return setError(
        "Please enter a valid phone number."
      );
    }

    if (!form.address.trim()) {
      return setError(
        "Please enter the event address."
      );
    }

    if (!form.service) {
      return setError(
        "Please choose a service."
      );
    }

    if (!form.package) {
      return setError(
        "Please choose a collection."
      );
    }

    if (
      form.events.some(
        (x) =>
          !x.name.trim() ||
          !x.date ||
          !x.time
      )
    ) {
      return setError(
        "Please complete all event details."
      );
    }

    /* -----------------------------------------
       EVENT DETAILS
    ----------------------------------------- */

    const details = form.events
      .map(
        (x, i) =>
          `Event ${i + 1}: ${x.name} | ${x.date} | ${x.time}`
      )
      .join("\n");

    /* -----------------------------------------
       SERVICE DISPLAY NAME
    ----------------------------------------- */

    const selectedService =
      getServiceConfig(form.service);

    const serviceName =
      selectedService?.label ||
      form.service;

    /* -----------------------------------------
       WHATSAPP MESSAGE
    ----------------------------------------- */

    const message =
      `📸 *NEW BOOKING – GREEN HILL STUDIO*\n\n` +
      `*Service:* ${serviceName}\n` +
      `*Package:* ${form.package}\n\n` +
      `*Name:* ${form.name}\n` +
      `*Phone:* ${form.phone}\n` +
      `*Email:* ${
        form.email || "Not provided"
      }\n` +
      `*Couple:* ${
        form.couple || "Not provided"
      }\n\n` +
      `*Events:*\n${details}\n\n` +
      `*Address:* ${form.address}\n` +
      `*Notes:* ${form.notes || "None"}`;

    /* -----------------------------------------
       WHATSAPP NUMBER
    ----------------------------------------- */

    const number =
      import.meta.env.VITE_WHATSAPP_NUMBER;

    if (!number) {
      return setError(
        "Booking setup is incomplete. Please call the studio directly."
      );
    }

    /* -----------------------------------------
       OPEN WHATSAPP
    ----------------------------------------- */

    window.open(
      `https://wa.me/${number.replace(
        /\D/g,
        ""
      )}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener"
    );
  }

  /* =========================================================
     CURRENT SERVICE
  ========================================================= */

  const currentService =
    getServiceConfig(form.service);

  /* =========================================================
     CURRENT PACKAGES

     This is the important part.

     If service = Ring Ceremony

     currentPackages = ringPackages
  ========================================================= */

  const currentPackages =
    currentService?.packages || [];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="premium-page booking-experience">

      {/* =========================================
          HEADER
      ========================================= */}

      <header>
        <p>
          GREEN HILL STUDIO · RESERVATIONS
        </p>

        <h1>
          Book your <i>date.</i>
        </h1>

        <span>
          Let’s create something worth
          remembering.
        </span>
      </header>

      <form onSubmit={submit}>

        {/* =========================================
            STEP 01 — YOUR DETAILS
        ========================================= */}

        <Step
          number="01"
          title="Your details"
          text="Tell us a little about you."
        >
          <div className="split-fields">

            <Field label="Your name *">
              <input
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                value={form.name}
                onChange={(e) =>
                  set(
                    "name",
                    e.target.value
                  )
                }
              />
            </Field>

            <Field label="Phone number *">
              <input
                type="tel"
                inputMode="tel"
                placeholder="Enter your phone number"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) =>
                  set(
                    "phone",
                    e.target.value
                  )
                }
              />
            </Field>

            <Field label="Email address">
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={form.email}
                onChange={(e) =>
                  set(
                    "email",
                    e.target.value
                  )
                }
              />
            </Field>

            <Field label="Couple name">
              <input
                type="text"
                placeholder="e.g. Rahul & Priya"
                value={form.couple}
                onChange={(e) =>
                  set(
                    "couple",
                    e.target.value
                  )
                }
              />
            </Field>

          </div>
        </Step>

        {/* =========================================
            STEP 02 — EVENTS
        ========================================= */}

        <Step
          number="02"
          title="Your events"
          text="Add every date you’d like us to capture."
        >

          {form.events.map(
            (item, index) => (
              <div
                className="event-line"
                key={index}
              >

                <div className="event-number">
                  Event{" "}
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Event name"
                  value={item.name}
                  onChange={(e) =>
                    event(
                      index,
                      "name",
                      e.target.value
                    )
                  }
                />

                <input
                  type="date"
                  value={item.date}
                  onChange={(e) =>
                    event(
                      index,
                      "date",
                      e.target.value
                    )
                  }
                />

                <input
                  type="time"
                  value={item.time}
                  onChange={(e) =>
                    event(
                      index,
                      "time",
                      e.target.value
                    )
                  }
                />

                {form.events.length > 1 && (
                  <button
                    type="button"
                    className="remove-event"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,

                        events:
                          prev.events.filter(
                            (_, i) =>
                              i !== index
                          ),
                      }));

                      setError("");
                    }}
                  >
                    Remove event
                  </button>
                )}

              </div>
            )
          )}

          {/* ADD EVENT */}

          <button
            type="button"
            className="add-event"
            onClick={() => {
              setForm((prev) => ({
                ...prev,

                events: [
                  ...prev.events,
                  {
                    name: "",
                    date: "",
                    time: "",
                  },
                ],
              }));

              setError("");
            }}
          >
            + Add another event
          </button>

        </Step>

        {/* =========================================
            STEP 03 — LOCATION & COLLECTION
        ========================================= */}

        <Step
          number="03"
          title="Location & collection"
          text="Choose what you are booking and the collection you want."
        >

          {/* -----------------------------------------
              SERVICE
          ----------------------------------------- */}

          <Field label="What are you booking? *">

            <div className="service-select">

              <button
                type="button"
                className="service-select-button"
                onClick={() =>
                  setOpenService(
                    (prev) => !prev
                  )
                }
              >

                <span>
                  {currentService?.label ||
                    "Choose a service"}
                </span>

                <b>
                  {openService
                    ? "⌃"
                    : "⌄"}
                </b>

              </button>

              {openService && (
                <div className="service-options">

                  <button
                    type="button"
                    onClick={() => {
                      handleServiceChange(
                        ""
                      );

                      setOpenService(false);
                    }}
                  >
                    Choose a service
                  </button>

                  {serviceOptions.map(
                    (service) => (
                      <button
                        type="button"
                        key={service.value}
                        onClick={() => {
                          handleServiceChange(
                            service.value
                          );

                          setOpenService(
                            false
                          );
                        }}
                      >
                        {service.label}
                      </button>
                    )
                  )}

                </div>
              )}

            </div>

          </Field>

          {/* -----------------------------------------
              SELECTED COLLECTION
          ----------------------------------------- */}

          <Field label="Selected collection *">

            <div className="collection-select">

              <button
                type="button"
                className="collection-select-button"
                disabled={!form.service}
                onClick={() =>
                  setOpenCollection(
                    (prev) => !prev
                  )
                }
              >

                <span>
                  {form.package ||
                    (form.service
                      ? "Choose a collection"
                      : "Choose a service first")}
                </span>

                <b>
                  {openCollection
                    ? "⌃"
                    : "⌄"}
                </b>

              </button>

              {openCollection &&
                form.service && (
                  <div className="collection-options">

                    <button
                      type="button"
                      onClick={() =>
                        handlePackageChange(
                          ""
                        )
                      }
                    >
                      Choose a collection
                    </button>

                    {currentPackages.map(
                      (item) => (
                        <button
                          type="button"
                          key={item.slug}
                          onClick={() =>
                            handlePackageChange(
                              item.name
                            )
                          }
                        >

                          <span>
                            {item.name}
                          </span>

                          <small>
                            {item.price}
                          </small>

                        </button>
                      )
                    )}

                  </div>
                )}

            </div>

          </Field>

          {/* -----------------------------------------
              ADDRESS
          ----------------------------------------- */}

          <Field label="Event address *">

            <input
              type="text"
              placeholder="Enter your event location"
              autoComplete="street-address"
              value={form.address}
              onChange={(e) =>
                set(
                  "address",
                  e.target.value
                )
              }
            />

          </Field>

          {/* -----------------------------------------
              NOTES
          ----------------------------------------- */}

          <Field label="Anything else we should know?">

            <textarea
              placeholder="Any special requests, timings, locations, or other details?"
              value={form.notes}
              onChange={(e) =>
                set(
                  "notes",
                  e.target.value
                )
              }
            />

          </Field>

        </Step>

        {/* =========================================
            STEP 04 — CONFIRMATION
        ========================================= */}

        <aside className="payment-timeline">

          <p>
            04 · CONFIRMATION
          </p>

          <h2>
            Your booking timeline
          </h2>

          <div>

            <span>
              <b>20%</b>
              At booking
            </span>

            <span>
              <b>60%</b>
              Before event day
            </span>

            <span>
              <b>20%</b>
              On final delivery
            </span>

          </div>

        </aside>

        {/* =========================================
            ERROR
        ========================================= */}

        {error && (
          <p className="booking-error">
            {error}
          </p>
        )}

        {/* =========================================
            SUBMIT
        ========================================= */}

        <button
          type="submit"
          className="premium-cta submit-booking"
        >
          Send booking request
          <b>↗</b>
        </button>

        {/* =========================================
            RETURN
        ========================================= */}

        <Link
          className="booking-return"
          to="/"
        >
          ← Return to website
        </Link>

      </form>

    </main>
  );
}

/* =========================================================
   STEP COMPONENT
========================================================= */

function Step({
  number,
  title,
  text,
  children,
}) {
  return (
    <section className="booking-step">

      <div>

        <span>
          {number}
        </span>

        <h2>
          {title}
        </h2>

        {text && (
          <p>
            {text}
          </p>
        )}

      </div>

      <div>
        {children}
      </div>

    </section>
  );
}

/* =========================================================
   FIELD COMPONENT
========================================================= */

function Field({
  label,
  children,
}) {
  return (
    <div className="premium-field">

      <span className="premium-field-label">
        {label}
      </span>

      {children}

    </div>
  );
}