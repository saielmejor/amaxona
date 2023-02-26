import { useParams } from "react-router-dom";
import { useReducer, useEffect } from "react";
import axios from "axios";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Rating from "../components/Rating";
import Button from "react-bootstrap/esm/Button";
import { Helmet } from "react-helmet-async";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    // set the loading to true so you can show a loading box ;

    case "FETCH_SUCESS":
      return { ...state, product: action.payload, loading: false };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
function ProductScreen() {
  const params = useParams();
  const { slug } = params;
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    product: [], // show only one product
  });
  // const [products,setProducts]=useState([]);
  //use effect
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: "FETCH_SUCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }

      // setProducts(result.data); // gets the data from the backend
    };
    fetchData(); //executes fetch data
  }, [slug]);
  //   use slug so when there is a change there would be an uodated in the website
  return loading ? (
    <div>Loading....</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img className="img-large" src={product.image} alt={product.name} />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
            <Helmet> <title>{product.name}</title></Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating rating={product.rating} numReviews={product.numReviews}>
                {" "}
              </Rating>
            </ListGroup.Item>
            <ListGroupItem>Price: ${product.price}</ListGroupItem>
            <ListGroupItem>
              Description: <p>{product.description}</p>
            </ListGroupItem>
          </ListGroup>
        </Col>
        {/* create cart */}
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush ">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success"> In Stock</Badge>
                      ) : (
                        <Badge bg="danger"> Out of Stock</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroupItem>
                    <div className="d-grid">
                      <Button variant="primary">Add to Cart </Button>
                    </div>
                  </ListGroupItem>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProductScreen;
