import { useState } from 'react';

const Talhao = () => {
  const [idPropriedade, setIdPropriedade] = useState('');
  const [area, setArea] = useState('');
  
  const sendForm = async (event) => {
    event.preventDefault();

    if(!idPropriedade || !area) {
      alert("Preencha todos os campos para enviar os dados");
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
      })
    }

    catch(error) {
      console.log("erro ao processar request: " + error);
    }
}

  return (
    <div>
      <label>
        ID Propriedade:
        <input type="text" onChange={(e) => setIdPropriedade(e.target.value)} />
      </label>
      <br />

      <label>
        Área:
        <input type="text" onChange={(e) => setArea(e.target.value)} />
      </label>
      <br />
      
      <button onClick={sendForm}>Submit</button>
    </div>
  );
}

export default Talhao;