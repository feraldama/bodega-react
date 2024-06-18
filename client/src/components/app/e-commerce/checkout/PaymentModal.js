import React, { useState } from 'react';
import {
  Modal,
  Button,
  Row,
  Col,
  Table,
  InputGroup,
  Form
} from 'react-bootstrap';

const PaymentModal = ({
  show,
  handleClose,
  totalCost,
  totalRest,
  setTotalRest,
  setPagoTipo,
  efectivo,
  setEfectivo,
  banco,
  setBanco,
  cuentaCliente,
  setCuentaCliente,
  sendRequest
}) => {
  const [pagoTipo, setPagoTipoLocal] = useState('E');

  const onNumberClickModal = label => {
    let efe = 0;
    let ban = 0;
    let cuentaCli = 0;
    let totalResto = 0;
    if (pagoTipo === 'E') {
      efe = efectivo == 0 ? `${label}` : `${efectivo}${label}`;
      totalResto = totalCost - efe - banco - cuentaCliente;
      setEfectivo(efe);
    } else if (pagoTipo === 'B') {
      ban = banco == 0 ? `${label}` : `${banco}${label}`;
      totalResto = totalCost - efectivo - ban - cuentaCliente;
      setBanco(ban);
    } else {
      cuentaCli = cuentaCliente == 0 ? `${label}` : `${cuentaCliente}${label}`;
      totalResto = totalCost - efectivo - banco - cuentaCli;
      setCuentaCliente(cuentaCli);
    }
    setTotalRest(totalResto);
  };

  const cerarCantidadModal = () => {
    let totalResto = 0;
    if (pagoTipo === 'E') {
      totalResto = totalCost - banco - cuentaCliente;
      setEfectivo(0);
    } else if (pagoTipo === 'B') {
      totalResto = totalCost - efectivo - cuentaCliente;
      setBanco(0);
    } else {
      totalResto = totalCost - efectivo - banco;
      setCuentaCliente(0);
    }
    setTotalRest(totalResto);
  };

  const buttonsPago = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    ['00', 0, '000']
  ];

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Seleccione un método de pago</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <Button
              variant="light"
              className="w-100 mb-2"
              onClick={() => setPagoTipoLocal('E')}
            >
              Efectivo
            </Button>
            <Button
              variant="light"
              className="w-100 mb-2"
              onClick={() => {
                setPagoTipoLocal('B');
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
                setPagoTipoLocal('C');
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
                              if (label === '00' || label === '000') {
                                onNumberClickModal(label);
                              } else if (label === 'Cerar') {
                                cerarCantidadModal();
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
  );
};

export default PaymentModal;
