import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, InputGroup } from 'react-bootstrap';
import CartItem from './CartItem';
import { ProductContext } from 'context/Context';
import { getSubtotal } from 'helpers/utils';
import axios from 'axios';
import { js2xml } from 'xml-js';
import Swal from 'sweetalert2';

import '../NumericKeypad/NumericKeypad.css'; // Importa el archivo CSS

const ShoppingCart = () => {
  const [totalCost, setTotalCost] = useState(0);

  const formattedTotalCost = new Intl.NumberFormat('es-ES').format(totalCost);

  const {
    productsState: { cartItems }
  } = useContext(ProductContext);

  useEffect(() => {
    setTotalCost(getSubtotal(cartItems));
  }, [cartItems]);

  const sendRequest = async () => {
    const fecha = new Date();
    let dia = fecha.getDate();
    let mes = fecha.getMonth() + 1;
    let año = fecha.getFullYear() % 100;

    if (dia < 10) dia = '0' + dia;
    if (mes < 10) mes = '0' + mes;
    if (año < 10) año = '0' + año;

    const fechaFormateada = `${dia}/${mes}/${año}`;

    const clienteId = 32;
    const SDTProductoItem = cartItems.map(producto => ({
      ClienteId: clienteId,
      Producto: {
        ProductoId: producto.id,
        VentaProductoCantidad: producto.quantity,
        ProductoPrecioVenta: producto.price,
        ProductoUnidad: 'U',
        VentaProductoPrecioTotal: producto.quantity * producto.price,
        Combo: 'N',
        ComboPrecio: 0
      }
    }));

    const json = {
      Envelope: {
        _attributes: { xmlns: 'http://schemas.xmlsoap.org/soap/envelope/' },
        Body: {
          'PVentaConfirmarWS.VENTACONFIRMAR': {
            _attributes: { xmlns: 'Alonso' },
            Sdtproducto: {
              SDTProductoItem: SDTProductoItem
            },
            Ventafechastring: fechaFormateada,
            Almacenorigenid: 1,
            Clientetipo: 'MI',
            Cajaid: 3,
            Usuarioid: 'admin',
            Efectivo: 50000,
            Total2: getSubtotal(cartItems),
            Ventatipo: ventaTipo,
            Pagotipo: 'E',
            Clienteid: 32
          }
        }
      }
    };

    const xml = js2xml(json, { compact: true, ignoreComment: true, spaces: 4 });

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
      let timerInterval;
      Swal.fire({
        title: 'Venta realizada con éxito!',
        html: 'Nueva venta en <b></b> segundos.',
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const timer = Swal.getPopup().querySelector('b');
          timerInterval = setInterval(() => {
            const secondsLeft = Math.ceil(Swal.getTimerLeft() / 1000);
            timer.textContent = `${secondsLeft}`;
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
      }).then(result => {
        if (result.dismiss === Swal.DismissReason.timer) {
          window.location.reload();
        }
      });

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

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
              <Button onClick={sendRequest} variant="primary" size="sm">
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
              {cartItems.map(product => (
                <CartItem key={product.id} product={product} />
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
            <Button onClick={sendRequest} variant="primary" size="sm">
              Pagar
            </Button>
          </Card.Footer>
        )}
      </Card>
    </>
  );
};

export default ShoppingCart;
