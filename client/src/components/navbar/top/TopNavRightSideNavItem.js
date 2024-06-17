import React, { useContext } from 'react';
import CartNotification from 'components/navbar/top/CartNotification';
import NotificationDropdown from 'components/navbar/top/NotificationDropdown';
import ProfileDropdown from 'components/navbar/top/ProfileDropdown';
import { Nav } from 'react-bootstrap';
import NineDotMenu from './NineDotMenu';
import ThemeControlDropdown from './ThemeControlDropdown';
import TopProducts from 'components/app/e-commerce/top-products/TopProducts';
import { ProductContext } from 'context/Context';

const TopNavRightSideNavItem = () => {
  const {
    productsState: { products },
    productsDispatch
  } = useContext(ProductContext);

  return (
    <Nav
      navbar
      className="navbar-nav-icons ms-auto flex-row align-items-center"
      as="ul"
      style={{ position: 'fixed' }}
    >
      <TopProducts products={products} productsDispatch={productsDispatch} />

      {/* <ThemeControlDropdown />
      <CartNotification />
      <NotificationDropdown />
      <NineDotMenu />
      <ProfileDropdown /> */}
    </Nav>
  );
};

export default TopNavRightSideNavItem;
