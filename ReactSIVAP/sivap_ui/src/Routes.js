import { Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import CriarConta from "./screens/CriarConta";
import AlterarSenha from "./screens/AlterarSenha";
import PropriedadesUsuario from "./screens/PropriedadesUsuario";
import Talhao from './screens/Talhao';
import TalhaoDetalhes from './screens/TalhaoDetalhes';
import AdicionarSafra from './screens/AdicionarSafra';
import VariedadeCultura from './screens/VariedadeCultura';
import Cultura from './screens/Cultura';
import Safra from './screens/Safra';
import CondicaoClimatica from './screens/CondicaoClimatica';
import Propriedade from './screens/Propriedade';
import RelatoriosPretendidos from '../src/relatorios/RelatoriosPretendidos';
import MelhoresVariedades from '../src/relatorios/MelhoresVariedades';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/criar-conta" element={<CriarConta />} />
      <Route path="/alterar-senha" element={<AlterarSenha />} />
      <Route path="/propriedades" element={<PropriedadesUsuario />} />
      <Route path="/talhoes/:idPropriedade" element={<Talhao />} />
      <Route path="/propriedades/:idPropriedade/talhoes/:idTalhao" element={<TalhaoDetalhes />} />
      <Route path="/propriedades/:idPropriedade/talhoes/:idTalhao/adicionar-safra" element={<AdicionarSafra />} />
      <Route path="/propriedades/:idPropriedade/talhoes/:idTalhao/editar-safra" element={<AdicionarSafra />} />
      <Route path="/variedade" element={<VariedadeCultura />} />
      <Route path="/cultura" element={<Cultura />} />
      <Route path="/safra" element={<Safra />} />
      <Route path="/condicao-climatica" element={<CondicaoClimatica />} />
      <Route path="/propriedade" element={<Propriedade/>} />
      <Route path="/propriedade/:id" element={<Propriedade/>} />
      <Route path="/relatorios-pretendidos" element={<RelatoriosPretendidos/>} />
      <Route path="/relatorios-pretendidos/melhores-variedades" element={<MelhoresVariedades/>} />
      {/* Outras rotas podem ser adicionadas aqui */}
    </Routes>
  );
} 