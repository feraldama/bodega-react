import { ProductContext } from 'context/Context';
import { useContext } from 'react';

const useProductHook = product => {
  const {
    productsState: { cartItems },
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
            quantity: addTouch ? cartProduct.quantity + 1 : quantity,
            totalPrice: quantity * price, //product.price,
            unidad: useSalePrice
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
            totalPrice: quantity * product.price
          }
        }
      });
    }
  };

  // const handleAddToCart = (quantity, price, unidadCaja, addTouch) => {
  //   console.log('log: 🚀  unidadCaja:', unidadCaja);
  //   console.log('log: 🚀  price:', price);
  //   console.log('log: 🚀  quantity:', quantity);
  //   console.log('log: 🚀  product:', product);
  //   if (isInShoppingCart(product.id)) {
  //     console.log('log: 🚀  addTouch 1:', addTouch);
  //     const cartProduct = cartItems.find(item => item.id === product.id);
  //     console.log('log: 🚀  cartProduct:', cartProduct);
  //     console.log('log: 🚀  cartItems:', cartItems);
  //     productsDispatch({
  //       type: 'UPDATE_CART_ITEM',
  //       payload: {
  //         product: {
  //           ...cartProduct,
  //           quantity: addTouch ? cartProduct.quantity + 1 : quantity,
  //           totalPrice:
  //             unidadCaja == 'U'
  //               ? quantity * product.salePrice
  //               : quantity * product.price,
  //           unidad: unidadCaja
  //         },
  //         quantity
  //       }
  //     });
  //   } else {
  //     console.log('log: 🚀  addTouch 2:', addTouch);
  //     productsDispatch({
  //       type: 'ADD_TO_CART',
  //       payload: {
  //         product: {
  //           ...product,
  //           quantity,
  //           totalPrice: quantity * product.price
  //         }
  //       }
  //     });
  //   }
  // };

  const handleFavouriteClick = () => {
    productsDispatch({
      type: isInFavouriteItems(product.id)
        ? 'REMOVE_FROM_FAVOURITES'
        : 'ADD_TO_FAVOURITES',
      payload: { product }
    });
  };
  return { handleAddToCart, handleFavouriteClick };
};

export default useProductHook;
