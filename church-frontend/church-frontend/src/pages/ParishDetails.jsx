import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Spinner } from 'react-bootstrap';
import {
  FaChurch,
  FaMapMarkerAlt,
  FaUserTie,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaUsers,
  FaChevronRight,
} from 'react-icons/fa';
import EventSection from '../components/parish/EventSection';
import AnnouncementList from '../components/parish/AnnouncementList';
import GallerySection from '../components/parish/GallerySection';
import DocumentSection from '../components/parish/DocumentSection';
import PodcastSection from '../components/parish/PodcastSection';

const normalizeSlug = (value = '') =>
  value
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// ── Small building blocks ─────────────────────────────────────
const InfoTile = ({ icon: Icon, label, value }) => (
  <div
    style={{
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      padding: '14px 16px',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    }}
  >
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: 8,
        background: '#eff6ff',
        color: '#2563eb',
        flexShrink: 0,
      }}
    >
      <Icon size={16} />
    </span>
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#6b7280',
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: '#111827',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </div>
    </div>
  </div>
);

const Card = ({ title, children }) => (
  <section
    style={{
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      background: '#fff',
      overflow: 'hidden',
    }}
  >
    <header
      style={{
        borderBottom: '1px solid #e5e7eb',
        padding: '12px 20px',
        fontSize: 15,
        fontWeight: 500,
        color: '#111827',
      }}
    >
      {title}
    </header>
    <div style={{ padding: 20 }}>{children}</div>
  </section>
);

const LeaderRow = ({ role, name, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 38,
        height: 38,
        borderRadius: '50%',
        background: '#f3f4f6',
        color: '#6b7280',
        flexShrink: 0,
      }}
    >
      <FaUserTie size={16} />
    </span>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 12, color: '#6b7280' }}>{role}</div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: '#111827',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </div>
      {title && <div style={{ fontSize: 12, color: '#6b7280' }}>{title}</div>}
    </div>
  </div>
);

