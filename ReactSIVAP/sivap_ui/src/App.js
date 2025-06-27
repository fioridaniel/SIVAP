import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';

function App() {
  const [dado, setDado] = useState('');
  
  useEffect(() => {
    /* os then sao encadeados. a ordem importa */
      fetch('http://localhost:8080/produtores')
      .then(response => response.json())
      .then(data => { 
        console.log(data[0].cpf);
        setDado(data[0].cpf); 
      })
      .catch(error => console.error('Erro ao buscar mensagem:', error));
  }, []);

  return (
    <h1>Mensagem do server: {dado}</h1>
  )
}

export default App;
