import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Form } from 'react-bootstrap';
import { FaChurch, FaMapMarkerAlt, FaUsers, FaSearch } from 'react-icons/fa';

const DeaneryDetails = () => {
  const { id } = useParams();
  const [deanery, setDeanery] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchDeanery = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/deaneries/${id}`);

        if (!response.ok) {
          throw new Error('Deanery not found');
        }

        const data = await response.json();
        setDeanery(data);
      } catch (err) {
        console.error(err);
        setError('Could not load this deanery.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeanery();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center my-5">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3 text-muted">Loading deanery details...</p>
      </Container>
    );
  }

  if (error || !deanery) {
    return (
      <Container className="py-5 text-center my-5">
        <FaChurch size={60} className="text-warning mb-3" />
        <h2>{error || 'Deanery Not Found'}</h2>
        <p className="text-muted">This deanery is not available in the database right now.</p>
        <Button as={Link} to="/deaneries" variant="primary" className="mt-3">Back to Deaneries</Button>
      </Container>
    );
  }

  const filteredParishes = (deanery.parishes || []).filter((parish) =>
    parish.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div>
      <section className="bg-primary text-white py-5" style={{ background: 'linear-gradient(135deg, #0D47A1, #1a237e)' }}>
        <Container>
          <Badge bg="warning" text="dark" className="mb-3">Deanery</Badge>
          <h1 className="display-4 fw-bold">{deanery.name}</h1>
          <p className="lead mb-0">
            <FaMapMarkerAlt className="me-2" /> {deanery.territory || 'Location not provided'}
          </p>
        </Container>
      </section>

      <Container className="py-5">
        <Row className="mb-4">
          <Col lg={8}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h3 className="fw-bold mb-3">About this deanery</h3>
                <p className="text-muted mb-0">
                  {deanery.description || 'No deanery description has been added yet.'}
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm border-0 bg-light h-100">
              <Card.Body>
                <h5 className="fw-bold mb-3">Overview</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Parishes</span>
                  <strong>{deanery.parishCount || (deanery.parishes || []).length}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Status</span>
                  <strong>{deanery.status || 'ACTIVE'}</strong>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <Form className="d-flex align-items-center gap-2">
              <FaSearch className="text-muted" />
              <Form.Control
                type="text"
                placeholder="Search parish by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form>
          </Col>
        </Row>

        <Row>
          {filteredParishes.length === 0 ? (
            <Col>
              <Alert variant="light" className="text-center">No parishes match this deanery search right now.</Alert>
            </Col>
          ) : (
            filteredParishes.map((parish) => (
              <Col key={parish.id} md={6} lg={4} className="mb-4">
                <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <FaChurch className="text-warning me-3" size={22} />
                      <div>
                        <h5 className="mb-0 fw-bold">{parish.name}</h5>
                        <small className="text-muted">Parish</small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-2 text-muted small">
                      <FaUsers className="me-2" />
                      {deanery.name}
                    </div>

                    <Button as={Link} to={`/parishes/${parish.slug}`} variant="outline-warning" size="sm">
                      Open Parish
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>
  );
};

export default DeaneryDetails;
