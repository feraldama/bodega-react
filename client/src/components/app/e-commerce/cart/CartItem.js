import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Form } from 'react-bootstrap';
import useProductHook from '../product/useProductHook';
import { ProductContext, CustomerContext } from 'context/Context';
import QuantityController from '../QuantityController';
import { Buffer } from 'buffer';

const CartItem = ({ product, index }) => {
  const { id, files, name, quantity, price, salePrice, ProductoImagen, combo } =
    product;

  const {
    productsState: { selectedProductId },
    productsDispatch
  } = useContext(ProductContext);

  const {
    customersState: { selectedCustomer }
  } = useContext(CustomerContext);

  const [useSalePrice, setUseSalePrice] = useState(false);
  const [editablePrice, setEditablePrice] = useState(salePrice);
  const [isEditingPrice, setIsEditingPrice] = useState(false);

  // Efecto para actualizar el precio editable cuando cambia salePrice
  useEffect(() => {
    setEditablePrice(salePrice);
  }, [salePrice]);

  const formattedPrice = new Intl.NumberFormat('es-ES').format(
    id === 1 || id === 2
      ? editablePrice
      : useSalePrice
      ? selectedCustomer?.ClienteTipo == 'MI'
        ? price
        : product.ProductoPrecioVentaMayorista
      : salePrice
  );

  const calculateTotalPrice = () => {
    // Precio base que usaremos para los cálculos
    const basePrice =
      id === 1 || id === 2
        ? editablePrice
        : useSalePrice
        ? selectedCustomer?.ClienteTipo == 'MI'
          ? price
          : product.ProductoPrecioVentaMayorista
        : salePrice;

    if (combo && quantity >= combo.ComboCantidad) {
      const numCombos = Math.floor(quantity / combo.ComboCantidad);
      const remainingItems = quantity % combo.ComboCantidad;
      const comboTotalPrice = numCombos * combo.ComboPrecio;
      const remainingTotalPrice = remainingItems * basePrice;

      return useSalePrice && id !== 1
        ? quantity * price
        : comboTotalPrice + remainingTotalPrice;
    } else {
      return quantity * basePrice;
    }
  };

  const formattedTotalPrice = new Intl.NumberFormat('es-ES').format(
    calculateTotalPrice()
  );

  const { handleAddToCart } = useProductHook(product);

  const quantityInputRef = useRef(null);
  const priceInputRef = useRef(null);

  const handleRemove = () => {
    productsDispatch({
      type: 'REMOVE_FROM_CART',
      payload: { product, index }
    });
  };

  const handleIncrease = () => {
    if (id !== 1 && id !== 2) {
      handleAddToCart(
        parseInt(quantity + 1),
        useSalePrice ? price : editablePrice,
        useSalePrice ? 'C' : 'U',
        index
      );
    }
  };

  const handleDecrease = () => {
    if (quantity > 0 && id !== 1 && id !== 2) {
      handleAddToCart(
        parseInt(quantity - 1),
        useSalePrice ? price : editablePrice,
        useSalePrice ? 'C' : 'U',
        index
      );
    }
  };

  const handleChange = e => {
    if (id !== 1 && id !== 2) {
      handleAddToCart(
        parseInt(e.target.value < 1 ? 0 : e.target.value),
        useSalePrice ? price : editablePrice,
        useSalePrice ? 'C' : 'U',
        index
      );
    }
  };

  const handleChangeSalePrice = () => {
    handleAddToCart(
      parseInt(quantity),
      useSalePrice ? price : editablePrice,
      useSalePrice ? 'C' : 'U',
      index
    );
  };

  const handlePriceChange = e => {
    const newPrice = parseFloat(e.target.value) || 0;
    setEditablePrice(newPrice);
    // Actualiza el totalPrice inmediatamente
    productsDispatch({
      type: 'UPDATE_CART_ITEM',
      payload: {
        product: {
          ...product,
          salePrice: newPrice,
          totalPrice: quantity * newPrice
        },
        quantity: quantity,
        index: index
      }
    });
  };

  const handlePriceBlur = () => {
    setIsEditingPrice(false);
    // Actualiza el producto en el carrito con el nuevo precio
    productsDispatch({
      type: 'UPDATE_CART_ITEM',
      payload: {
        product: {
          ...product,
          salePrice: editablePrice,
          totalPrice: quantity * editablePrice
        },
        quantity: quantity,
        index: index
      }
    });
  };

  const productoSeleccionado = () => {
    if (quantityInputRef.current) {
      quantityInputRef.current.focus();
      quantityInputRef.current.select();
    }
    productsDispatch({
      type: 'UPDATE_SELECTED_PRODID',
      payload: { index }
    });
  };

  const handleCheckboxChange = () => {
    if (id !== 1 && id !== 2) {
      const newUseSalePrice = !useSalePrice;
      setUseSalePrice(newUseSalePrice);

      const basePrice = newUseSalePrice
        ? selectedCustomer?.ClienteTipo == 'MI'
          ? price
          : product.ProductoPrecioVentaMayorista
        : salePrice;

      productsDispatch({
        type: 'UPDATE_CART_ITEM',
        payload: {
          product: {
            ...product,
            salePrice: basePrice,
            totalPrice: quantity * basePrice,
            unidad: newUseSalePrice ? 'C' : 'U'
          },
          quantity: quantity,
          index: index
        }
      });
    }
  };

  const handlePriceClick = () => {
    if (id === 1 || id === 2) {
      setIsEditingPrice(true);
      setTimeout(() => {
        if (priceInputRef.current) {
          priceInputRef.current.focus();
          priceInputRef.current.select();
        }
      }, 0);
    }
  };

  useEffect(() => {
    handleChangeSalePrice();
  }, [useSalePrice]);

  useEffect(() => {
    if (quantityInputRef.current && id !== 1 && id !== 2) {
      quantityInputRef.current.focus();
      quantityInputRef.current.select();
    }
  }, []);

  return (
    <Row
      className={`gx-card mx-0 align-items-center border-bottom border-200 ${
        index == selectedProductId ? 'bg-light' : ''
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
              {id !== 1 && id !== 2 && (
                <>
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
                      style={{
                        paddingTop: '16px',
                        marginBottom: 0,
                        transform: 'scale(1.5)',
                        marginLeft: 'auto'
                      }}
                    />
                  </Col>
                </>
              )}
            </div>
          </Col>
          <Col
            md={{ span: 4, order: 1 }}
            xs={{ order: 0 }}
            className="d-none d-md-block text-end ps-0 mb-2 mb-md-0 text-600"
            onClick={handlePriceClick}
          >
            {(id === 1 || id === 2) && isEditingPrice ? (
              <Form.Control
                ref={priceInputRef}
                type="number"
                value={editablePrice}
                onChange={handlePriceChange}
                onBlur={handlePriceBlur}
                onKeyPress={e => e.key === 'Enter' && handlePriceBlur()}
                className="text-end"
                style={{ width: '100px', display: 'inline-block' }}
              />
            ) : (
              `Gs. ${formattedPrice}`
            )}
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
    price: PropTypes.number.isRequired,
    salePrice: PropTypes.number.isRequired,
    ProductoImagen: PropTypes.array.isRequired,
    ProductoPrecioVentaMayorista: PropTypes.number.isRequired,
    combo: PropTypes.object
  }),
  index: PropTypes.number.isRequired
};

export default CartItem;
