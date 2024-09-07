import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, InputGroup } from 'react-bootstrap';
import CartItem from './CartItem';
import { ProductContext } from 'context/Context';
import { getSubtotal } from 'helpers/utils';
import axios from 'axios';
import { js2xml } from 'xml-js';
import Swal from 'sweetalert2';

import '../NumericKeypad/NumericKeypad.css'; // Importa el archivo CSS

const ShoppingCart = ({ handleShow }) => {
  const [totalCost, setTotalCost] = useState(0);

  const formattedTotalCost = new Intl.NumberFormat('es-ES').format(totalCost);

  const {
    productsState: { cartItems }
  } = useContext(ProductContext);

  useEffect(() => {
    setTotalCost(getSubtotal(cartItems));
  }, [cartItems]);

  return (
    <>
      <Card>
        <Card.Header className="d-xs-block d-md-none">
          <Row className="justify-content-between">
            <Col xs="auto">
              <h5 className="mb-3 mb-md-0">
                Productos ({cartItems.length} Items)
              </h5>
            </Col>
            <Col xs="auto">
              <Button onClick={handleShow} variant="primary" size="sm">
                Pagar
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-0">
          {cartItems.length > 0 ? (
            <>
              <Row className="gx-card mx-0 bg-200 text-900 fs-10 fw-semibold">
                <Col xs={9} md={5} className="py-2">
                  Nombre
                </Col>
                <Col xs={3} md={7}>
                  <Row>
                    <Col md={4} className="py-2 d-none d-md-block text-center">
                      Cantidad
                    </Col>
                    <Col
                      xs={12}
                      md={4}
                      className="d-none d-md-block text-end py-2"
                    >
                      Precio Uni.
                    </Col>
                    <Col xs={12} md={4} className="text-end py-2">
                      Total
                    </Col>
                  </Row>
                </Col>
              </Row>
              {cartItems.map((product, index) => (
                <CartItem key={index} product={product} index={index} />
              ))}
              <Row className="d-xs-block d-md-none fw-bold gx-card mx-0">
                <Col xs={7} md={4} className="py-2 text-end text-900">
                  Total
                </Col>
                <Col className="px-0">
                  <Row className="gx-card mx-0">
                    <Col md={7} className="py-2 d-none d-md-block text-center">
                      {cartItems.length} (items)
                    </Col>
                    <Col
                      xs={12}
                      md={5}
                      className="text-end py-2 text-nowrap px-x1"
                    >
                      Gs. {formattedTotalCost}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </>
          ) : (
            <p className="p-x1 mb-0 bg-body-tertiary">
              No tiene productos cargados!
            </p>
          )}
        </Card.Body>

        {cartItems.length > 0 && (
          <Card.Footer className="d-xs-block d-md-none bg-body-tertiary d-flex justify-content-end">
            <Button onClick={handleShow} variant="primary" size="sm">
              Pagar
            </Button>
          </Card.Footer>
        )}
      </Card>
    </>
  );
};

export default ShoppingCart;
