import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";       // Redux Provider
import { store } from "./store";              // Store
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>   {/* Butun appni Redux bilan o'rab olish */}
    <App />
  </Provider>
);
