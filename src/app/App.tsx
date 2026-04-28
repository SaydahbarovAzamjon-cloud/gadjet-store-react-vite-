import React, { useState } from "react";
import { Route, useLocation } from "react-router-dom";
import HomePage from "./screens/homePage";
import ProductsPage from "./screens/productsPage";
import OrdersPage from "./screens/ordersPage";
import UsersPage from "./screens/userPage";
import HelpPage from "./screens/helpPage";
import HomeNavbar from './components/headers/HomeNavbar';
import OtherNavbar from "./components/headers/OtherNavbar";
import Footer from "./components/footer";
import AuthenticationModal from "./components/auth";
import useBasket from "./hooks/useBasket";
import { useGlobals } from "./hooks/useGlobals";
import "../css/app.css";

function App() {
  const location = useLocation();
  const { setAuthMember } = useGlobals();
  const { cartItems, onAdd, onDeleteAll, onDelete, onRemove } = useBasket();
  const [signupOpen, setSignupOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleSignupClose = () => setSignupOpen(false);
  const handleLoginClose = () => setLoginOpen(false);

  const handlerLogoutClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handlerCloseLogout = () => setAnchorEl(null);

  const handlerLogoutRequest = async () => {
    try {
      setAuthMember(null);
    } catch (err) {
      console.log(err);
    }
  };

  const NavbarComponent = location.pathname === "/" ? HomeNavbar : OtherNavbar;

  return (
    <>
      <NavbarComponent
        cartItems={cartItems}
        onAdd={onAdd}
        onRemove={onRemove}
        onDelete={onDelete}
        onDeleteAll={onDeleteAll}
        setSignupOpen={setSignupOpen}
        setLoginOpen={setLoginOpen}
        anchorEl={anchorEl}
        handlerLogoutClick={handlerLogoutClick}
        handlerCloseLogout={handlerCloseLogout}
        handlerLogoutRequest={handlerLogoutRequest}
      />
      <main>
        <Route path="/" exact element={<HomePage />} />
        <Route path="/products" element={<ProductsPage onAdd={onAdd} />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/member-page" element={<UsersPage />} />
        <Route path="/help" element={<HelpPage />} />
      </main>
      <Footer />
      <AuthenticationModal
        signupOpen={signupOpen}
        loginOpen={loginOpen}
        handleSignupClose={handleSignupClose}
        handleLoginClose={handleLoginClose}
      />
    </>
  );
}

export default App;
