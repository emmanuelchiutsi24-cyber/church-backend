// src/components/parish/Event.jsx
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";

const API_URL = "http://localhost:8080/api/events";

const buildImageUrl = (raw) => {
  if (!raw) return null;
  return raw.startsWith("http") ? raw : `http://localhost:8080${raw}`;
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Date to be announced";

// ── Category color system ───────────────────────────────────
const palette = {
  Mass:       { bg: "#f0f7f1", ink: "#2f6b3a", accent: "#4c9a5a" },
  Youth:      { bg: "#eef3fb", ink: "#1e4a8a", accent: "#3a7bd5" },
  Community:  { bg: "#fdf4e7", ink: "#8a5a12", accent: "#d68a1f" },
  Formation:  { bg: "#f5eefa", ink: "#5a2f7a", accent: "#8e44ad" },
  Fundraiser: { bg: "#fdeeee", ink: "#8a1f2e", accent: "#c0392b" },
  Liturgy:    { bg: "#f3eefb", ink: "#4b2e83", accent: "#6c4bb6" },
  default:    { bg: "#f7f4ec", ink: "#4a4740", accent: "#8a877a" },
};

const toneFor = (category) => palette[category] ?? palette.default;

// ── Small label with category color ────────────────────────
const CategoryLabel = ({ category }) => {
  if (!category) return null;
  const t = toneFor(category);
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 10,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        fontWeight: 700,
        color: t.ink,
        background: t.bg,
        padding: "4px 10px",
        borderRadius: 2,
        marginBottom: 12,
      }}
    >
      {category}
    </span>
  );
};

