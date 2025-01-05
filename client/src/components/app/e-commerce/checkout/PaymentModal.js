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
  efectivo,
  setEfectivo,
  banco,
  setBanco,
  bancoDebito,
  setBancoDebito,
  bancoCredito,
  setBancoCredito,
  cuentaCliente,
  setCuentaCliente,
  sendRequest
}) => {
  const [pagoTipo, setPagoTipoLocal] = useState('E');

  const onNumberClickModal = label => {
    let efe = 0;
    let ban = 0;
    let deb = 0;
    let cuentaCli = 0;
    let totalResto = 0;
    if (pagoTipo === 'E') {
      efe = efectivo == 0 ? `${label}` : `${efectivo}${label}`;
      totalResto = totalCost - efe - banco - bancoDebito - cuentaCliente;
      setEfectivo(efe);
    } else if (pagoTipo === 'B') {
      ban = banco == 0 ? `${label}` : `${banco}${label}`;
      totalResto = totalCost - efectivo - ban - bancoDebito - cuentaCliente;
      setBanco(ban);
    } else if (pagoTipo === 'D') {
      deb = bancoDebito == 0 ? `${label}` : `${bancoDebito}${label}`;
      totalResto = totalCost - efectivo - banco - cuentaCliente - deb * 1.03; // Suma el 3%
      setBancoDebito(deb);
    } else {
      cuentaCli = cuentaCliente == 0 ? `${label}` : `${cuentaCliente}${label}`;
      totalResto = totalCost - efectivo - banco - bancoDebito - cuentaCli;
      setCuentaCliente(cuentaCli);
    }
    setTotalRest(totalResto);
  };

  const cerarCantidadModal = () => {
    let totalResto = 0;
    if (pagoTipo === 'E') {
      totalResto = totalCost - banco - bancoDebito - cuentaCliente;
      setEfectivo(0);
    } else if (pagoTipo === 'B') {
      totalResto = totalCost - efectivo - bancoDebito - cuentaCliente;
      setBanco(0);
    } else if (pagoTipo === 'D') {
      totalResto = totalCost - efectivo - banco - cuentaCliente;
      setBancoDebito(0);
    } else {
      totalResto = totalCost - efectivo - banco - bancoDebito;
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
            {/* Efectivo */}
            <Row className="gx-card mx-0">
              <Col xs={6} md={6} className="py-2 text-end text-900">
                Efectivo:
              </Col>
              <Col xs={6} md={6} className="text-end py-2 text-nowrap px-x1">
                <Form.Control
                  type="text"
                  value={new Intl.NumberFormat('es-ES').format(efectivo)}
                  onFocus={e => {
                    setPagoTipoLocal('E');
                    if (efectivo == 0) {
                      setEfectivo(totalRest);
                      setTotalRest(0);
                    }
                    e.target.select();
                  }}
                  onChange={e => {
                    const newValue = e.target.value.replace(/\D/g, '');
                    setEfectivo(newValue);
                    const totalResto =
                      totalCost -
                      newValue -
                      banco -
                      bancoDebito -
                      cuentaCliente;
                    setTotalRest(totalResto);
                  }}
                  aria-label="Efectivo"
                  className="text-end"
                />
              </Col>
            </Row>

            {/* Banco */}
            <Row className="gx-card mx-0">
              <Col xs={6} md={6} className="py-2 text-end text-900">
                Banco:
              </Col>
              <Col xs={6} md={6} className="text-end py-2 text-nowrap px-x1">
                <Form.Control
                  type="text"
                  value={new Intl.NumberFormat('es-ES').format(banco)}
                  onFocus={e => {
                    setPagoTipoLocal('B');
                    if (banco == 0) {
                      setBanco(totalRest);
                      setTotalRest(0);
                    }
                    e.target.select();
                  }}
                  onChange={e => {
                    const newValue = e.target.value.replace(/\D/g, '');
                    setBanco(newValue);
                    const totalResto =
                      totalCost -
                      efectivo -
                      newValue -
                      bancoDebito -
                      cuentaCliente;
                    setTotalRest(totalResto);
                  }}
                  aria-label="Banco"
                  className="text-end"
                />
              </Col>
            </Row>

            {/* Cuenta Cliente */}
            <Row className="gx-card mx-0">
              <Col xs={6} md={6} className="py-2 text-end text-900">
                Cuenta de cliente:
              </Col>
              <Col xs={6} md={6} className="text-end py-2 text-nowrap px-x1">
                <Form.Control
                  type="text"
                  // value={cuentaCliente}
                  value={new Intl.NumberFormat('es-ES').format(cuentaCliente)}
                  onFocus={e => {
                    setPagoTipoLocal('C');
                    if (cuentaCliente == 0) {
                      setCuentaCliente(totalRest);
                      setTotalRest(0);
                    }
                    e.target.select();
                  }}
                  onChange={e => {
                    const newValue = e.target.value.replace(/\D/g, ''); // Eliminar caracteres no numéricos
                    setCuentaCliente(newValue);
                    const totalResto =
                      totalCost - efectivo - banco - newValue - bancoDebito;
                    setTotalRest(totalResto);
                  }}
                  aria-label="Cuenta de cliente"
                  className="text-end"
                />
              </Col>
            </Row>

            {/* Banco Débito */}
            <Row className="gx-card mx-0">
              <Col xs={6} md={6} className="py-2 text-end text-900">
                Banco Débito (3% adicional):
              </Col>
              <Col xs={6} md={6} className="text-end py-2 text-nowrap px-x1">
                <Form.Control
                  type="text"
                  value={new Intl.NumberFormat('es-ES').format(bancoDebito)}
                  onFocus={e => {
                    setPagoTipoLocal('D');
                    if (bancoDebito == 0) {
                      setBancoDebito(totalRest * 1.03);
                      setTotalRest(0);
                    }
                    e.target.select();
                  }}
                  onChange={e => {
                    const newValue = e.target.value.replace(/\D/g, '');
                    setBancoDebito(newValue);
                    const totalResto =
                      totalCost -
                      efectivo -
                      banco -
                      cuentaCliente -
                      newValue * 1.03; // Calcula el 3% adicional
                    setTotalRest(totalResto);
                  }}
                  aria-label="Banco Débito"
                  className="text-end"
                />
              </Col>
            </Row>

            {/* Restante */}
            <Row className="gx-card mx-0">
              <Col xs={6} md={6} className="py-2 text-end text-900">
                Restante:
              </Col>
              <Col
                xs={6}
                md={6}
                className="text-end py-2 text-nowrap px-x1"
                style={{ color: totalRest != 0 ? 'red' : 'black' }}
              >
                {new Intl.NumberFormat('es-ES').format(totalRest)}
              </Col>
            </Row>
          </Col>
          <Col>
            {/* Teclado numérico */}
            <Table bordered>
              <tbody>
                {buttonsPago.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((label, colIndex) => (
                      <td key={colIndex} className="p-1">
                        <Button
                          variant="light"
                          className="fixed-width-button"
                          style={{ height: '70px' }}
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
        <Button
          variant="primary"
          onClick={sendRequest}
          disabled={totalRest != 0} // Deshabilitar el botón si hay monto restante
        >
          Facturar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;
