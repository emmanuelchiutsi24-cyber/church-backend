// src/components/parish/ParishHeader.jsx

function ParishHeader() {
  return (
    <section
      style={{
        background: "linear-gradient(180deg, #fdf7e8 0%, #fbfaf6 100%)",
        borderTop: "4px solid #c9a24a",
        borderBottom: "1px solid #e7e3d8",
        padding: "64px 20px",
        textAlign: "center",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        
        {/* Logo Medallion */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 4px 12px rgba(31,29,23,0.06)",
            border: "1px solid #e7e3d8",
            marginBottom: 24,
            padding: 16,
          }}
        >
          <img
            src="/logo.png"
            alt="Parish Logo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Small Gold Kicker */}
        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#8a6d2f",
            margin: "0 0 12px",
            fontWeight: 700,
          }}
        >
          Welcome to
        </p>

        {/* Main Serif Title */}
        <h1
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 400,
            color: "#1f1d17",
            margin: "0 0 16px",
            lineHeight: 1.15,
            letterSpacing: "-0.015em",
          }}
        >
          St. Alois Catholic Parish
        </h1>

        {/* Subtitle / Guild */}
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: 18,
            color: "#4a4740",
            margin: "0 0 24px",
          }}
        >
          Agnes & Alois Youth Guild
        </p>

        {/* Meta details in a pill/badge format */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "#6b6a5c",
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: "#fff",
              border: "1px solid #e7e3d8",
              padding: "6px 16px",
              borderRadius: 999,
              fontWeight: 500,
            }}
          >
            Chitungwiza Deanery
          </span>
          
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: 4,
            }}
          >
            📍 St. Alois Catholic Parish, Chitungwiza
          </span>
        </div>

      </div>
    </section>
  );
}

export default ParishHeader;