// ── Page ──────────────────────────────────────────────────────
const ParishDetails = () => {
  const { slug } = useParams();
  const [parish, setParish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);

    const fetchParish = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/parishes');
        if (!response.ok) throw new Error('Failed to fetch parishes');

        const data = await response.json();
        const targetSlug = normalizeSlug(slug);
        const foundParish = Array.isArray(data)
          ? data.find(
              (p) =>
                normalizeSlug(p.slug) === targetSlug ||
                normalizeSlug(p.name) === targetSlug,
            )
          : null;

        if (!foundParish) {
          if (active) setError('Parish not found');
          return;
        }

        let deanery = null;
        if (foundParish.deaneryId) {
          const r = await fetch(
            `http://localhost:8080/api/deaneries/${foundParish.deaneryId}`,
          );
          if (r.ok) deanery = await r.json();
        }

        let parishPriest = null;
        if (foundParish.parishPriestId) {
          const r = await fetch(
            `http://localhost:8080/api/priests/${foundParish.parishPriestId}`,
          );
          if (r.ok) parishPriest = await r.json();
        }

        let assistantPriest = null;
        if (foundParish.assistantPriestId) {
          const r = await fetch(
            `http://localhost:8080/api/priests/${foundParish.assistantPriestId}`,
          );
          if (r.ok) assistantPriest = await r.json();
        }

        if (active) {
          setParish({ ...foundParish, deanery, parishPriest, assistantPriest });
        }
      } catch (err) {
        console.error(err);
        if (active) setError('Could not load parish details.');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchParish();
    return () => {
      active = false;
    };
  }, [slug]);

  // ── Loading ────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
          <Container style={{ padding: '32px 16px' }}>
            <div
              style={{
                height: 14,
                width: 180,
                background: '#e5e7eb',
                borderRadius: 4,
              }}
            />
            <div
              style={{
                height: 32,
                width: '60%',
                maxWidth: 420,
                background: '#e5e7eb',
                borderRadius: 6,
                marginTop: 14,
              }}
            />
            <div
              style={{
                height: 14,
                width: '40%',
                maxWidth: 260,
                background: '#f3f4f6',
                borderRadius: 4,
                marginTop: 12,
              }}
            />
          </Container>
        </div>
        <Container
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)',
            padding: '32px 16px',
          }}
        >
          <div
            style={{
              height: 260,
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              background: '#fff',
            }}
          />
          <div
            style={{
              height: 260,
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              background: '#fff',
            }}
          />
        </Container>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────
  if (error || !parish) {
    return (
      <Container
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '48px 16px',
        }}
      >
        <span
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#f3f4f6',
            color: '#6b7280',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FaChurch size={24} />
        </span>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: '#111827',
            marginTop: 16,
          }}
        >
          {error || 'Parish not found'}
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>
          We couldn't find this parish. It may have been moved or removed.
        </p>
        <Button
          as={Link}
          to="/deaneries"
          style={{
            marginTop: 24,
            background: '#2563eb',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Back to Deaneries
        </Button>
      </Container>
    );
  }

  const parishDescription = parish.deanery
    ? `${parish.name} is part of the ${parish.deanery.name} deanery and serves the local Catholic community in ${parish.deanery.territory || 'the area'}.`
    : 'This parish is part of the Archdiocese of Harare and serves the local Catholic community.';

  // ── Page ───────────────────────────────────────────────────
  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      {/* Top utility bar with breadcrumb */}
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <Container
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            gap: 12,
          }}
        >
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: '#6b7280',
              minWidth: 0,
            }}
          >
            <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }}>
              Home
            </Link>
            <FaChevronRight size={10} color="#d1d5db" />
            <Link
              to="/deaneries"
              style={{ color: '#6b7280', textDecoration: 'none' }}
            >
              Deaneries
            </Link>
            <FaChevronRight size={10} color="#d1d5db" />
            <span
              style={{
                color: '#111827',
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {parish.name}
            </span>
          </nav>

          <div style={{ display: 'flex', gap: 8 }}>
            <a
              href={`tel:${parish.phone || ''}`}
              style={{
                border: '1px solid #d1d5db',
                background: '#fff',
                color: '#374151',
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Call
            </a>
            <a
              href={`mailto:${parish.email || ''}`}
              style={{
                background: '#2563eb',
                color: '#fff',
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Email parish
            </a>
          </div>
        </Container>
      </div>

      {/* Page header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
        <Container style={{ padding: '32px 16px' }}>
          <Badge
            style={{
              background: '#eff6ff',
              color: '#1d4ed8',
              fontWeight: 500,
              fontSize: 12,
              padding: '5px 10px',
              borderRadius: 6,
            }}
          >
            {parish.deanery?.name || 'Deanery pending'}
          </Badge>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: '#111827',
              marginTop: 12,
              marginBottom: 6,
            }}
          >
            {parish.name}
          </h1>
          <p
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#6b7280',
              fontSize: 14,
              margin: 0,
            }}
          >
            <FaMapMarkerAlt size={13} />
            {parish.address || 'Location not provided'}
          </p>
        </Container>
      </div>

      {/* Main grid */}
      <Container style={{ padding: '24px 16px' }}>
        <Row className="g-3">
          <Col lg={8}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Card title="About the parish">
                <p
                  style={{
                    color: '#4b5563',
                    fontSize: 14,
                    lineHeight: 1.6,
                    marginTop: 0,
                    marginBottom: 16,
                  }}
                >
                  {parishDescription}
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 12,
                  }}
                >
                  <InfoTile
                    icon={FaMapMarkerAlt}
                    label="Address"
                    value={parish.address || 'Not available'}
                  />
                  <InfoTile
                    icon={FaCalendarAlt}
                    label="Established"
                    value={parish.yearEstablished || 'Not available'}
                  />
                  <InfoTile
                    icon={FaUsers}
                    label="Catholics"
                    value={parish.catholicCount ?? 0}
                  />
                </div>
              </Card>
            </div>
          </Col>

          <Col lg={4}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Card title="Leadership">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <LeaderRow
                    role="Parish priest"
                    name={parish.parishPriest?.name || 'Not assigned'}
                    title={parish.parishPriest?.title}
                  />
                  {parish.assistantPriest && (
                    <LeaderRow
                      role="Assistant priest"
                      name={parish.assistantPriest.name}
                      title={parish.assistantPriest.title}
                    />
                  )}
                </div>
              </Card>

              <Card title="Contact">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <a
                    href={`tel:${parish.phone || ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      color: '#1d4ed8',
                      fontSize: 14,
                      textDecoration: 'none',
                    }}
                  >
                    <FaPhone size={13} />
                    {parish.phone || 'Phone not available'}
                  </a>
                  <a
                    href={`mailto:${parish.email || ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      color: '#1d4ed8',
                      fontSize: 14,
                      textDecoration: 'none',
                      wordBreak: 'break-all',
                    }}
                  >
                    <FaEnvelope size={13} style={{ flexShrink: 0 }} />
                    {parish.email || 'Email not available'}
                  </a>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Content sections */}
      <Container style={{ paddingBottom: 48 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <EventSection />
          <AnnouncementList />
          <GallerySection />
          <DocumentSection />
          <PodcastSection />
        </div>
      </Container>
    </div>
  );
};

export default ParishDetails;