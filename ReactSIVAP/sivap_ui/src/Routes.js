import { Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import PropriedadesUsuario from "./screens/PropriedadesUsuario";
import Talhao from './screens/Talhao';
import TalhaoDetalhes from './screens/TalhaoDetalhes';
import AdicionarSafra from './screens/AdicionarSafra';
import VariedadeCultura from './screens/VariedadeCultura';
import Cultura from './screens/Cultura';
import Safra from './screens/Safra';
import CondicaoClimatica from './screens/CondicaoClimatica';
import Propriedade from './screens/Propriedade';
import MelhoresTalhoes from '../src/relatorios/MelhoresTalhoes';
import MelhoresVariedades from '../src/relatorios/MelhoresVariedades';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/propriedades" element={<PropriedadesUsuario />} />
      <Route path="/talhoes/:idPropriedade" element={<Talhao />} />
      <Route path="/talhao-detalhes/:idTalhao" element={<TalhaoDetalhes />} />
      <Route path="/adicionar-safra/:idTalhao" element={<AdicionarSafra />} />
      <Route path="/variedade" element={<VariedadeCultura />} />
      <Route path="/cultura" element={<Cultura />} />
      <Route path="/safra" element={<Safra />} />
      <Route path="/condicao-climatica" element={<CondicaoClimatica />} />
      <Route path="/propriedade" element={<Propriedade/>} />
      <Route path="/relatorios-pretendidos/melhores-talhoes" element={<MelhoresTalhoes/>} />
      <Route path="/relatorios-pretendidos/melhores-variedades" element={<MelhoresVariedades/>} />
      {/* Outras rotas podem ser adicionadas aqui */}
    </Routes>
  );
} 