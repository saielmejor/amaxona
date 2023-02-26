import { useEffect, useReducer, useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";
import axios from "axios";
import logger from "use-reducer-logger";
import { Helmet } from "react-helmet-async";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    // set the loading to true so you can show a loading box ;

    case "FETCH_SUCESS":
      return { ...state, products: action.payload, loading: false };

    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    loading: true,
    error: "",
    products: [],
  });
  // const [products,setProducts]=useState([]);
  //use effect
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products/");
        dispatch({ type: "FETCH_SUCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }

      // setProducts(result.data); // gets the data from the backend
    };
    fetchData(); //executes fetch data
  }, []);
  return (
    <div>
    <Helmet><title>Amazona</title></Helmet>
      <h1>Featured Products</h1>
      <div className="products">
        {loading ? (
          <div> Loading</div>
        ) : error ? (
          <div> {error} </div>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={3} lg={4} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
export default HomeScreen;
