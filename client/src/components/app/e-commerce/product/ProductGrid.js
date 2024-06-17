import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Flex from 'components/common/Flex';
import { Link } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import classNames from 'classnames';
import { ProductContext } from 'context/Context';
import useProductHook from './useProductHook';
import ProductImage from './ProductImage';

const ProductGrid = ({ product, ...rest }) => {
  const {
    name,
    category,
    id,
    price,
    salePrice,
    isNew,
    files,
    ProductoStock,
    ProductoImagen,
    ProductoStockUnitario
  } = product;

  const formattedPrice = new Intl.NumberFormat('es-ES').format(price);
  const { productsDispatch } = useContext(ProductContext);

  const { handleAddToCart, handleFavouriteClick } = useProductHook(product);

  const handleAddToCartAndFocus = () => {
    handleAddToCart(0, true, true);
    productsDispatch({
      type: 'UPDATE_SELECTED_PRODID',
      payload: { id }
    });
    // if (rest.searchInputRef.current) {
    //   rest.searchInputRef.current.focus();
    //   rest.searchInputRef.current.select();
    // }
  };

  return (
    <Col className="mb-4" {...rest} onClick={() => handleAddToCartAndFocus()}>
      <Flex
        direction="column"
        justifyContent="between"
        className="border rounded-1 h-100"
      >
        <div className="overflow-hidden">
          <ProductImage
            name={name}
            id={id}
            isNew={isNew}
            files={files}
            layout="grid"
            productoImagen={ProductoImagen}
          />
          <div className="pt-1 pb-1 p-3">
            <h5 className="fs-9">{name}</h5>
            <p className="fs-10 mb-3">
              <Link to="#!" className="text-500">
                {category}
              </Link>
            </p>
            <h5 className="fs-md-7 text-warning mb-0 d-flex align-items-center mb-3">
              {`Gs. ${salePrice ? salePrice : formattedPrice}`}
              {salePrice && (
                <del className="ms-2 fs-10 text-500">Gs. {price}</del>
              )}
            </h5>

            <p className="fs-10 mb-1">
              Stock Caja:{' '}
              <strong
                className={classNames({
                  'text-success': ProductoStock > 0,
                  'text-danger': ProductoStock < 1
                })}
              >
                {ProductoStock > 0 ? ProductoStock : 'Sin Stock'}
              </strong>
            </p>
            {ProductoStockUnitario > 0 && (
              <p className="fs-10 mb-1">
                Stock Unitario:{' '}
                <strong
                  className={classNames({
                    'text-success': ProductoStockUnitario > 0,
                    'text-danger': ProductoStockUnitario < 1
                  })}
                >
                  {ProductoStockUnitario > 0
                    ? ProductoStockUnitario
                    : 'Sin Stock'}
                </strong>
              </p>
            )}
          </div>
        </div>
      </Flex>
    </Col>
  );
};

ProductGrid.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    features: PropTypes.array,
    price: PropTypes.number.isRequired,
    discount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    salePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    shippingCost: PropTypes.number,
    rating: PropTypes.number,
    totalReview: PropTypes.number,
    isInStock: PropTypes.bool,
    isNew: PropTypes.bool,
    files: PropTypes.arrayOf(PropTypes.object).isRequired
  })
};

export default ProductGrid;
