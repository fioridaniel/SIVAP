import { useState } from 'react';
import '../styles/Safra.css';

const Safra = () => {
  const [idPropriedade, setIdPropriedade] = useState('');
  const [idTalhao, setIdTalhao] = useState('');
  const [idVariedadeCultura, setIdVariedadeCultura] = useState('');
  const [dtPlantio, setDtPlantio] = useState('');
  const [dtColheita, setDtColheita] = useState('');
  const [producao, setProducao] = useState('');
  
  const sendForm = async (event) => {
    event.preventDefault();

    if(!idPropriedade || !idTalhao || !idVariedadeCultura || !dtPlantio || !dtColheita || !producao) {
      alert("Preencha todos os campos para enviar os dados");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/safras', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_propriedade: parseInt(idPropriedade),
          id_talhao: parseInt(idTalhao),
          id_variedade_cultura: parseInt(idVariedadeCultura),
          dt_plantio: dtPlantio,
          dt_colheita: dtColheita,
          producao: parseFloat(producao)
        })
      });
      
      if (response.ok) {
        alert("Safra cadastrada com sucesso!");
        setIdPropriedade('');
        setIdTalhao('');
        setIdVariedadeCultura('');
        setDtPlantio('');
        setDtColheita('');
        setProducao('');
      } else {
        alert("Erro ao cadastrar safra");
      }
    }
    catch(error) {
      console.log("erro ao processar request: " + error);
      alert("Erro de conexão com o servidor");
    }
  }

  return (
    <div className="safra-container">
      <div className="safra-left">
        <div className="safra-logo">🌱 AgroSIVAP</div>
        <h1>Cadastrar<br />Safra</h1>
        <p>Registre uma nova safra para controle de produção</p>
        
        <form className="safra-form" onSubmit={sendForm}>
          <div className="form-row">
            <div className="form-group">
              <label>ID da Propriedade:</label>
              <input 
                type="number" 
                value={idPropriedade}
                onChange={(e) => setIdPropriedade(e.target.value)}
                placeholder="Digite o ID da propriedade"
                required
              />
            </div>

            <div className="form-group">
              <label>ID do Talhão:</label>
              <input 
                type="number" 
                value={idTalhao}
                onChange={(e) => setIdTalhao(e.target.value)}
                placeholder="Digite o ID do talhão"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>ID Variedade da Cultura:</label>
              <input 
                type="number" 
                value={idVariedadeCultura}
                onChange={(e) => setIdVariedadeCultura(e.target.value)}
                placeholder="Digite o ID da variedade"
                required
              />
            </div>

            <div className="form-group">
              <label>Produção (kg):</label>
              <input 
                type="number" 
                step="0.01"
                value={producao}
                onChange={(e) => setProducao(e.target.value)}
                placeholder="Digite a produção em kg"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Data de Plantio:</label>
              <input 
                type="date" 
                value={dtPlantio}
                onChange={(e) => setDtPlantio(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Data de Colheita:</label>
              <input 
                type="date" 
                value={dtColheita}
                onChange={(e) => setDtColheita(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button type="submit">Cadastrar Safra</button>
        </form>
      </div>
      
      <div className="safra-right">
        <div className="placeholder-img">
          🌾<br />
          Controle de<br />
          Safras
        </div>
      </div>
    </div>
  );
}

export default Safra;