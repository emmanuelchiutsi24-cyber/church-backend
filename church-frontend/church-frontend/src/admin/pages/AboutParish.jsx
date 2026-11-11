// src/pages/AboutParish.jsx
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function AboutParish() {
  const { slug } = useParams();

  return (
    <div style={{ background: "#fbfaf6", minHeight: "100vh", padding: "64px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        
        {/* Back Button */}
        <Link
          to={`/parishes/${slug}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#8a6d2f",
            textDecoration: "none",
            marginBottom: 32,
          }}
        >
          <FaArrowLeft size={10} /> Back to Parish
        </Link>

        {/* Title Area */}
        <header
          style={{
            marginBottom: 48,
            paddingBottom: 24,
            borderBottom: "2px solid #c9a24a",
          }}
        >
          <p style={{ fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: "#8a6d2f", margin: "0 0 12px", fontWeight: 700 }}>
            Our Full Story
          </p>
          <h1
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: 48,
              fontWeight: 400,
              fontStyle: "italic",
              color: "#1f1d17",
              margin: 0,
              lineHeight: 1.15,
              letterSpacing: "-0.015em",
            }}
          >
            The History of the Parish
          </h1>
        </header>

        {/* Full Content Body */}
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 17,
            lineHeight: 1.9,
            color: "#4a4740",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <p>
            St Alois Catholic Parish was established to serve the Catholic community and spread the message of Christ. 
            For decades, our parish has been a spiritual home for families, youth, and elders alike, providing a place of worship, 
            fellowship, and growth in faith.
          </p>
          <p>
            Rooted in the traditions of the Church and guided by the Holy Spirit, we continue to build a welcoming environment 
            where everyone is encouraged to deepen their relationship with God. Through various ministries, outreach programs, 
            and community events, we strive to live out the Gospel in our daily lives.
          </p>
          
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 400, color: "#1f1d17", marginTop: 32, marginBottom: 12 }}>
            Our Mission
          </h2>
          <p>
            To promote faith, unity and service. We are called to be instruments of God's love, serving one another with humility 
            and compassion, and fostering a community where everyone feels a sense of belonging.
          </p>

          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 400, color: "#1f1d17", marginTop: 32, marginBottom: 12 }}>
            Our Vision
          </h2>
          <p>
            A united Catholic community guided by God's love. We envision a parish that is vibrant, inclusive, and deeply committed 
            to the spiritual and social well-being of all its members.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutParish;