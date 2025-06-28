import { useState } from 'react';
import '../styles/Cultura.css';

const Cultura = () => {
  const [nomeCultura, setNomeCultura] = useState('');
  
  const sendForm = async (event) => {
    event.preventDefault();

    if(!nomeCultura) {
      alert("Preencha todos os campos para enviar os dados");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/culturas', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome_cultura: nomeCultura
        })
      });
      
      if (response.ok) {
        alert("Cultura cadastrada com sucesso!");
        setNomeCultura('');
      } else {
        alert("Erro ao cadastrar cultura");
      }
    }
    catch(error) {
      console.log("erro ao processar request: " + error);
      alert("Erro de conexão com o servidor");
    }
  }

  return (
    <div className="cultura-container">
      <div className="cultura-left">
        <div className="cultura-logo">🌱 AgroSIVAP</div>
        <h1>Cadastrar<br />Cultura</h1>
        <p>Registre uma nova cultura para seu sistema</p>
        
        <form className="cultura-form" onSubmit={sendForm}>
          <label>
            Nome da Cultura:
            <input 
              type="text" 
              value={nomeCultura}
              onChange={(e) => setNomeCultura(e.target.value)}
              placeholder="Digite o nome da cultura (ex: Milho, Soja, Trigo...)"
              required
            />
          </label>
          
          <button type="submit">Cadastrar Cultura</button>
        </form>
      </div>
      
      <div className="cultura-right">
        <div className="placeholder-img">
          🌽<br />
          Gestão de<br />
          Culturas
        </div>
      </div>
    </div>
  );
}

export default Cultura;