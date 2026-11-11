import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaChurch, FaMapMarkerAlt, FaSearch, FaUserFriends, FaArrowRight } from 'react-icons/fa';

const toSlug = (value = '') =>
  value
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const Parishes = () => {
  const [parishes, setParishes] = useState([]);
  const [deaneries, setDeaneries] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [parishResponse, deaneryResponse] = await Promise.all([
          fetch('http://localhost:8080/api/parishes'),
          fetch('http://localhost:8080/api/deaneries'),
        ]);

        if (!parishResponse.ok || !deaneryResponse.ok) {
          throw new Error('Failed to load parish directory data');
        }

        const [parishesData, deaneriesData] = await Promise.all([
          parishResponse.json(),
          deaneryResponse.json(),
        ]);

        setParishes(Array.isArray(parishesData) ? parishesData : []);
        setDeaneries(Array.isArray(deaneriesData) ? deaneriesData : []);
      } catch (err) {
        console.error(err);
        setError('Could not load parish information right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const deaneryMap = useMemo(
    () => new Map((deaneries || []).map((deanery) => [deanery.id, deanery.name])),
    [deaneries]
  );

  const filteredParishes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return parishes;

    return (parishes || []).filter((parish) => {
      const deaneryName = deaneryMap.get(parish.deaneryId) || '';
      const haystack = `${parish.name || ''} ${parish.address || ''} ${deaneryName}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [deaneries, parishes, search, deaneryMap]);

  const totalCatholics = useMemo(
    () => parishes.reduce((sum, parish) => sum + (Number(parish.catholicCount) || 0), 0),
    [parishes]
  );

  return (
    <div className="parish-directory">
      <section className="parish-directory__hero">
        <div className="parish-directory__hero-glow" />
        <Container className="py-5 position-relative">
          <Row className="align-items-end g-4">
            <Col lg={8}>
              <Badge bg="warning" text="dark" className="mb-3 px-3 py-2 rounded-pill fw-bold">
                All Parishes
              </Badge>
              <h1 className="display-5 fw-bold mb-3">Find your parish and connect with the wider Church.</h1>
              <p className="lead text-white-50 mb-0">
                Explore the churches, deaneries, and local communities that make up the Archdiocese of Harare.
              </p>
            </Col>

            <Col lg={4}>
              <div className="parish-directory__stats">
                <div>
                  <strong>{parishes.length}</strong>
                  <small>Parishes</small>
                </div>
                <div>
                  <strong>{deaneries.length}</strong>
                  <small>Deaneries</small>
                </div>
                <div>
                  <strong>{totalCatholics.toLocaleString()}</strong>
                  <small>Members</small>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        <div className="parish-directory__toolbar">
          <Form className="parish-directory__search">
            <FaSearch />
            <Form.Control
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by parish, area, or deanery"
              aria-label="Search parishes"
            />
          </Form>
        </div>

        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" />
            <p className="mt-3 text-muted">Loading parishes...</p>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="text-center border-0 shadow-sm">
            {error}
          </Alert>
        )}

        {!loading && !error && (
          filteredParishes.length > 0 ? (
            <Row className="g-4">
              {filteredParishes.map((parish) => (
                <Col key={parish.id} md={6} lg={4}>
                  <Card className="parish-directory__card h-100 border-0 shadow-sm">
                    <Card.Body className="d-flex flex-column h-100">
                      <div className="parish-directory__card-header">
                        <div className="parish-directory__icon">
                          <FaChurch />
                        </div>
                        <Badge bg="light" text="dark" className="rounded-pill px-3 py-2">
                          {deaneryMap.get(parish.deaneryId) || 'Parish'}
                        </Badge>
                      </div>

                      <h3 className="parish-directory__name">{parish.name}</h3>

                      <div className="parish-directory__meta">
                        <FaMapMarkerAlt />
                        <span>{parish.address || 'Location not provided'}</span>
                      </div>

                      <div className="parish-directory__meta">
                        <FaUserFriends />
                        <span>{Number(parish.catholicCount || 0).toLocaleString()} Catholics</span>
                      </div>

                      <div className="mt-auto pt-3">
                        <Button
                          as={Link}
                          to={`/parishes/${parish.slug || toSlug(parish.name)}`}
                          variant="warning"
                          className="w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
                        >
                          Visit Parish
                          <FaArrowRight />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Alert variant="light" className="text-center border-0 shadow-sm">
              No parishes match your search right now. Try another parish name or location.
            </Alert>
          )
        )}
      </Container>
    </div>
  );
};

export default Parishes;
