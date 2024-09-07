import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Card,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
  Button,
  InputGroup
} from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import ProductList from './ProductList';
import ProductGrid from './ProductGrid';
import { ProductContext, CustomerContext } from 'context/Context';
import usePagination from 'hooks/usePagination';
import ShoppingCart from 'components/app/e-commerce/cart/ShoppingCart';
import Flex from 'components/common/Flex';
import NumericKeypad from '../NumericKeypad/NumericKeypad';
import CustomerModal from '../customers/CustomerModal';
import PaymentModal from '../checkout/PaymentModal';
import { getSubtotal } from 'helpers/utils';
import axios from 'axios';
import { js2xml } from 'xml-js';
import Swal from 'sweetalert2';

const Products = () => {
  const {
    productsState: { products, selectedProductId, cartItems, productsCombos },
    productsDispatch
  } = useContext(ProductContext);

  const {
    customersState: { customers, selectedCustomer },
    customersDispatch
  } = useContext(CustomerContext);

  const [sortBy, setSortBy] = useState('id');
  const [isAsc, setIsAsc] = useState(true);
  const [productPerPage, setProductPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [totalRest, setTotalRest] = useState(0);
  const [ventaTipo, setVentaTipo] = useState('CO');
  const [pagoTipo, setPagoTipo] = useState('E');
  const [showModal, setShowModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [cliente, setCliente] = useState(
    selectedCustomer.ClienteNombre + ' ' + selectedCustomer.ClienteApellido
  );
  const [efectivo, setEfectivo] = useState(0);
  const [banco, setBanco] = useState(0);
  const [cuentaCliente, setCuentaCliente] = useState(0);

  const { productLayout } = useParams();
  const layout = productLayout.split(/-/)[1];
  const isList = layout === 'list';
  const isGrid = layout === 'grid';

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    paginationState: {
      data: paginatedProducts,
      totalItems,
      itemsPerPage,
      from,
      to
    },
    setItemsPerPage
  } = usePagination(filteredProducts, productPerPage);

  const searchinputref = useRef(null);

  useEffect(() => {
    productsDispatch({
      type: 'SORT_PRODUCT',
      payload: {
        sortBy,
        order: isAsc ? 'asc' : 'desc'
      }
    });
  }, [sortBy, isAsc]);

  const navigate = useNavigate();

  useEffect(() => {
    isList || isGrid || navigate('/errors/404');
  }, [isList, isGrid, navigate]);

  useEffect(() => {
    if (searchinputref.current) {
      searchinputref.current.focus();
    }
  }, []);

  const handleFocus = () => {
    if (searchinputref.current) {
      searchinputref.current.select();
    }
  };

  const handleNumberClick = number => {
    if (selectedProductId !== null) {
      // const cartProduct = cartItems.find(item => item.id === selectedProductId);
      const cartProduct = cartItems[selectedProductId];
      const comboProduct = productsCombos.find(
        item => item.ProductoId === cartProduct.id
      );
      const precioCombo = () => {
        // Verificar si ComboPrecio está definido
        return !!comboProduct?.ComboPrecio;
      };
      const comboExist = precioCombo();
      // Calcular la nueva cantidad total en el carrito después de agregar uno más
      const newQuantity =
        cartProduct.quantity == 0 ? number : `${cartProduct.quantity}${number}`;
      if (
        comboProduct?.ComboCantidad <= newQuantity &&
        cartProduct.unidad == 'U'
      ) {
        // Calcular cuántos combos completos se pueden formar
        const numCombos = Math.floor(newQuantity / comboProduct.ComboCantidad);
        const remainingItems = newQuantity % comboProduct.ComboCantidad;

        // Calcular el precio total
        const totalPrice =
          numCombos * comboProduct.ComboPrecio +
          remainingItems *
            (cartProduct.unidad === 'U'
              ? cartProduct.salePrice
              : cartProduct.price);

        productsDispatch({
          type: 'UPDATE_CART_ITEM',
          payload: {
            product: {
              ...cartProduct,
              quantity: newQuantity,
              totalPrice:
                cartProduct.unidad === 'U'
                  ? totalPrice
                  : (cartProduct.quantity + 1) * cartProduct.price,
              unidad: cartProduct.unidad,
              combo: comboExist && comboProduct
            },
            quantity: newQuantity,
            index: selectedProductId
          }
        });
      } else {
        productsDispatch({
          type: 'UPDATE_CART_ITEM',
          payload: {
            product: {
              ...cartProduct,
              // quantity: cartProduct.quantity + 1,
              quantity: newQuantity,
              totalPrice:
                cartProduct.unidad == 'U'
                  ? newQuantity * cartProduct.salePrice
                  : newQuantity * cartProduct.price, //product.price,
              unidad: cartProduct.unidad
            },
            quantity:
              cartProduct.quantity == 0
                ? number
                : `${cartProduct.quantity}${number}`,
            index: selectedProductId
          }
        });
      }
    }
  };

  useEffect(() => {
    setTotalRest(getSubtotal(cartItems));
    setTotalCost(getSubtotal(cartItems));
  }, [cartItems]);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const handleCustomerModalShow = () => setShowCustomerModal(true);
  const handleCustomerModalClose = () => setShowCustomerModal(false);

  const sendRequest = async () => {
    const fecha = new Date();
    let dia = fecha.getDate();
    let mes = fecha.getMonth() + 1;
    let año = fecha.getFullYear() % 100;
    if (dia < 10) dia = '0' + dia;
    if (mes < 10) mes = '0' + mes;
    if (año < 10) año = '0' + año;
    const fechaFormateada = `${dia}/${mes}/${año}`;
    const SDTProductoItem = cartItems.map(producto => ({
      ClienteId: selectedCustomer.ClienteId,
      Producto: {
        ProductoId: producto.id,
        VentaProductoCantidad: producto.quantity,
        ProductoPrecioVenta:
          producto.unidad == 'U' ? producto.salePrice : producto.price,
        ProductoUnidad: producto.unidad,
        VentaProductoPrecioTotal: producto.totalPrice,
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
            Clientetipo: selectedCustomer.ClienteTipo,
            Cajaid: 1,
            Usuarioid: 'vendedor',
            Efectivo: 50000,
            Total2: getSubtotal(cartItems),
            Ventatipo: ventaTipo,
            Pagotipo: 'E',
            Clienteid: selectedCustomer.ClienteId,
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
          process.env.REACT_APP_URL_GENEXUS +
          'apventaconfirmarws',
        xml,
        config
      );
      let timerInterval;
      Swal.fire({
        title: 'Venta realizada con éxito!',
        html: 'Nueva venta en <b></b> segundos.',
        timer: 3000,
        timerProgressBar: true,
        width: '90%',
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
    <Row className="mt-3">
      <Col lg={5}>
        <Card
          className="mb-3"
          style={{
            position: 'sticky',
            top: '85px',
            maxHeight: 'calc(100vh - 438px )',
            overflowY: 'auto'
          }}
        >
          <ShoppingCart handleShow={handleShow} />
        </Card>
        <Card
          style={{
            position: 'sticky',
            top: 'calc(100vh - 337px)'
          }}
        >
          <NumericKeypad
            onNumberClick={handleNumberClick}
            handleShow={handleShow}
            cliente={cliente}
            handleCustomerModalShow={handleCustomerModalShow}
          />
        </Card>
      </Col>
      <Col lg={7}>
        <Card className="mb-3">
          <Card.Body>
            <Row className="flex-between-center g-2">
              <Col
                sm="auto"
                as={Flex}
                alignItems="center"
                className="mb-2 mb-sm-0"
              >
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Buscar productos"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ maxWidth: '12.5rem' }}
                  ref={searchinputref}
                  onFocus={handleFocus}
                />
                <Form.Select
                  size="sm"
                  value={itemsPerPage}
                  onChange={({ target }) => {
                    setItemsPerPage(target.value);
                    setProductPerPage(target.value);
                  }}
                  style={{ maxWidth: '4.875rem', marginLeft: '1rem' }}
                >
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={20}>20</option>
                  <option value={totalItems}>All</option>
                </Form.Select>
                <h6 className="mb-0 ms-2">
                  Mostrando {from}-{to} de {totalItems} Productos
                </h6>
              </Col>
              <Col sm="auto">
                <Row className="gx-2 align-items-center">
                  <Col xs="auto">
                    <Form as={Row} className="gx-2">
                      <Col xs="auto">
                        <small>Ordenar por:</small>
                      </Col>
                      <Col xs="auto">
                        <InputGroup size="sm">
                          <Form.Select
                            className="pe-5"
                            defaultValue="price"
                            onChange={({ target }) => setSortBy(target.value)}
                          >
                            <option value="price">Precio</option>
                            <option value="rating">Rating</option>
                            <option value="review">Review</option>
                          </Form.Select>
                          <InputGroup.Text
                            as={Button}
                            variant="link"
                            className="border border-300 text-700"
                            onClick={() => setIsAsc(!isAsc)}
                          >
                            <FontAwesomeIcon
                              icon={
                                isAsc ? 'sort-amount-up' : 'sort-amount-down'
                              }
                            />
                          </InputGroup.Text>
                        </InputGroup>
                      </Col>
                    </Form>
                  </Col>
                  <Col xs="auto" className="pe-0">
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip style={{ position: 'fixed' }}>
                          Product {isList ? 'Grid' : 'List'}
                        </Tooltip>
                      }
                    >
                      <Link
                        to={`/product/product-${isList ? 'grid' : 'list'}`}
                        className="text-600 px-1"
                      >
                        <FontAwesomeIcon
                          icon={classNames({ th: isList, 'list-ul': isGrid })}
                        />
                      </Link>
                    </OverlayTrigger>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body
            className={classNames({
              'p-0 overflow-hidden': isList,
              'pb-0': isGrid
            })}
          >
            <Row
              className={classNames({
                'g-0': isList
              })}
            >
              {filteredProducts.length > 0 ? (
                <>
                  {paginatedProducts.map((product, index) =>
                    layout === 'list' ? (
                      <ProductList
                        product={product}
                        key={product.id}
                        index={index}
                      />
                    ) : (
                      <ProductGrid
                        product={product}
                        key={product.id}
                        md={5}
                        lg={3}
                        index={index}
                      />
                    )
                  )}
                </>
              ) : (
                <Col
                  xs={12}
                  className="d-flex align-items-center justify-content-center"
                  style={{ minHeight: '150px' }}
                >
                  <h5 className="text-center">Producto no existe!</h5>
                </Col>
              )}
            </Row>
          </Card.Body>
        </Card>
      </Col>

      <PaymentModal
        show={showModal}
        handleClose={handleClose}
        totalCost={totalCost}
        totalRest={totalRest}
        setTotalRest={setTotalRest}
        setPagoTipo={setPagoTipo}
        efectivo={efectivo}
        setEfectivo={setEfectivo}
        banco={banco}
        setBanco={setBanco}
        cuentaCliente={cuentaCliente}
        setCuentaCliente={setCuentaCliente}
        sendRequest={sendRequest}
      />

      <CustomerModal
        show={showCustomerModal}
        handleClose={handleCustomerModalClose}
        setCliente={setCliente}
      />
    </Row>
  );
};

export default Products;
