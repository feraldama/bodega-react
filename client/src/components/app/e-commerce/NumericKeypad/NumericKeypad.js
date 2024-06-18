import React, { useContext, useState, useEffect } from 'react';
import {
  Button,
  Table,
  Card,
  Col,
  Form,
  Row,
  InputGroup,
  Modal
} from 'react-bootstrap';
import './NumericKeypad.css';
import { ProductContext, CustomerContext } from 'context/Context';
import { getSubtotal } from 'helpers/utils';
import axios from 'axios';
import { js2xml } from 'xml-js';
import Swal from 'sweetalert2';

const NumericKeypad = ({ onNumberClick }) => {
  const [totalCost, setTotalCost] = useState(0);
  const [totalRest, setTotalRest] = useState(0);
  const [ventaTipo, setVentaTipo] = useState('CO');
  const [pagoTipo, setPagoTipo] = useState('E');
  const [showModal, setShowModal] = useState(false);
  const [cliente, setCliente] = useState('Cliente');

  const [efectivo, setEfectivo] = useState(0);
  const [banco, setBanco] = useState(0);
  const [cuentaCliente, setCuentaCliente] = useState(0);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const buttons = [
    [1, 2, 3, 'Cant.'],
    [4, 5, 6, '% de desc.'],
    [7, 8, 9, 'Precio'],
    ['.', 0, ',', 'Borrar']
  ];

  const buttonsPago = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    ['00', 0, '000']
  ];

  const {
    productsState: { selectedProductId, cartItems },
    productsDispatch
  } = useContext(ProductContext);

  const {
    customersState: { customers },
    customersDispatch
  } = useContext(CustomerContext);

  const onNumberClickModal = label => {
    let efe = 0;
    let ban = 0;
    let cuentaCli = 0;
    let totalResto = 0;
    if (pagoTipo == 'E') {
      efe = efectivo == 0 ? `${label}` : `${efectivo}${label}`;
      console.log('log: 🚀  efe:', efe);
      totalResto = totalCost - efe - banco - cuentaCliente;
      setEfectivo(efe);
    } else if (pagoTipo == 'B') {
      ban = banco == 0 ? `${label}` : `${banco}${label}`;
      totalResto = totalCost - efectivo - ban - cuentaCliente;
      console.log('log: 🚀  ban:', ban);
      setBanco(ban);
    } else {
      cuentaCli = cuentaCliente == 0 ? `${label}` : `${cuentaCliente}${label}`;
      totalResto = totalCost - efectivo - banco - cuentaCli;
      setCuentaCliente(cuentaCli);
    }
    // let totalResto = totalCost - efe - ban - cuentaCli;
    setTotalRest(totalResto);
  };

  const cerarCantidad = () => {
    if (selectedProductId !== null) {
      const updatedCartItems = cartItems
        .map(item => {
          if (item.id === selectedProductId) {
            return { ...item, quantity: 0 };
          }
          return item;
        })
        .filter(item => item.id === selectedProductId);
      productsDispatch({
        type: 'UPDATE_CART_QUANTITY',
        payload: { cartItems: updatedCartItems }
      });
    }
  };

  const cerarCantidadModal = () => {
    let totalResto = 0;
    if (pagoTipo == 'E') {
      totalResto = totalCost - banco - cuentaCliente;
      setEfectivo(0);
    } else if (pagoTipo == 'B') {
      totalResto = totalCost - banco;
      setBanco(0);
    } else {
      totalResto = totalCost - cuentaCliente;
      setCuentaCliente(0);
    }
    setTotalRest(totalResto);
  };

  useEffect(() => {
    // const formattedTotalCost = new Intl.NumberFormat('es-ES').format(
    //   getSubtotal(cartItems)
    // );
    setTotalRest(getSubtotal(cartItems));
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
            Clienteid: 32,
            Efectivoreact: efectivo,
            Bancoreact: banco,
            Clientecuentareact: cuentaCliente
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
      <Row className="d-none d-md-block fw-bold gx-card mx-0">
        <Col className="px-0">
          <Row className="gx-card mx-0">
            <Col xs={8} md={9} className="py-2 text-end text-900">
              Total
            </Col>
            <Col xs={4} md={3} className="text-end py-2 text-nowrap px-x1">
              {`Gs. ${new Intl.NumberFormat('es-ES').format(totalCost)}`}
            </Col>
          </Row>
        </Col>
      </Row>
      <Table bordered className="mb-0 numeric-keypad">
        <tbody>
          {buttons.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {/* {rowIndex === 0 && (
                <td rowSpan="1" className="p-1">
                  <Button
                    variant="light"
                    className="w-100 h-100"
                    onClick={() => {
                      console.log('log: 🚀 Cliente:');
                    }}
                  >
                    {cliente}
                  </Button>
                </td>
              )} */}
              {rowIndex === 0 && (
                <td rowSpan="4" className="p-1">
                  <Button
                    variant="primary"
                    className="w-100 pago-button"
                    onClick={handleShow}
                  >
                    Pagar
                  </Button>
                </td>
              )}
              {row.map((label, colIndex) => (
                <td key={colIndex} className="p-1">
                  <Button
                    variant="light"
                    // className="w-100 h-100"
                    style={{ width: '100%' }}
                    onClick={() => {
                      if (typeof label === 'number') {
                        onNumberClick(label);
                      } else {
                        if (label === 'Cant.') {
                          console.log('log: 🚀 Cant:');
                        } else if (label === '% de desc.') {
                          console.log('log: 🚀 desc:');
                        } else if (label === 'Precio') {
                          console.log('log: 🚀 Precio:');
                        } else if (label === '+/-') {
                          console.log('log: 🚀 +/-:');
                        } else if (label === ',') {
                          console.log('log: 🚀 ,');
                        } else if (label === 'Borrar') {
                          cerarCantidad();
                        } else if (label === 'Cliente') {
                          console.log('log: 🚀 Cliente:');
                        }
                      }
                    }}
                  >
                    {label}
                  </Button>
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td colSpan={5}>
              <Button
                variant="light"
                className="w-100 h-100 fixed-width-button"
                onClick={() => cerarCantidadModal()}
              >
                {cliente}
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Seleccione un método de pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Button
                variant="light"
                className="w-100 mb-2"
                onClick={() => setPagoTipo('E')}
              >
                Efectivo
              </Button>
              <Button
                variant="light"
                className="w-100 mb-2"
                onClick={() => {
                  setPagoTipo('B');
                  if (banco == 0) {
                    setBanco(totalRest);
                    setTotalRest(0);
                  }
                }}
              >
                Banco
              </Button>
              <Button
                variant="light"
                className="w-100 mb-2"
                onClick={() => {
                  setPagoTipo('C');
                  if (cuentaCliente == 0) {
                    setCuentaCliente(totalRest);
                    setTotalRest(0);
                  }
                }}
              >
                Cuenta de cliente
              </Button>
              <Row className="gx-card mx-0">
                <Col xs={8} md={8} className="py-2 text-end text-900">
                  Efectivo:
                </Col>
                <Col xs={4} md={3} className="text-end py-2 text-nowrap px-x1">
                  {new Intl.NumberFormat('es-ES').format(efectivo)}
                </Col>
              </Row>

              <Row className="gx-card mx-0">
                <Col xs={8} md={8} className="py-2 text-end text-900">
                  Banco:
                </Col>
                <Col xs={4} md={3} className="text-end py-2 text-nowrap px-x1">
                  {new Intl.NumberFormat('es-ES').format(banco)}
                </Col>
              </Row>

              <Row className="gx-card mx-0">
                <Col xs={8} md={8} className="py-2 text-end text-900">
                  Cuenta de cliente:
                </Col>
                <Col xs={4} md={3} className="text-end py-2 text-nowrap px-x1">
                  {new Intl.NumberFormat('es-ES').format(cuentaCliente)}
                </Col>
              </Row>
              <Row className="gx-card mx-0">
                <Col xs={8} md={8} className="py-2 text-end text-900">
                  Restante:
                </Col>
                <Col xs={4} md={3} className="text-end py-2 text-nowrap px-x1">
                  {new Intl.NumberFormat('es-ES').format(totalRest)}
                </Col>
              </Row>
            </Col>
            <Col>
              <Table bordered className="numeric-keypad">
                <tbody>
                  {buttonsPago.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((label, colIndex) => (
                        <td key={colIndex} className="p-1">
                          <Button
                            variant="light"
                            className="fixed-width-button"
                            onClick={() => {
                              if (typeof label === 'number') {
                                onNumberClickModal(label);
                              } else {
                                if (label === 'Cant.') {
                                  console.log('log: 🚀 Cant:');
                                } else if (label === '% de desc.') {
                                  console.log('log: 🚀 desc:');
                                } else if (label === 'Precio') {
                                  console.log('log: 🚀 Precio:');
                                } else if (label === '+/-') {
                                  console.log('log: 🚀 +/-:');
                                } else if (label === '00') {
                                  onNumberClickModal(label);
                                } else if (label === 'Cerar') {
                                  cerarCantidadModal();
                                } else if (label === '000') {
                                  onNumberClickModal(label);
                                }
                              }
                            }}
                          >
                            {label}
                          </Button>
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3}>
                      <Button
                        variant="light"
                        className="w-100 h-100 fixed-width-button"
                        onClick={() => cerarCantidadModal()}
                      >
                        Cerar
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
              <InputGroup className="mt-3">
                <InputGroup.Text>Total</InputGroup.Text>
                <Form.Control
                  readOnly
                  value={`Gs. ${new Intl.NumberFormat('es-ES').format(
                    totalCost
                  )}`}
                  aria-label="Total"
                />
              </InputGroup>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={sendRequest}>
            Validar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NumericKeypad;
