import { Routes, Route } from "react-router-dom";
import Login from "./Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* Outras rotas podem ser adicionadas aqui */}
    </Routes>
  );
} 