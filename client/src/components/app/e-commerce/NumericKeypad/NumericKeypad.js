import React, { useContext } from 'react';
import { Button, Table } from 'react-bootstrap';
import './NumericKeypad.css';
import { ProductContext } from 'context/Context';

const NumericKeypad = ({ onNumberClick }) => {
  const buttons = [
    [1, 2, 3, 'Cant.'],
    [4, 5, 6, '% de desc.'],
    [7, 8, 9, 'Precio'],
    ['.', 0, ',', 'Borrar']
  ];

  const {
    productsState: { selectedProductId, cartItems },
    productsDispatch
  } = useContext(ProductContext);

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

  return (
    <Table bordered className="numeric-keypad">
      <tbody>
        {buttons.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((label, colIndex) => (
              <td key={colIndex} className="p-1">
                <Button
                  variant="light"
                  className="w-100 h-100"
                  onClick={() => {
                    if (typeof label === 'number') {
                      onNumberClick(label);
                    } else {
                      if (label === 'Cant.') {
                        console.log('log: 🚀  Cant:');
                      } else if (label === '% de desc.') {
                        console.log('log: 🚀  desc:');
                      } else if (label === 'Precio') {
                        console.log('log: 🚀  Precio:');
                      } else if (label === '+/-') {
                        console.log('log: 🚀  +/-:');
                      } else if (label === ',') {
                        console.log('log: 🚀  ,');
                      } else if (label === 'Borrar') {
                        cerarCantidad();
                      }
                    }
                  }}
                  // disabled={label === ''}
                >
                  {label}
                </Button>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default NumericKeypad;
