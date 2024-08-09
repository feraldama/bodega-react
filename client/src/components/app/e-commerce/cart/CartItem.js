import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Form } from 'react-bootstrap';
import useProductHook from '../product/useProductHook';
import { ProductContext } from 'context/Context';
import QuantityController from '../QuantityController';
import { Buffer } from 'buffer';

const CartItem = ({ product }) => {
  const {
    id,
    files,
    name,
    quantity,
    totalPrice,
    price,
    salePrice,
    ProductoImagen
  } = product;
  const [useSalePrice, setUseSalePrice] = useState(false);

  const formattedPrice = new Intl.NumberFormat('es-ES').format(
    useSalePrice ? price : salePrice
  );
  const formattedTotalPrice = new Intl.NumberFormat('es-ES').format(
    useSalePrice ? price * quantity : salePrice * quantity
  );

  const { handleAddToCart } = useProductHook(product);

  const {
    productsState: { selectedProductId },
    productsDispatch
  } = useContext(ProductContext);

  const quantityInputRef = useRef(null);

  const handleRemove = () => {
    productsDispatch({
      type: 'REMOVE_FROM_CART',
      payload: { product }
    });
  };

  const handleIncrease = () => {
    handleAddToCart(
      parseInt(quantity + 1),
      useSalePrice ? price : salePrice,
      useSalePrice ? 'C' : 'U'
    );
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      handleAddToCart(
        parseInt(quantity - 1),
        useSalePrice ? price : salePrice,
        useSalePrice ? 'C' : 'U'
      );
    }
  };

  const handleChange = e => {
    handleAddToCart(
      parseInt(e.target.value < 1 ? 0 : e.target.value),
      useSalePrice ? price : salePrice,
      useSalePrice ? 'C' : 'U'
    );
  };

  const handleChangeSalePrice = () => {
    handleAddToCart(
      parseInt(quantity),
      useSalePrice ? price : salePrice,
      useSalePrice ? 'C' : 'U'
    );
  };

  const productoSeleccionado = e => {
    if (quantityInputRef.current) {
      quantityInputRef.current.focus();
      quantityInputRef.current.select();
    }
    productsDispatch({
      type: 'UPDATE_SELECTED_PRODID',
      payload: { id }
    });
  };

  const handleCheckboxChange = () => {
    setUseSalePrice(!useSalePrice);
  };

  useEffect(() => {
    handleChangeSalePrice();
  }, [useSalePrice]);

  useEffect(() => {
    if (quantityInputRef.current) {
      quantityInputRef.current.focus();
      quantityInputRef.current.select();
    }
  }, []);

  return (
    <Row
      className={`gx-card mx-0 align-items-center border-bottom border-200 ${
        id == selectedProductId ? 'bg-light' : ''
      }`}
      onClick={productoSeleccionado}
    >
      <Col xs={5} className="py-3">
        <div className="d-flex align-items-center">
          <img
            src={
              ProductoImagen && ProductoImagen.length > 1
                ? `data:image/jpeg;base64,${Buffer.from(
                    ProductoImagen
                  ).toString('base64')}`
                : files[0].src
            }
            width="60"
            alt={name}
            className="img-fluid rounded-1 me-3 d-none d-md-block"
          />

          <div className="flex-1">
            <h5 className="fs-9">{name}</h5>
            <div className="fs-11 fs-md-10">
              <Button
                variant="link"
                size="sm"
                className="text-danger fs-11 fs-md-10 p-0"
                onClick={() => handleRemove(id)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      </Col>
      <Col xs={7} className="py-3">
        <Row className="align-items-center">
          <Col
            md={{ span: 4, order: 0 }}
            xs={{ order: 1 }}
            className="d-flex justify-content-end justify-content-md-center"
          >
            <div>
              <QuantityController
                ref={quantityInputRef}
                quantity={quantity}
                handleChange={handleChange}
                handleIncrease={handleIncrease}
                handleDecrease={handleDecrease}
                btnClassName="px-2"
              />
              <Col
                md={{ span: 4, order: 1 }}
                xs={{ order: 0 }}
                className="d-flex justify-content-end align-items-center"
              >
                <Form.Check
                  type="checkbox"
                  label="Caja"
                  checked={useSalePrice}
                  onChange={handleCheckboxChange}
                  style={{ marginBottom: 0 }}
                />
              </Col>
            </div>
          </Col>
          <Col
            md={{ span: 4, order: 1 }}
            xs={{ order: 0 }}
            className="d-none d-md-block text-end ps-0 mb-2 mb-md-0 text-600"
          >
            Gs. {formattedPrice}
          </Col>
          <Col
            md={{ span: 4, order: 2 }}
            xs={{ order: 0 }}
            className="text-end ps-0 mb-2 mb-md-0 text-600"
          >
            Gs. {formattedTotalPrice}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

CartItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    files: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    totalPrice: PropTypes.number.isRequired
  })
};

export default CartItem;
