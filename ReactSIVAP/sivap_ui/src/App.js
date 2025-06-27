import './App.css';
import { useState } from 'react';

function App() {
  /* estados utilizados */
  const [nomeCultura, setNomeCultura] = useState('');
  const [idCultura, setIdCultura] = useState('');
  
  const handleSubmit = () => {
    alert("nome da cultura: " + nomeCultura);
    alert("id da cultura: " + idCultura);
  }

  return (
    <form onSubmit={handleSubmit}>
        <label>
          Nome da cultura:
          <input type="text" onChange={(e) => setNomeCultura(e.target.value)} />
        </label>

        <label>
          ID da cultura:
          <input type="text" onChange={(e) => setIdCultura(e.target.value)} />
        </label>        
        <input type="submit" value="Submit" />
    </form>
  );
}

export default App;
