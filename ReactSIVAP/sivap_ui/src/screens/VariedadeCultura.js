import { useState } from "react";

const VariedadeCultura = () => {
  const [idCultura, setIdCultura] = useState('');
  const [descricao, setDescricao] = useState('');
  const [resistenciaSeca, setResistenciaSeca] = useState('');
  const [resistenciaPragas, setResistenciaPragas] = useState('');
  const [cicloVegetativoDias, setCicloVegetativoDias] = useState('');
  const [produtividadeNota, setProdutividadeNota] = useState('');
  
  const sendForm = async (event) => {
    event.preventDefault();

    if(!idCultura || !descricao || !resistenciaSeca || !resistenciaPragas || !cicloVegetativoDias || !produtividadeNota) {
      alert("Preencha todos os campos para enviar os dados");
    }

    try {
      const response = await fetch('http://localhost:8080/variedades-cultura', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_cultura: parseInt(idCultura),
          descricao: descricao,
          resistencia_seca: parseInt(resistenciaSeca),
          resistencia_pragas: parseInt(resistenciaPragas),
          ciclo_vegetativo_dias: parseInt(cicloVegetativoDias),
          produtividade_nota: parseInt(produtividadeNota)
        })
      })
    }

    catch(error) {
      console.log("erro ao processar request: " + error);
    }
}

  return (
    <div>
      <label>
        ID Cultura:
        <input type="text" onChange={(e) => setIdCultura(e.target.value)} />
      </label>
      <br />

      <label>
        Descrição:
        <input type="text" onChange={(e) => setDescricao(e.target.value)} />
      </label>
      <br />
      
      <label>
        Resistência Seca:
        <input type="text" onChange={(e) => setResistenciaSeca(e.target.value)} />
      </label>
      <br />
      
      <label>
        Resistência Pragas:
        <input type="text" onChange={(e) => setResistenciaPragas(e.target.value)} />
      </label>
      <br />
      
      <label>
        Ciclo Vegetativo (dias):
        <input type="text" onChange={(e) => setCicloVegetativoDias(e.target.value)} />
      </label>
      <br />
      
      <label>
        Produtividade Nota:
        <input type="text" onChange={(e) => setProdutividadeNota(e.target.value)} />
      </label>
      <br />
      
      <button onClick={sendForm}>Submit</button>
    </div>
  );
}

export default VariedadeCultura; 