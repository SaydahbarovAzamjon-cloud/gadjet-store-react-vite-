import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/app/components/errors/NotFound";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./app/components/errors/ErrorBoundary";
import { ThemeProvider } from "./app/components/ThemeContext";
import { AuthProvider } from "./app/components/auth/AuthContext";

import Home from "./app/screens/homePage/Home";
import ProductsPage from "./app/screens/productsPage/ProductsPage";
import CartPage from "./app/screens/ordersPage/sectionalComponents/CartPage";
import CheckoutPage from "./app/screens/ordersPage/sectionalComponents/CheckoutPage";
import OrdersPage from "./app/screens/ordersPage/OrdersPage";
import MyPage from "./app/screens/userPage/MyPage";
import HelpPage from "./app/screens/helpPage/HelpPage";
import RegisterPage from "./app/screens/loginAndSignupPage/RegisterPage";
import LoginPage from "./app/screens/loginAndSignupPage/LoginPage";


function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Public Routes */}
      <Route path={"/cart"} element={<CartPage />} />
      <Route path={"/checkout"} element={<CheckoutPage />} />
      <Route path={"/orders"} element={<OrdersPage />} />
      <Route path={"/my-page"} element={<MyPage />} />
      <Route path={"/404"} element={<NotFound />} />
      {/* Final fallback route */}
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Home />} />           

    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
        <ThemeProvider
          defaultTheme="dark"
        >
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
