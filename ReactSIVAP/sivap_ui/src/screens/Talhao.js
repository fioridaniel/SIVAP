import { useState } from 'react';
import '../styles/Talhao.css';

const Talhao = () => {
  const [idPropriedade, setIdPropriedade] = useState('');
  const [area, setArea] = useState('');
  
  const sendForm = async (event) => {
    event.preventDefault();

    if(!idPropriedade || !area) {
      alert("Preencha todos os campos para enviar os dados");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/talhoes', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_propriedade: parseInt(idPropriedade),
          area: parseFloat(area)
        })
      });
      
      if (response.ok) {
        alert("Talhão cadastrado com sucesso!");
        setIdPropriedade('');
        setArea('');
      } else {
        alert("Erro ao cadastrar talhão");
      }
    }
    catch(error) {
      console.log("erro ao processar request: " + error);
      alert("Erro de conexão com o servidor");
    }
  }

  return (
    <div className="talhao-container">
      <div className="talhao-left">
        <div className="talhao-logo">🌱 AgroSIVAP</div>
        <h1>Cadastrar<br />Talhão</h1>
        <p>Registre um novo talhão para sua propriedade</p>
        
        <form className="talhao-form" onSubmit={sendForm}>
          <label>
            ID da Propriedade:
            <input 
              type="number" 
              value={idPropriedade}
              onChange={(e) => setIdPropriedade(e.target.value)}
              placeholder="Digite o ID da propriedade"
              required
            />
          </label>

          <label>
            Área (hectares):
            <input 
              type="number" 
              step="0.01"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Digite a área em hectares"
              required
            />
          </label>
          
          <button type="submit">Cadastrar Talhão</button>
        </form>
      </div>
      
      <div className="talhao-right">
        <div className="placeholder-img">
          🚜<br />
          Gestão de<br />
          Talhões
        </div>
      </div>
    </div>
  );
}

export default Talhao;