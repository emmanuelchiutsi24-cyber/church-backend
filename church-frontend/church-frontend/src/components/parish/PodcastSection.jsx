// src/components/parish/PodcastSection.jsx
import {
  FaHeadphones,
  FaPlay,
  FaUserTie,
  FaClock,
  FaLock,
} from "react-icons/fa";

const tones = [
  { bg: "#fdf4e7", ink: "#8a5a12", accent: "#d68a1f" }, // amber
  { bg: "#eef3fb", ink: "#1e4a8a", accent: "#3a7bd5" }, // blue
  { bg: "#f0f7f1", ink: "#2f6b3a", accent: "#4c9a5a" }, // green
  { bg: "#f5eefa", ink: "#5a2f7a", accent: "#8e44ad" }, // purple
  { bg: "#fdeeee", ink: "#8a1f2e", accent: "#c0392b" }, // red
];
const toneFor = (i) => tones[i % tones.length];

const podcasts = [
  {
    title: "Sunday Gospel Reflection",
    speaker: "Fr. Michael",
    description: "A weekly reflection on the Sunday gospel and parish life.",
    duration: "18 min",
  },
  {
    title: "Youth Spiritual Talk",
    speaker: "Youth Ministry",
    description: "Encouragement and spiritual guidance for young parishioners.",
    duration: "24 min",
  },
];

const EpisodeCard = ({ podcast, index }) => {
  const t = toneFor(index);

  return (
    <article
      style={{
        display: "grid",
        gridTemplateColumns: "96px 1fr",
        gap: 24,
        alignItems: "stretch",
        padding: "20px 24px",
        background: "#fff",
        borderLeft: `3px solid ${t.accent}`,
        borderBottom: "1px solid #e7e3d8",
        position: "relative",
      }}
    >
      {/* Cover tile */}
      <div
        style={{
          position: "relative",
          background: `linear-gradient(135deg, ${t.bg}, #fbfaf6)`,
          border: `1px solid ${t.accent}33`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          aspectRatio: "1 / 1",
          overflow: "hidden",
          zIndex: 1, // Ensures it stays above any text accidentally spilling
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: t.accent,
            color: "#fff",
            boxShadow: `0 0 0 4px ${t.accent}22`,
          }}
        >
          <FaPlay size={14} style={{ marginLeft: 2 }} />
        </span>
        <span
          style={{
            position: "absolute",
            bottom: 6,
            right: 8,
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: t.ink,
            opacity: 0.8,
          }}
        >
          Ep {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Info Column - fixed minWidth to prevent grid blowout */}
      <div
        style={{
          minWidth: 0,
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
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
            padding: "3px 8px",
            borderRadius: 2,
            alignSelf: "flex-start",
            marginBottom: 8,
          }}
        >
          <FaHeadphones size={9} /> Podcast
        </span>

        <h3
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 20,
            fontWeight: 400,
            lineHeight: 1.3,
            color: "#1f1d17",
            margin: "0 0 6px",
          }}
        >
          {podcast.title}
        </h3>

        <div
          style={{
            display: "flex",
            gap: 16,
            fontSize: 12,
            color: "#8a877a",
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FaUserTie size={10} /> {podcast.speaker}
          </span>
          {podcast.duration && (
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FaClock size={10} /> {podcast.duration}
            </span>
          )}
        </div>

        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 14,
            lineHeight: 1.6,
            color: "#4a4740",
            margin: "0 0 14px",
          }}
        >
          {podcast.description}
        </p>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            alignSelf: "flex-start",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: t.ink,
            background: t.bg,
            border: `1px solid ${t.accent}55`,
            padding: "7px 12px",
          }}
        >
          <FaLock size={9} /> Coming soon
        </span>
      </div>
    </article>
  );
};

function PodcastSection() {
  return (
    <section
      style={{
        background: "#fbfaf6",
        padding: "56px 0",
        borderTop: "1px solid #e7e3d8",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
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
            From the Parish Studio
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
            Podcasts
          </h2>
          <p style={{ fontSize: 13, color: "#8a877a", margin: "10px 0 0" }}>
            Reflections, talks, and voices from our parish community.
          </p>
        </header>

        <div style={{ border: "1px solid #e7e3d8" }}>
          {podcasts.map((p, i) => (
            <EpisodeCard key={p.title} podcast={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PodcastSection;