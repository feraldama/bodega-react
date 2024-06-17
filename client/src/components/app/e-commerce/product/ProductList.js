import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProductContext } from 'context/Context';
import useProductHook from './useProductHook';
import ProductImage from './ProductImage';
import Flex from 'components/common/Flex';

const ProductList = ({ product, index, searchInputRef }) => {
  const {
    name,
    category,
    id,
    features,
    price,
    discount,
    salePrice,
    isNew,
    files,
    ProductoStock,
    ProductoImagen,
    ProductoStockUnitario
  } = product;

  const { productsDispatch } = useContext(ProductContext);

  const { handleAddToCart, handleFavouriteClick } = useProductHook(product);

  const handleAddToCartAndFocus = () => {
    handleAddToCart(0, true, true);
    productsDispatch({
      type: 'UPDATE_SELECTED_PRODID',
      payload: { id }
    });
    // if (searchInputRef.current) {
    //   searchInputRef.current.focus();
    //   searchInputRef.current.select();
    // }
  };

  return (
    <>
      <Col
        xs={12}
        className={classNames('p-x1', {
          'bg-100': index % 2 !== 0
        })}
        onClick={() => handleAddToCartAndFocus()}
      >
        <Row>
          <Col sm={5} md={4}>
            <ProductImage
              name={name}
              id={id}
              isNew={isNew}
              files={files}
              layout="list"
              productoImagen={ProductoImagen}
            />
          </Col>
          <Col sm={7} md={8}>
            <Row className="h-100">
              <Col lg={8}>
                <h5 className="mt-3 mt-sm-0">{name}</h5>
                <p className="fs-10 mb-2 mb-md-3">
                  <Link to="#!" className="text-500">
                    {category}
                  </Link>
                </p>
                <ul className="list-unstyled d-none d-lg-block">
                  {features.map(feature => (
                    <li key={feature}>
                      <FontAwesomeIcon icon="circle" transform="shrink-12" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Col>
              <Col lg={4} as={Flex} justifyContent="between" direction="column">
                <div>
                  <h4 className="fs-8 fs-md-7 text-warning mb-0">
                    {`Gs. ${salePrice ? salePrice : price}`}
                  </h4>
                  {salePrice && (
                    <h5 className="fs-10 text-500 mb-0 mt-1">
                      <del>{`Gs. ${price}`}</del>
                      <span className="ms-2">-{discount}%</span>
                    </h5>
                  )}

                  <div className="d-none d-lg-block">
                    <p className="fs-10 mb-1">
                      Stock:{' '}
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
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </>
  );
};

ProductList.propTypes = {
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
  }),
  index: PropTypes.number
};

export default ProductList;
