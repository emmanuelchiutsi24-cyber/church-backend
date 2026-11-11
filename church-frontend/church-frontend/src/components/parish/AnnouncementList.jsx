// src/components/parish/AnnouncementList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { FaBullhorn, FaCalendarAlt, FaArrowRight } from "react-icons/fa";

const API_URL = "http://localhost:8080/api/news";

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
    : "Recently published";

// Announcements cycle through these accent tones so a list of 5 looks varied
const tones = [
  { bg: "#fdf4e7", ink: "#8a5a12", accent: "#d68a1f" }, // amber
  { bg: "#eef3fb", ink: "#1e4a8a", accent: "#3a7bd5" }, // blue
  { bg: "#f0f7f1", ink: "#2f6b3a", accent: "#4c9a5a" }, // green
  { bg: "#f5eefa", ink: "#5a2f7a", accent: "#8e44ad" }, // purple
  { bg: "#fdeeee", ink: "#8a1f2e", accent: "#c0392b" }, // red
];

const toneFor = (i) => tones[i % tones.length];

// ── Single announcement card ───────────────────────────────
const AnnouncementCard = ({ item, index }) => {
  const t = toneFor(index);
  const img = buildImageUrl(item.imageUrl);

  return (
    <article
      style={{
        display: "grid",
        gridTemplateColumns: img ? "minmax(0, 1fr) 200px" : "1fr",
        gap: 24,
        padding: "28px 28px 28px 24px",
        background: "#fff",
        borderLeft: `3px solid ${t.accent}`,
        borderBottom: "1px solid #e7e3d8",
        position: "relative",
      }}
      className="parish-announcement"
    >
      <div>
        {/* Meta row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 10,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: t.ink,
              background: t.bg,
              padding: "4px 10px",
              borderRadius: 2,
            }}
          >
            <FaBullhorn size={9} /> Notice
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#8a877a",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
            }}
          >
            <FaCalendarAlt size={10} />
            {formatDate(item.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 24,
            fontWeight: 400,
            lineHeight: 1.25,
            color: "#1f1d17",
            margin: "0 0 12px",
            letterSpacing: "-0.01em",
          }}
        >
          {item.title}
        </h3>

        {/* Body */}
        {item.content && (
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 15,
              lineHeight: 1.7,
              color: "#4a4740",
              margin: "0 0 16px",
              whiteSpace: "pre-line",
            }}
          >
            {item.content}
          </p>
        )}

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: t.accent,
            borderBottom: `1px solid ${t.accent}`,
            paddingBottom: 3,
          }}
        >
          Read full notice <FaArrowRight size={9} />
        </span>
      </div>

      {img && (
        <div
          style={{
            aspectRatio: "1 / 1",
            background: `url(${img}) center/cover`,
            alignSelf: "start",
            filter: "saturate(1.05)",
          }}
        />
      )}

      <style>{`
        @media (max-width: 720px) {
          .parish-announcement { grid-template-columns: 1fr !important; }
          .parish-announcement > div:last-child { aspect-ratio: 16 / 9 !important; width: 100%; }
        }
      `}</style>
    </article>
  );
};

// ── Empty ──────────────────────────────────────────────────
const Empty = () => (
  <div
    style={{
      padding: "48px 24px",
      textAlign: "center",
      borderTop: "2px solid #e7e3d8",
      borderBottom: "2px solid #e7e3d8",
      background: "#fbfaf6",
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
      No announcements have been published yet.
    </p>
    <p style={{ fontSize: 13, color: "#8a877a", margin: "8px 0 0" }}>
      Parish notices will appear here as they are shared.
    </p>
  </div>
);

// ── Skeleton ───────────────────────────────────────────────
const Skeleton = () => (
  <div style={{ display: "grid", gap: 1, background: "#e7e3d8" }}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ padding: 28, background: "#fff" }}>
        <div
          style={{
            height: 10,
            width: 80,
            background: "#f1eee6",
            marginBottom: 12,
          }}
        />
        <div
          style={{
            height: 20,
            width: "60%",
            background: "#f1eee6",
            marginBottom: 12,
          }}
        />
        <div
          style={{
            height: 12,
            width: "90%",
            background: "#f7f4ec",
            marginBottom: 6,
          }}
        />
        <div style={{ height: 12, width: "75%", background: "#f7f4ec" }} />
      </div>
    ))}
  </div>
);

// ── Main component ────────────────────────────────────────
function AnnouncementList() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const { data } = await axios.get(API_URL);
        setAnnouncements(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch (error) {
        console.error("Failed to load announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnnouncements();
  }, []);

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
            From the Parish Office
          </p>
          <h2
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 40,
              fontWeight: 400,
              fontStyle: "italic",
              color: "#1f1d17",
              margin: 0,
              letterSpacing: "-0.015em",
              lineHeight: 1.1,
            }}
          >
            Latest Announcements
          </h2>
          <p style={{ fontSize: 13, color: "#8a877a", margin: "10px 0 0" }}>
            Notices and updates from the parish community.
          </p>
        </header>

        {loading ? (
          <Skeleton />
        ) : announcements.length === 0 ? (
          <Empty />
        ) : (
          <div style={{ border: "1px solid #e7e3d8" }}>
            {announcements.map((item, i) => (
              <AnnouncementCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AnnouncementList;