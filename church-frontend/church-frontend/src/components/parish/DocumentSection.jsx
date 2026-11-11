// src/components/parish/DocumentSection.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaFileAlt,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaExternalLinkAlt,
} from "react-icons/fa";

const API_URL = "http://localhost:8080/api/news";

const buildFileUrl = (raw) => {
  if (!raw) return null;
  return raw.startsWith("http") ? raw : `http://localhost:8080${raw}`;
};

// ── File-type detection + color mapping ────────────────────
const fileTone = {
  pdf:   { label: "PDF", icon: FaFilePdf,   bg: "#fdeeee", ink: "#8a1f2e", accent: "#c0392b" },
  doc:   { label: "DOC", icon: FaFileWord,  bg: "#eef3fb", ink: "#1e4a8a", accent: "#3a7bd5" },
  docx:  { label: "DOC", icon: FaFileWord,  bg: "#eef3fb", ink: "#1e4a8a", accent: "#3a7bd5" },
  xls:   { label: "XLS", icon: FaFileExcel, bg: "#f0f7f1", ink: "#2f6b3a", accent: "#4c9a5a" },
  xlsx:  { label: "XLS", icon: FaFileExcel, bg: "#f0f7f1", ink: "#2f6b3a", accent: "#4c9a5a" },
  img:   { label: "IMG", icon: FaFileImage, bg: "#f5eefa", ink: "#5a2f7a", accent: "#8e44ad" },
  default: { label: "FILE", icon: FaFileAlt, bg: "#fdf4e7", ink: "#8a5a12", accent: "#d68a1f" },
};

const toneForDoc = (doc) => {
  const raw =
    (doc.fileType || "").toLowerCase() ||
    (doc.documentUrl || "").split(".").pop()?.toLowerCase() ||
    "";
  if (raw.includes("pdf")) return fileTone.pdf;
  if (raw.includes("doc")) return fileTone.doc;
  if (raw.includes("xls") || raw.includes("sheet")) return fileTone.xls;
  if (raw.includes("png") || raw.includes("jpg") || raw.includes("jpeg") || raw.includes("img"))
    return fileTone.img;
  return fileTone.default;
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

// ── Single document row ────────────────────────────────────
const DocumentRow = ({ doc }) => {
  const t = toneForDoc(doc);
  const Icon = t.icon;
  const href = buildFileUrl(doc.documentUrl);
  const published = formatDate(doc.publishedAt);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "grid",
        gridTemplateColumns: "56px 1fr auto",
        gap: 20,
        alignItems: "center",
        padding: "20px 24px",
        background: "#fff",
        borderLeft: `3px solid ${t.accent}`,
        borderBottom: "1px solid #e7e3d8",
        textDecoration: "none",
        color: "inherit",
        transition: "background 150ms ease",
      }}
      className="parish-doc-row"
    >
      {/* File badge */}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 44,
          height: 56,
          background: t.bg,
          color: t.ink,
          position: "relative",
          fontFamily: "Georgia, serif",
        }}
      >
        <Icon size={22} />
        <span
          style={{
            position: "absolute",
            bottom: -8,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: "0.1em",
            background: t.accent,
            color: "#fff",
            padding: "2px 6px",
            lineHeight: 1,
          }}
        >
          {t.label}
        </span>
      </span>

      {/* Title + meta */}
      <div style={{ minWidth: 0 }}>
        <h3
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 18,
            fontWeight: 400,
            lineHeight: 1.3,
            color: "#1f1d17",
            margin: "0 0 4px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {doc.title || "Untitled document"}
        </h3>
        <p
          style={{
            fontSize: 12,
            color: "#8a877a",
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            margin: 0,
          }}
        >
          {t.label}
          {published ? ` · ${published}` : ""}
        </p>
      </div>

      {/* CTA */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: t.accent,
          whiteSpace: "nowrap",
        }}
      >
        Open <FaExternalLinkAlt size={9} />
      </span>

      <style>{`
        .parish-doc-row:hover { background: #fbfaf6; }
      `}</style>
    </a>
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
      <FaFileAlt size={22} />
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
      The archive is empty for now.
    </p>
    <p style={{ fontSize: 13, color: "#8a877a", margin: "8px 0 0" }}>
      Parish documents will appear here as they are added.
    </p>
  </div>
);

// ── Skeleton ───────────────────────────────────────────────
const Skeleton = () => (
  <div style={{ border: "1px solid #e7e3d8" }}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          display: "grid",
          gridTemplateColumns: "56px 1fr auto",
          gap: 20,
          alignItems: "center",
          padding: "20px 24px",
          background: "#fff",
          borderBottom: "1px solid #e7e3d8",
        }}
      >
        <div style={{ width: 44, height: 56, background: "#f1eee6" }} />
        <div>
          <div
            style={{
              height: 14,
              width: "55%",
              background: "#f1eee6",
              marginBottom: 8,
            }}
          />
          <div
            style={{
              height: 10,
              width: "30%",
              background: "#f7f4ec",
            }}
          />
        </div>
        <div style={{ height: 10, width: 40, background: "#f7f4ec" }} />
      </div>
    ))}
  </div>
);

// ── Main component ────────────────────────────────────────
function DocumentSection() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const { data } = await axios.get(API_URL);
        const docs = Array.isArray(data)
          ? data.filter((item) => item.documentUrl)
          : [];
        setDocuments(docs);
      } catch (error) {
        console.error("Failed to load documents:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
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
            From the Parish Archive
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
            Parish Documents
          </h2>
          <p style={{ fontSize: 13, color: "#8a877a", margin: "10px 0 0" }}>
            Bulletins, forms, and records for the community.
          </p>
        </header>

        {loading ? (
          <Skeleton />
        ) : documents.length === 0 ? (
          <Empty />
        ) : (
          <div style={{ border: "1px solid #e7e3d8" }}>
            {documents.map((doc) => (
              <DocumentRow key={doc.id} doc={doc} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default DocumentSection;