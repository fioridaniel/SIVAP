import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Talhao from './screens/Talhao';
import VariedadeCultura from './screens/VariedadeCultura';
import Cultura from './screens/Cultura';
import Safra from './screens/Safra';
import CondicaoClimatica from './screens/CondicaoClimatica';
import Propriedade from './screens/Propriedade';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/talhao" element={<Talhao />} />
      <Route path="/variedade" element={<VariedadeCultura />} />
      <Route path="/cultura" element={<Cultura />} />
      <Route path="/safra" element={<Safra />} />
      <Route path="/condicao-climatica" element={<CondicaoClimatica />} />
      <Route path="/propriedade" element={<Propriedade/>} />
      {/* Outras rotas podem ser adicionadas aqui */}
    </Routes>
  );
} 