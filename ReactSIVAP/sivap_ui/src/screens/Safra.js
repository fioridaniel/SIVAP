import { useState } from 'react';

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
      })
    }

    catch(error) {
      console.log("erro ao processar request: " + error);
    }
}

  return (
    <div>
      <h2>Formulário Safra</h2>
      <div onSubmit={sendForm}>
        <label>
          ID Propriedade:
          <input type="text" onChange={(e) => setIdPropriedade(e.target.value)} />
        </label>
        <br />

        <label>
          ID Talhão:
          <input type="text" onChange={(e) => setIdTalhao(e.target.value)} />
        </label>
        <br />
        
        <label>
          ID Variedade Cultura:
          <input type="text" onChange={(e) => setIdVariedadeCultura(e.target.value)} />
        </label>
        <br />
        
        <label>
          Data Plantio:
          <input type="date" onChange={(e) => setDtPlantio(e.target.value)} />
        </label>
        <br />
        
        <label>
          Data Colheita:
          <input type="date" onChange={(e) => setDtColheita(e.target.value)} />
        </label>
        <br />
        
        <label>
          Produção:
          <input type="text" onChange={(e) => setProducao(e.target.value)} />
        </label>
        <br />
        
        <button onClick={sendForm}>Submit</button>
      </div>

      <h2>Formulário Cultura</h2>
    </div>
  );
}

export default Safra;