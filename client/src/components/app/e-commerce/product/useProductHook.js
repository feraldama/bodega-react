import { ProductContext } from 'context/Context';
import { useContext } from 'react';

const useProductHook = product => {
  const {
    productsState: { cartItems, productsCombos },
    productsDispatch,
    isInShoppingCart,
    isInFavouriteItems
  } = useContext(ProductContext);

  const handleAddToCart = (quantity, price, useSalePrice, addTouch) => {
    if (isInShoppingCart(product.id)) {
      const cartProduct = cartItems.find(item => item.id === product.id);
      productsDispatch({
        type: 'UPDATE_CART_ITEM',
        payload: {
          product: {
            ...cartProduct,
            quantity: quantity,
            totalPrice: quantity * price, //product.price,
            unidad: useSalePrice
          },
          quantity
        }
      });
      //ESTE ELSE NO SE USA, por eso hice handleAddToCartTouch
    } else {
      productsDispatch({
        type: 'ADD_TO_CART',
        payload: {
          product: {
            ...product,
            quantity,
            totalPrice: quantity * product.price
          }
        }
      });
    }
  };

  const handleAddToCartTouch = quantity => {
    if (isInShoppingCart(product.id)) {
      const cartProduct = cartItems.find(item => item.id === product.id);
      productsDispatch({
        type: 'UPDATE_CART_ITEM',
        payload: {
          product: {
            ...cartProduct,
            quantity: cartProduct.quantity + 1,
            totalPrice:
              cartProduct.unidad == 'U'
                ? (cartProduct.quantity + 1) * product.salePrice
                : (cartProduct.quantity + 1) * product.price, //product.price,
            unidad: cartProduct.unidad
          },
          quantity
        }
      });
    } else {
      productsDispatch({
        type: 'ADD_TO_CART',
        payload: {
          product: {
            ...product,
            quantity,
            totalPrice: quantity * product.salePrice,
            unidad: 'U'
          }
        }
      });
    }
  };

  const handleFavouriteClick = () => {
    productsDispatch({
      type: isInFavouriteItems(product.id)
        ? 'REMOVE_FROM_FAVOURITES'
        : 'ADD_TO_FAVOURITES',
      payload: { product }
    });
  };
  return { handleAddToCart, handleFavouriteClick, handleAddToCartTouch };
};

export default useProductHook;
