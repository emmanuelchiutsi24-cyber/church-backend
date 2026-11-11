// src/components/parish/GallerySection.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { FaCamera, FaExpand } from "react-icons/fa";

const API_URL = "http://localhost:8080/api/gallery";

const buildImageUrl = (raw) => {
  if (!raw) return null;
  return raw.startsWith("http") ? raw : `http://localhost:8080${raw}`;
};

// Same 5-tone palette as AnnouncementList — used for corner markers
const tones = [
  { accent: "#d68a1f" }, // amber
  { accent: "#3a7bd5" }, // blue
  { accent: "#4c9a5a" }, // green
  { accent: "#8e44ad" }, // purple
  { accent: "#c0392b" }, // red
];

const toneFor = (i) => tones[i % tones.length];

// ── Single tile ────────────────────────────────────────────
const PhotoTile = ({ item, index, featured }) => {
  const img = buildImageUrl(item.fileUrl);
  const t = toneFor(index);

  return (
    <figure
      style={{
        margin: 0,
        position: "relative",
        overflow: "hidden",
        background: "#f1eee6",
        gridColumn: featured ? "span 2" : undefined,
        gridRow: featured ? "span 2" : undefined,
        border: "1px solid #e7e3d8",
        cursor: "pointer",
      }}
      className="parish-photo-tile"
    >
      {img ? (
        <img
          src={img}
          alt={item.title || "Parish photo"}
          loading="lazy"
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            aspectRatio: featured ? "1 / 1" : "4 / 3",
            objectFit: "cover",
            transition: "transform 500ms ease, filter 500ms ease",
            filter: "saturate(1.05)",
          }}
          className="parish-photo-img"
        />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            aspectRatio: featured ? "1 / 1" : "4 / 3",
            color: "#8a877a",
          }}
        >
          <FaCamera size={28} />
        </div>
      )}

      {/* Top accent rule */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: t.accent,
        }}
      />

      {/* Expand icon on hover */}
      <span
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "rgba(31,29,23,0.55)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(4px)",
        }}
        className="parish-photo-expand"
      >
        <FaExpand size={12} />
      </span>

      {/* Caption strip */}
      {item.title && (
        <figcaption
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "20px 16px 14px",
            background:
              "linear-gradient(to top, rgba(31,29,23,0.85), rgba(31,29,23,0))",
            color: "#fff",
          }}
        >
          <p
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              fontSize: 14,
              lineHeight: 1.35,
              margin: 0,
              textShadow: "0 1px 2px rgba(0,0,0,0.4)",
            }}
          >
            {item.title}
          </p>
        </figcaption>
      )}

      <style>{`
        .parish-photo-tile:hover .parish-photo-img {
          transform: scale(1.04);
          filter: saturate(1.15) contrast(1.03);
        }
        .parish-photo-tile:hover .parish-photo-expand {
          background: ${t.accent};
        }
      `}</style>
    </figure>
  );
};

// ── Empty ──────────────────────────────────────────────────
const Empty = () => (
  <div
    style={{
      padding: "56px 24px",
      textAlign: "center",
      borderTop: "2px solid #e7e3d8",
      borderBottom: "2px solid #e7e3d8",
      background: "#fbfaf6",
    }}
  >
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "#fdf4e7",
        color: "#d68a1f",
        marginBottom: 12,
      }}
    >
      <FaCamera size={22} />
    </span>
    <p
      style={{
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
        fontSize: 18,
        color: "#6b6a5c",
        margin: 0,
      }}
    >
      The album is still empty.
    </p>
    <p style={{ fontSize: 13, color: "#8a877a", margin: "8px 0 0" }}>
      Photos from parish life will be added here as they come in.
    </p>
  </div>
);

// ── Skeleton ───────────────────────────────────────────────
const Skeleton = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 1,
      background: "#e7e3d8",
    }}
  >
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        style={{
          background: "#f1eee6",
          aspectRatio: "4 / 3",
        }}
      />
    ))}
  </div>
);

// ── Main component ────────────────────────────────────────
function GallerySection() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const { data } = await axios.get(API_URL);
        setImages(Array.isArray(data) ? data.slice(0, 9) : []);
      } catch (error) {
        console.error("Failed to load gallery images:", error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
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
            From the Parish Album
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
            Gallery
          </h2>
          <p style={{ fontSize: 13, color: "#8a877a", margin: "10px 0 0" }}>
            Moments from Mass, ministries, and community life.
          </p>
        </header>

        {loading ? (
          <Skeleton />
        ) : images.length === 0 ? (
          <Empty />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridAutoRows: "minmax(0, auto)",
              gap: 1,
              background: "#e7e3d8",
              border: "1px solid #e7e3d8",
            }}
            className="parish-gallery-grid"
          >
            {images.map((item, i) => (
              <PhotoTile
                key={item.id}
                item={item}
                index={i}
                featured={i === 0 && images.length > 4}
              />
            ))}
          </div>
        )}

        <style>{`
          @media (max-width: 720px) {
            .parish-gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .parish-gallery-grid > figure[style*="span 2"] {
              grid-column: span 2 !important;
              grid-row: auto !important;
            }
          }
          @media (max-width: 480px) {
            .parish-gallery-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

export default GallerySection;