// ── Featured (hero) story ───────────────────────────────────
const FeaturedEvent = ({ event }) => {
  const img = buildImageUrl(event.imageUrl || event.image);
  const t = toneFor(event.category);

  return (
    <article
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
        gap: 32,
        paddingBottom: 32,
        marginBottom: 40,
        borderBottom: `3px solid ${t.accent}`,
        alignItems: "center",
        position: "relative",
      }}
      className="parish-featured"
    >
      {img && (
        <div style={{ position: "relative" }}>
          <div
            style={{
              aspectRatio: "4 / 3",
              background: `url(${img}) center/cover`,
              filter: "saturate(1.05) contrast(1.02)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              background: t.accent,
              color: "#fff",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 700,
              padding: "6px 14px",
            }}
          >
            Featured
          </div>
        </div>
      )}

      <div>
        <CategoryLabel category={event.category} />

        <h3
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 34,
            fontWeight: 400,
            lineHeight: 1.15,
            color: "#1f1d17",
            margin: "0 0 16px",
            letterSpacing: "-0.015em",
          }}
        >
          {event.title}
        </h3>

        {event.description && (
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 15,
              lineHeight: 1.7,
              color: "#4a4740",
              margin: "0 0 20px",
            }}
          >
            {event.description}
          </p>
        )}

        <dl
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "10px 18px",
            fontSize: 13,
            color: "#1f1d17",
            margin: "0 0 22px",
            borderTop: `1px solid ${t.accent}33`,
            paddingTop: 16,
          }}
        >
          <dt style={{ display: "flex", alignItems: "center", gap: 8, color: t.ink, fontWeight: 600 }}>
            <FaCalendar size={11} /> When
          </dt>
          <dd style={{ margin: 0 }}>{formatDate(event.eventDate)}</dd>

          <dt style={{ display: "flex", alignItems: "center", gap: 8, color: t.ink, fontWeight: 600 }}>
            <FaClock size={11} /> Time
          </dt>
          <dd style={{ margin: 0 }}>{event.eventTime || "To be confirmed"}</dd>

          {event.location && (
            <>
              <dt style={{ display: "flex", alignItems: "center", gap: 8, color: t.ink, fontWeight: 600 }}>
                <FaMapMarkerAlt size={11} /> Where
              </dt>
              <dd style={{ margin: 0 }}>{event.location}</dd>
            </>
          )}
        </dl>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: t.accent,
            borderBottom: `1px solid ${t.accent}`,
            paddingBottom: 3,
          }}
        >
          Read more <FaArrowRight size={9} />
        </span>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .parish-featured { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
      `}</style>
    </article>
  );
};

// ── Row entry ──────────────────────────────────────────────
const EventEntry = ({ event }) => {
  const date = event.eventDate ? new Date(event.eventDate) : null;
  const day = date ? date.getDate().toString().padStart(2, "0") : "—";
  const month = date
    ? date.toLocaleDateString(undefined, { month: "short" }).toUpperCase()
    : "TBA";
  const t = toneFor(event.category);

  return (
    <article
      style={{
        display: "grid",
        gridTemplateColumns: "84px 1fr auto",
        gap: 24,
        alignItems: "start",
        padding: "24px 0",
        borderBottom: "1px solid #e7e3d8",
      }}
    >
      <div
        style={{
          background: t.bg,
          borderLeft: `3px solid ${t.accent}`,
          padding: "10px 0",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 30,
            fontWeight: 400,
            color: t.ink,
            lineHeight: 1,
          }}
        >
          {day}
        </div>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.2em",
            color: t.accent,
            marginTop: 6,
            fontWeight: 700,
          }}
        >
          {month}
        </div>
      </div>

      <div>
        {event.category && (
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: t.accent,
              fontWeight: 700,
              margin: "0 0 6px",
            }}
          >
            {event.category}
          </p>
        )}
        <h4
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 20,
            fontWeight: 400,
            lineHeight: 1.3,
            color: "#1f1d17",
            margin: "0 0 8px",
          }}
        >
          {event.title}
        </h4>

        {event.description && (
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 14,
              lineHeight: 1.6,
              color: "#4a4740",
              margin: "0 0 10px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {event.description}
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: 20,
            fontSize: 12,
            color: "#6b6a5c",
            flexWrap: "wrap",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaClock size={10} /> {event.eventTime || "Time TBA"}
          </span>
          {event.location && (
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FaMapMarkerAlt size={10} /> {event.location}
            </span>
          )}
        </div>
      </div>

      <FaArrowRight size={11} color={t.accent} style={{ marginTop: 8 }} />
    </article>
  );
};

// ── Empty ──────────────────────────────────────────────────
const Empty = () => (
  <div
    style={{
      padding: "64px 24px",
      textAlign: "center",
      borderTop: "2px solid #e7e3d8",
      borderBottom: "2px solid #e7e3d8",
    }}
  >
    <p
      style={{
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
        fontSize: 18,
        color: "#6b6a5c",
        margin: 0,
      }}
    >
      The calendar is quiet for now.
    </p>
    <p style={{ fontSize: 13, color: "#8a877a", margin: "8px 0 0" }}>
      Upcoming events will appear here as they are announced.
    </p>
  </div>
);

// ── Main component ────────────────────────────────────────
function Event() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get(API_URL);
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // 1. Filter out past events and 2. Sort by newest date first
  const sortedEvents = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today

    return events
      .filter((e) => {
        if (!e.eventDate) return true; // Keep events with no date
        return new Date(e.eventDate) >= now;
      })
      .sort((a, b) => {
        // If no date, push to the bottom
        if (!a.eventDate) return 1;
        if (!b.eventDate) return -1;
        
        // Sort descending (newest event date first)
        return new Date(b.eventDate) - new Date(a.eventDate);
      });
  }, [events]);

  const [featured, ...rest] = sortedEvents;

  return (
    <section
      style={{
        background: "#fbfaf6",
        padding: "56px 0",
        borderTop: "1px solid #e7e3d8",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
        {/* Masthead */}
        <header
          style={{
            textAlign: "center",
            padding: "32px 24px",
            marginBottom: 40,
            background: "linear-gradient(180deg, #fdf7e8 0%, #fbfaf6 100%)",
            borderTop: "3px solid #c9a24a",
            borderBottom: "1px solid #e7e3d8",
          }}
        >
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#8a6d2f",
              margin: "0 0 8px",
              fontWeight: 700,
            }}
          >
            The Parish Calendar
          </p>
          <h2
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 44,
              fontWeight: 400,
              fontStyle: "italic",
              color: "#1f1d17",
              margin: 0,
              letterSpacing: "-0.015em",
              lineHeight: 1.1,
            }}
          >
            Upcoming Events
          </h2>
          <p style={{ fontSize: 13, color: "#8a877a", margin: "10px 0 0" }}>
            Gatherings, services, and occasions from around the parish.
          </p>
        </header>

        {loading ? (
          <div style={{ display: "grid", gap: 20 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  height: 100,
                  background: "#f1eee6",
                  border: "1px solid #e7e3d8",
                }}
              />
            ))}
          </div>
        ) : sortedEvents.length === 0 ? (
          <Empty />
        ) : (
          <>
            {featured && <FeaturedEvent event={featured} />}

            {rest.length > 0 && (
              <div>
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "#8a6d2f",
                    fontWeight: 700,
                    margin: "0 0 8px",
                    paddingBottom: 8,
                    borderBottom: "1px solid #e7e3d8",
                  }}
                >
                  Also this season
                </p>
                {rest.map((event) => (
                  <EventEntry key={event.id} event={event} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default Event;