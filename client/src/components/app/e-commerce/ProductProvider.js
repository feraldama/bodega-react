import React, { useReducer, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ProductContext } from 'context/Context';
import { productData } from 'data/ecommerce/productData';
import { productReducer } from 'reducers/productReducer';
import axios from 'axios';
import product3 from 'assets/img/products/4.jpg';
import product2 from 'assets/img/products/2.jpg';

const ProductProvider = ({ children }) => {
  const initData = {
    initProducts: productData,
    products: productData,
    cartItems: [
      // {
      //   ...productosBD[0],
      //   quantity: 3,
      //   totalPrice: productosBD[0].price * 3
      // },
      // {
      //   ...productosBD[1],
      //   quantity: 3,
      //   totalPrice: productosBD[1].price * 3
      // },
      // { ...productosBD[2], quantity: 3, totalPrice: productosBD[2].price * 3 }
    ],
    promo: null,
    favouriteItems: [],
    cartModal: {
      show: false,
      product: {},
      quantity: 0,
      type: 'add'
    }
  };
  const [productsState, productsDispatch] = useReducer(
    productReducer,
    initData
  );

  const isInShoppingCart = id =>
    !!productsState.cartItems.find(cartItem => cartItem.id === id);
  const isInFavouriteItems = id =>
    !!productsState.favouriteItems.find(
      favouriteItem => favouriteItem.id === id
    );

  useEffect(() => {
    const additionalData = {
      features: [
        '3GB RAM',
        '128GB ROM',
        'Apple A12 Bionic (7 nm)',
        'iOS 12.1.3'
      ],
      discount: 25,
      shippingCost: 47,
      rating: 2.5,
      totalReview: 14,
      favorite: 282,
      isInStock: true,
      isNew: false,
      tags: ['Computer', 'Mac Book', 'Mac Book Pro', 'Laptop'],
      shortDescription:
        'Testing conducted by Apple in October 2018 using pre-production 2.9GHz 6‑core Intel Core i9‑based 15-inch MacBook Pro systems with Radeon Pro Vega 20 graphics, and shipping 2.9GHz 6‑core Intel Core i9‑based 15‑inch MacBook Pro systems with Radeon Pro 560X graphics, both configured with 32GB of RAM and 4TB SSD.',
      desc: `<p>Over the years, Apple has built a reputation for releasing its products with a lot of fanfare – but that didn’t exactly happen for the MacBook Pro 2018. Rather, Apple’s latest pro laptop experienced a subdued launch, in spite of it offering a notable spec upgrade over the 2017 model – along with an improved idboard. And, as with previous generations the 15-inch MacBook Pro arrives alongside a 13-inch model.</p>
              <p>Apple still loves the MacBook Pro though, despite the quiet release. This is because, while the iPhone XS and iPad, along with the 12-inch MacBook, are aimed at everyday consumers, the MacBook Pro has always aimed at the creative and professional audience. This new MacBook Pro brings a level of performance (and price) unlike its more consumer-oriented devices.</p>
              <p>Still, Apple wants mainstream users to buy the MacBook Pro, too. So, if you’re just looking for the most powerful MacBook on the market, you’ll love this new MacBook Pro. Just keep in mind that, while the idboard has been updated, there are still some issues with it.</p>
              <p>There’s enough of a difference between the two sizes when it comes to performance to warrant two separate reviews, and here we’ll be looking at how the flagship 15-inch MacBook Pro performs in 2019.</p>
              <p>It's build quality and design is batter than elit. Numquam excepturi a debitis, sint voluptates, nam odit vel delectus id repellendus vero reprehenderit quidem totam praesentium vitae nesciunt deserunt. Sint, veniam?</p>`,
      specification: {
        Processor: '2.3GHz quad-core Intel Core i5',
        Memory: '8GB of 2133MHz LPDDR3 onboard memory',
        'Brand Name': 'Apple',
        Model: 'Mac Book Pro',
        Display: '13.3-inch (diagonal) LED-backlit display with IPS technology',
        Storage: '512GB SSD',
        Graphics: 'Intel Iris Plus Graphics 655',
        Weight: '7.15 pounds',
        Finish: 'Silver, Space Gray'
      },
      reviews: [
        {
          id: 1,
          title: 'Awesome support, great code 😍',
          rating: 5,
          author: 'Drik Smith',
          date: 'October 14, 2019',
          text: "You shouldn't need to read a review to see how nice and polished this theme is. So I'll tell you something you won't find in the demo. After the download I had a technical question, emailed the team and got a response right from the team CEO with helpful advice."
        },
        {
          id: 2,
          title: 'Outstanding Design, Awesome Support',
          rating: 4.5,
          author: 'Liane',
          date: 'December 14, 2019',
          text: 'This really is an amazing template - from the style to the font - clean layout. SO worth the money! The demo pages show off what Bootstrap 4 can impressively do. Great template!! Support response is FAST and the team is amazing - communication is important.'
        }
      ],
      files: [{ id: 1, src: product3 }]
    };

    axios
      .get(process.env.REACT_APP_API_URL + '/api/productos')
      .then(function (response) {
        const updatedProducts = response.data.map(product => ({
          ...product,
          ...additionalData,
          ProductoImagen: product.ProductoImagen.data
        }));
        productsDispatch({
          type: 'SET_PRODUCTS',
          payload: { products: updatedProducts }
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <ProductContext.Provider
      value={{
        productsState,
        productsDispatch,
        isInShoppingCart,
        isInFavouriteItems
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

ProductProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProductProvider;
