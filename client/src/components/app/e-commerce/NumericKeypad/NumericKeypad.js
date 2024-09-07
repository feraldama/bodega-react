import React, { useContext, useState, useEffect } from 'react';
import { Button, Table, Col, Row } from 'react-bootstrap';
import './NumericKeypad.css';
import { ProductContext } from 'context/Context';

const NumericKeypad = ({
  onNumberClick,
  handleShow,
  cliente,
  handleCustomerModalShow
}) => {
  const {
    productsState: { selectedProductId, cartItems },
    productsDispatch
  } = useContext(ProductContext);

  const buttons = [
    [1, 2, 3, 'Cant.'],
    [4, 5, 6, '% de desc.'],
    [7, 8, 9, 'Precio'],
    ['.', 0, ',', 'Borrar']
  ];

  const cerarCantidad = () => {
    if (selectedProductId !== null) {
      // const cartProduct = cartItems.find(item => item.id === selectedProductId);
      const cartProduct = cartItems[selectedProductId];
      productsDispatch({
        type: 'UPDATE_CART_ITEM',
        payload: {
          product: {
            ...cartProduct,
            quantity: 0,
            totalPrice: 0, //product.price,
            unidad: cartProduct.unidad
          },
          quantity: 0,
          index: selectedProductId
        }
      });
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
              {`Gs. ${new Intl.NumberFormat('es-ES').format(
                cartItems.reduce((sum, item) => sum + item.totalPrice, 0)
              )}`}
            </Col>
          </Row>
        </Col>
      </Row>
      <Table bordered className="mb-0 numeric-keypad">
        <tbody>
          {buttons.map((row, rowIndex) => (
            <tr key={rowIndex}>
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
                          handleCustomerModalShow();
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
                onClick={handleCustomerModalShow}
              >
                {cliente}
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default NumericKeypad;
