import './App.css';
import { Routes, Route } from 'react-router-dom';
import Talhao from './screens/Talhao';
import VariedadeCultura from './screens/VariedadeCultura';
import Cultura from './screens/Cultura';
import Safra from './screens/Safra';
import CondicaoClimatica from './screens/CondicaoClimatica';
import Propriedade from './screens/Propriedade';

function App() {
  return (
      <Routes>
        <Route path="/talhao" element={<Talhao />} />
        <Route path="/variedade" element={<VariedadeCultura />} />
        <Route path="/cultura" element={<Cultura />} />
        <Route path="/safra" element={<Safra />} />
        <Route path="/condicao-climatica" element={<CondicaoClimatica />} />
        <Route path="/propriedade" element={<Propriedade/>} />
      </Routes>
  );
}

export default App;