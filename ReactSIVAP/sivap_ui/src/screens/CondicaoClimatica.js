import { useState } from 'react';

const CondicaoClimatica = () => {
  const [idSafra, setIdSafra] = useState('');
  const [precipitacaoMm, setPrecipitacaoMm] = useState('');
  const [distribuicaoChuvaNota, setDistribuicaoChuvaNota] = useState('');
  const [velocidadeVentoKmh, setVelocidadeVentoKmh] = useState('');
  const [temperaturaMediaC, setTemperaturaMediaC] = useState('');
  const [observacoes, setObservacoes] = useState('');
  
  const sendForm = async (event) => {
    event.preventDefault();

    if(!idSafra || !precipitacaoMm || !distribuicaoChuvaNota || !velocidadeVentoKmh || !temperaturaMediaC || !observacoes) {
      alert("Preencha todos os campos para enviar os dados");
    }

    try {
      const response = await fetch('http://localhost:8080/condicoes-climaticas', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_safra: parseInt(idSafra),
          precipitacao_mm: parseFloat(precipitacaoMm),
          distribuicao_chuva_nota: parseInt(distribuicaoChuvaNota),
          velocidade_vento_kmh: parseFloat(velocidadeVentoKmh),
          temperatura_media_c: parseFloat(temperaturaMediaC),
          observacoes: observacoes
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
        ID Safra:
        <input type="text" onChange={(e) => setIdSafra(e.target.value)} />
      </label>
      <br />

      <label>
        Precipitação (mm):
        <input type="text" onChange={(e) => setPrecipitacaoMm(e.target.value)} />
      </label>
      <br />
      
      <label>
        Distribuição Chuva Nota:
        <input type="text" onChange={(e) => setDistribuicaoChuvaNota(e.target.value)} />
      </label>
      <br />
      
      <label>
        Velocidade Vento (km/h):
        <input type="text" onChange={(e) => setVelocidadeVentoKmh(e.target.value)} />
      </label>
      <br />
      
      <label>
        Temperatura Média (°C):
        <input type="text" onChange={(e) => setTemperaturaMediaC(e.target.value)} />
      </label>
      <br />
      
      <label>
        Observações:
        <input type="text" onChange={(e) => setObservacoes(e.target.value)} />
      </label>
      <br />
      
      <button onClick={sendForm}>Submit</button>
    </div>
  );
}

export default CondicaoClimatica;