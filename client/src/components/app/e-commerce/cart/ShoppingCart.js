import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, InputGroup } from 'react-bootstrap';
import IconButton from 'components/common/IconButton';
import { Link } from 'react-router-dom';
import CartItem from './CartItem';
import CartModal from './CartModal';
import { ProductContext } from 'context/Context';
import { getSubtotal } from 'helpers/utils';
import axios from 'axios';
import { js2xml } from 'xml-js';
import Flex from 'components/common/Flex';

const ShoppingCart = () => {
  const [totalCost, setTotalCost] = useState(0);
  const [promoCode, setPromoCode] = useState('');

  const [ventaTipo, setVentaTipo] = useState('CO');
  const [pagoTipo, setPagoTipo] = useState('E');
  const formattedTotalCost = new Intl.NumberFormat('es-ES').format(totalCost);

  const {
    productsState: { cartItems },
    productsDispatch
  } = useContext(ProductContext);

  useEffect(() => {
    setTotalCost(getSubtotal(cartItems));
  }, [cartItems]);

  const applyPromo = e => {
    e.preventDefault();
    productsDispatch({
      type: 'APPLY_PROMO',
      payload: {
        promoCode
      }
    });
    setPromoCode('');
  };

  const sendRequest = async () => {
    const clienteId = 32;
    // Tu objeto JSON
    const SDTProductoItem = cartItems.map(producto => ({
      ClienteId: clienteId,
      Producto: {
        ProductoId: producto.id,
        VentaProductoCantidad: producto.quantity,
        ProductoPrecioVenta: producto.price,
        ProductoUnidad: 'U', // Asumiendo 'U' como constante
        VentaProductoPrecioTotal: producto.quantity * producto.price,
        Combo: 'N', // Asumiendo 'N' como constante
        ComboPrecio: 0 // Asumiendo 0 como constante
      }
    }));
    console.log('log: 🚀  SDTProductoItem:', SDTProductoItem);

    const json = {
      Envelope: {
        _attributes: { xmlns: 'http://schemas.xmlsoap.org/soap/envelope/' },
        Body: {
          'PVentaConfirmarWS.VENTACONFIRMAR': {
            _attributes: { xmlns: 'Alonso' },
            Sdtproducto: {
              SDTProductoItem: SDTProductoItem
            },
            Ventafechastring: '12/06/24',
            Almacenorigenid: 1,
            Clientetipo: 'MI',
            Cajaid: 3,
            Usuarioid: 'admin',
            Efectivo: 50000,
            Total2: totalCost,
            Ventatipo: ventaTipo,
            Pagotipo: pagoTipo,
            Clienteid: 32
          }
        }
      }
    };

    // Convierte JSON a XML
    const xml = js2xml(json, { compact: true, ignoreComment: true, spaces: 4 });

    // Configura la solicitud axios
    const config = {
      headers: {
        'Content-Type': 'text/xml'
      }
    };

    try {
      const response = await axios.post(
        process.env.REACT_APP_URL +
          ':8080/AlonsoBodega/servlet/com.alonso.apventaconfirmarws',
        xml,
        config
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Card>
        <Card.Header>
          <Row className="justify-content-between">
            <Col md="auto">
              <h5 className="mb-3 mb-md-0">
                Productos ({cartItems.length} Items)
              </h5>
            </Col>
            <Col md="auto">
              {/* <IconButton
                className="border-300 me-2"
                iconClassName="me-1"
                variant="outline-secondary"
                size="sm"
                icon="chevron-left"
                transform="shrink-4"
                as={Link}
                to="/e-commerce/product/product-list"
              >
                Continuar Comprando
              </IconButton> */}
              <Button onClick={sendRequest} variant="primary" size="sm">
                Pagar
              </Button>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col md="auto">
              <Form as={Row} className="gx-2">
                <Col xs="auto">
                  <small>Tipo:</small>
                </Col>
                <Col xs="auto">
                  <InputGroup size="sm">
                    <Form.Select
                      className="pe-5"
                      defaultValue="CO"
                      onChange={({ target }) => setVentaTipo(target.value)}
                    >
                      <option value="CO">Contado</option>
                      <option value="CR">Crédito</option>
                    </Form.Select>
                  </InputGroup>
                </Col>
              </Form>
            </Col>
            <Col md="auto">
              <Form as={Row} className="gx-2">
                <Col xs="auto">
                  <small>Pago:</small>
                </Col>
                <Col xs="auto">
                  <InputGroup size="sm">
                    <Form.Select
                      className="pe-5"
                      defaultValue="CO"
                      onChange={({ target }) => setPagoTipo(target.value)}
                    >
                      <option value="E">Efectivo</option>
                      <option value="P">POS</option>
                    </Form.Select>
                  </InputGroup>
                </Col>
              </Form>
            </Col>
          </Row>
          {/* <Row className="justify-content-between">
            <Col md="auto">
              <Form as={Row} className="gx-2">
                <Col xs="auto">
                  <small>Pago:</small>
                </Col>
                <Col xs="auto">
                  <InputGroup size="sm">
                    <Form.Select
                      className="pe-5"
                      defaultValue="CO"
                      onChange={({ target }) => setPagoTipo(target.value)}
                    >
                      <option value="E">Efectivo</option>
                      <option value="P">POS</option>
                    </Form.Select>
                  </InputGroup>
                </Col>
              </Form>
            </Col>
          </Row> */}
        </Card.Header>
        <Card.Body className="p-0">
          {cartItems.length > 0 ? (
            <>
              <Row className="gx-card mx-0 bg-200 text-900 fs-10 fw-semibold">
                <Col xs={9} md={7} className="py-2">
                  Nombre
                </Col>
                <Col xs={3} md={5}>
                  <Row>
                    <Col md={8} className="py-2 d-none d-md-block text-center">
                      Cantidad
                    </Col>
                    <Col xs={12} md={4} className="text-end py-2">
                      Precio
                    </Col>
                  </Row>
                </Col>
              </Row>
              {cartItems.map(product => (
                <CartItem key={product.id} product={product} />
              ))}
              <Row className="fw-bold gx-card mx-0">
                <Col xs={8} md={7} className="py-2 text-end text-900">
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
          <Card.Footer className="bg-body-tertiary d-flex justify-content-end">
            <Form className="me-3" onSubmit={applyPromo}>
              <div className="input-group input-group-sm">
                <Form.Control
                  type="text"
                  placeholder="GET50"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                />
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="border-300"
                  type="submit"
                >
                  Aplicar
                </Button>
              </div>
            </Form>
            <Button onClick={sendRequest} variant="primary" size="sm">
              Pagar
            </Button>
          </Card.Footer>
        )}
      </Card>
      {/* <CartModal /> */}
    </>
  );
};

export default ShoppingCart;
