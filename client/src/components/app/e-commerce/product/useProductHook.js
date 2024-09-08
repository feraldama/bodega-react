import { ProductContext, CustomerContext } from 'context/Context';
import { useContext } from 'react';

const useProductHook = product => {
  const {
    productsState: { cartItems, productsCombos },
    productsDispatch,
    isInShoppingCart,
    isInFavouriteItems
  } = useContext(ProductContext);

  const {
    customersState: { selectedCustomer }
  } = useContext(CustomerContext);
  // console.log('log: 🚀  selectedCustomer:', selectedCustomer);

  const handleAddToCart = (quantity, price, useSalePrice, index) => {
    const comboProduct = productsCombos.find(
      item => item.ProductoId === product.id
    );

    const precioCombo = () => {
      // Verificar si ComboPrecio está definido
      return !!comboProduct?.ComboPrecio;
    };
    const comboExist = precioCombo();

    // const cartProduct = cartItems.find(item => item.id === product.id);
    const cartProduct = cartItems[index];
    if (comboProduct?.ComboCantidad <= quantity) {
      // Calcular cuántos combos completos se pueden formar
      const numCombos = Math.floor(quantity / comboProduct.ComboCantidad);
      const remainingItems = quantity % comboProduct.ComboCantidad;

      // Calcular el precio total
      const totalPrice =
        numCombos * comboProduct.ComboPrecio +
        remainingItems *
          (useSalePrice === 'U' ? product.salePrice : product.price);

      productsDispatch({
        type: 'UPDATE_CART_ITEM',
        payload: {
          product: {
            ...cartProduct,
            quantity: quantity,
            // totalPrice:
            //   useSalePrice === 'U' ? totalPrice : quantity * product.price,
            totalPrice:
              useSalePrice == 'U'
                ? totalPrice
                : selectedCustomer.ClienteTipo == 'MI'
                ? quantity * product.price
                : quantity * product.ProductoPrecioVentaMayorista,
            unidad: useSalePrice,
            combo: comboExist && comboProduct
          },
          quantity,
          index
        }
      });
    } else {
      productsDispatch({
        type: 'UPDATE_CART_ITEM',
        payload: {
          product: {
            ...cartProduct,
            quantity: quantity,
            // totalPrice:
            //   selectedCustomer.ClienteTipo == 'MI'
            //     ? quantity * price
            //     : quantity * product.ProductoPrecioVentaMayorista, //product.price,
            totalPrice:
              useSalePrice == 'U'
                ? quantity * cartProduct.salePrice
                : selectedCustomer.ClienteTipo == 'MI'
                ? quantity * price
                : quantity * cartProduct.ProductoPrecioVentaMayorista,
            unidad: useSalePrice
          },
          quantity,
          index
        }
      });
    }
  };

  const handleAddToCartTouch = quantity => {
    const comboProduct = productsCombos.find(
      item => item.ProductoId === product.id
    );
    const precioCombo = () => {
      // Verificar si ComboPrecio está definido
      return !!comboProduct?.ComboPrecio;
    };
    const comboExist = precioCombo();
    const cartProduct = cartItems.find(item => item.id === product.id);
    // if (cartProduct) {
    //   // Si el producto ya está en el carrito

    //   // Calcular la nueva cantidad total en el carrito después de agregar uno más
    //   const newQuantity = cartProduct.quantity + 1;

    //   // Verificar si se puede aplicar el combo
    //   if (comboProduct?.ComboCantidad <= newQuantity) {
    //     // Calcular cuántos combos completos se pueden formar
    //     const numCombos = Math.floor(newQuantity / comboProduct.ComboCantidad);
    //     const remainingItems = newQuantity % comboProduct.ComboCantidad;

    //     // Calcular el precio total
    //     const totalPrice =
    //       numCombos * comboProduct.ComboPrecio +
    //       remainingItems *
    //         (cartProduct.unidad === 'U' ? product.salePrice : product.price);

    //     productsDispatch({
    //       type: 'UPDATE_CART_ITEM',
    //       payload: {
    //         product: {
    //           ...cartProduct,
    //           quantity: newQuantity,
    //           totalPrice:
    //             cartProduct.unidad === 'U'
    //               ? totalPrice
    //               : (cartProduct.quantity + 1) * product.price,
    //           unidad: cartProduct.unidad,
    //           combo: comboExist && comboProduct
    //         },
    //         quantity
    //       }
    //     });
    //   } else {
    //     // Si no se puede aplicar el combo, solo actualizar la cantidad y el precio
    //     productsDispatch({
    //       type: 'UPDATE_CART_ITEM',
    //       payload: {
    //         product: {
    //           ...cartProduct,
    //           quantity: newQuantity,
    //           totalPrice:
    //             cartProduct.unidad === 'U'
    //               ? newQuantity * product.salePrice
    //               : newQuantity * product.price,
    //           unidad: cartProduct.unidad
    //         },
    //         quantity
    //       }
    //     });
    //   }
    // } else {
    // Si el producto no está en el carrito, agregarlo
    productsDispatch({
      type: 'ADD_TO_CART',
      payload: {
        product: {
          ...product,
          quantity,
          totalPrice: quantity * product.salePrice,
          unidad: 'U',
          combo: comboExist && comboProduct
        }
      }
    });
    // }
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
