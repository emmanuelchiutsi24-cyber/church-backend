// src/components/parish/ParishAbout.jsx
import { Link, useParams } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function ParishAbout() {
  const { slug } = useParams(); // Get the current parish slug from the URL

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
          <p style={{ fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: "#8a6d2f", margin: "0 0 8px", fontWeight: 700 }}>
            Our Identity
          </p>
          <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 40, fontWeight: 400, fontStyle: "italic", color: "#1f1d17", margin: 0, letterSpacing: "-0.015em", lineHeight: 1.1 }}>
            About Our Parish
          </h2>
        </header>

        {/* Body Content */}
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          
          {/* Origin Story (Clickable) */}
          <Link 
            to={`/parishes/${slug}/about`} 
            style={{ textDecoration: "none", display: "block", marginBottom: 48 }}
          >
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 18,
                lineHeight: 1.8,
                color: "#4a4740",
                textAlign: "center",
                transition: "color 150ms ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#1f1d17"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#4a4740"}
            >
              St Alois Catholic Parish was established to serve
              the Catholic community and spread the message of Christ.
            </p>
          </Link>

          {/* Mission & Vision Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="parish-about-grid">
            <div style={{ background: "#fff", border: "1px solid #e7e3d8", borderTop: "3px solid #d68a1f", padding: "28px 24px" }}>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8a5a12", margin: "0 0 12px" }}>
                Mission
              </h3>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 15, lineHeight: 1.7, color: "#4a4740", margin: 0 }}>
                To promote faith, unity and service.
              </p>
            </div>

            <div style={{ background: "#fff", border: "1px solid #e7e3d8", borderTop: "3px solid #3a7bd5", padding: "28px 24px" }}>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1e4a8a", margin: "0 0 12px" }}>
                Vision
              </h3>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 15, lineHeight: 1.7, color: "#4a4740", margin: 0 }}>
                A united Catholic community guided by God's love.
              </p>
            </div>
          </div>

          {/* Read More CTA */}
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link
              to={`/parishes/${slug}/about`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#1d4ed8",
                borderBottom: "1px solid #1d4ed8",
                paddingBottom: 3,
                textDecoration: "none",
              }}
            >
              Read Full Story <FaArrowRight size={10} />
            </Link>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .parish-about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

export default ParishAbout;