import React, { useReducer, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
//import { ProductContext } from 'context/Context';
import { CustomerContext } from 'context/Context';
// import { productData } from 'data/ecommerce/productData';
import { customersData } from 'data/ecommerce/customersData';
// import { productReducer } from 'reducers/productReducer';
import { customerReducer } from 'reducers/customerReducer';
import axios from 'axios';
import product3 from 'assets/img/products/4.jpg';
import product2 from 'assets/img/products/2.jpg';

const CustomerProvider = ({ children }) => {
  const initData = {
    initCustomers: customersData,
    customers: customersData,
    selectedCustomer: customersData[0]
  };
  const [customersState, customersDispatch] = useReducer(
    customerReducer,
    initData
  );

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + '/api/clientes')
      .then(function (response) {
        customersDispatch({
          type: 'SET_CUSTOMERS',
          payload: { customers: response.data }
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <CustomerContext.Provider
      value={{
        customersState,
        customersDispatch
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

CustomerProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default CustomerProvider;
