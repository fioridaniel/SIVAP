import { useState } from 'react';

const Cultura = () => {
  const [nomeCultura, setNomeCultura] = useState('');
  
  const sendForm = async (event) => {
    event.preventDefault();

    if(!nomeCultura) {
      alert("Preencha todos os campos para enviar os dados");
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
      })
    }

    catch(error) {
      console.log("erro ao processar request: " + error);
    }
}

  return (
    <div>
      <label>
        Nome Cultura:
        <input type="text" onChange={(e) => setNomeCultura(e.target.value)} />
      </label>
      <br />
      
      <button onClick={sendForm}>Submit</button>
    </div>
  );
}

export default Cultura;