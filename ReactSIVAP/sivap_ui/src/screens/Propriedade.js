import './App.css';
import { useState } from 'react';

function App() {
  const [nome, setNome] = useState('');
  const [area, setArea] = useState('');

  /* nao sei se eh o melhor para inicializar numeros */
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  
  const sendForm = async (event) => {
    event.preventDefault(); /* evita o recarregamento completo da pagina para nao quebrar o react */

    if(!nome || !area || !latitude || !longitude) {
      alert("Preencha todos os campos para enviar os dados");
    }

    /* fazer requisicao */
    try {
      const response = await fetch('http://localhost:8080/propriedades', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          area: parseFloat(area)
        })
      })
    }

    catch(error) {
      console.log("erro ao processar request: " + error);
    }
}

  return (
    <form onSubmit={sendForm}>
      <label>
        Nome:
        <input type="text" onChange={(e) => setNome(e.target.value)} />
      </label>

      <label>
        area:
        <input type="text" onChange={(e) => setArea(e.target.value)} />
      </label>        
      
      <label>
        lat:
        <input type="text" onChange={(e) => setLatitude(e.target.value)} />
      </label>        
      
      <label>
        long:
        <input type="text" onChange={(e) => setLongitude(e.target.value)} />
      </label>        
      
      <input type="submit" value="Submit" />
    </form>
  );
}

export default App;
