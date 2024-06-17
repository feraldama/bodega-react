import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import './TopProducts.css';
import useProductHook from '../product/useProductHook';

const TopProducts = ({ products, productsDispatch }) => {
  return (
    <Card className="d-none d-md-block mb-0 w-100 product-padre">
      <Row className="gx-2 product-row">
        {products.slice(0, 11).map(product => {
          const { handleAddToCart } = useProductHook(product);

          const handleAddToCartAndFocus = () => {
            handleAddToCart(0, true, true);
            productsDispatch({
              type: 'UPDATE_SELECTED_PRODID',
              payload: { id: product.id }
            });
          };

          return (
            <Col
              key={product.id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="product-col"
              onClick={() => handleAddToCartAndFocus()}
            >
              <Card className="text-center product-card">
                <Card.Body>
                  <Card.Title style={{ fontSize: '12px' }}>
                    {product.name}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
};

export default TopProducts;
