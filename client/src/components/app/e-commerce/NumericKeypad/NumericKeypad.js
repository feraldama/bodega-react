import React, { useContext, useState, useEffect } from 'react';
import {
  Button,
  Table,
  Card,
  Col,
  Form,
  Row,
  InputGroup
} from 'react-bootstrap';
import './NumericKeypad.css';
import { ProductContext } from 'context/Context';
import { getSubtotal } from 'helpers/utils';
import axios from 'axios';
import { js2xml } from 'xml-js';
import Swal from 'sweetalert2';

const NumericKeypad = ({ onNumberClick }) => {
  const [totalCost, setTotalCost] = useState(0);
  const [ventaTipo, setVentaTipo] = useState('CO');
  const [pagoTipo, setPagoTipo] = useState('E');

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

  useEffect(() => {
    const formattedTotalCost = new Intl.NumberFormat('es-ES').format(
      getSubtotal(cartItems)
    );
    setTotalCost(formattedTotalCost);
  }, [cartItems]);

  const sendRequest = async () => {
    const fecha = new Date();
    // Obtenemos día, mes y año
    let dia = fecha.getDate();
    let mes = fecha.getMonth() + 1; // Los meses van de 0 a 11, por eso sumamos 1
    let año = fecha.getFullYear() % 100; // Obtenemos los últimos dos dígitos del año
    // Formateamos los valores para asegurar que tengan dos dígitos
    if (dia < 10) {
      dia = '0' + dia; // Agregamos un cero adelante si el día es menor que 10
    }
    if (mes < 10) {
      mes = '0' + mes; // Agregamos un cero adelante si el mes es menor que 10
    }
    if (año < 10) {
      año = '0' + año; // Esto podría no ser necesario dependiendo del año actual
    }
    // Concatenamos los valores en el formato deseado
    const fechaFormateada = `${dia}/${mes}/${año}`;

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
            const secondsLeft = Math.ceil(Swal.getTimerLeft() / 1000); // Convertir a segundos y redondear hacia arriba
            timer.textContent = `${secondsLeft}`;
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
      }).then(result => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          window.location.reload();
        }
      });

      // Swal.fire({
      //   title: 'Venta realizada con éxito!',
      //   showDenyButton: false,
      //   showCancelButton: false,
      //   confirmButtonText: 'Guardar',
      //   denyButtonText: `Don't save`,
      //   width: 600,
      //   padding: '3em',
      //   color: '#716add',
      //   background: '#fff url(/images/trees.png)',
      //   backdrop: `
      //     rgba(0,0,123,0.4)
      //     url("/images/nyan-cat.gif")
      //     left top
      //     no-repeat
      //   `
      // }).then(result => {
      //   /* Read more about isConfirmed, isDenied below */
      //   if (result.isConfirmed) {
      //     window.location.reload();
      //   } else if (result.isDenied) {
      //     Swal.fire('Changes are not saved', '', 'info');
      //   }
      // });

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
              Gs. {totalCost}
            </Col>
          </Row>
        </Col>
      </Row>
      <Table bordered className="mb-0 numeric-keypad">
        <tbody>
          {buttons.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {rowIndex === 0 && (
                <td rowSpan="1" className="p-1">
                  <Button
                    variant="light"
                    className="w-100 h-100"
                    onClick={() => {
                      console.log('log: 🚀 Cliente:');
                    }}
                  >
                    Cliente
                  </Button>
                </td>
              )}
              {rowIndex === 1 && (
                <td rowSpan="3" className="p-1">
                  <Button
                    variant="primary"
                    className="w-100 pago-button"
                    onClick={sendRequest}
                  >
                    Pago
                  </Button>
                </td>
              )}
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
        </tbody>
      </Table>
    </>
  );
};

export default NumericKeypad;
