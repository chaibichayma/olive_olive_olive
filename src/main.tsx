
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Charger le thème sauvegardé
const savedMode =
  localStorage.getItem("oliveapp_dark_mode") === "true";

document.documentElement.classList.toggle("dark", savedMode);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
