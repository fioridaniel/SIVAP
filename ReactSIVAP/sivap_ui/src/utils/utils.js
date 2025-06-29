import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';

function App() {
  const [cpf, setCpf] = useState('93614250806'); /* cpf padrao por enquanto */
  const [idPropriedade, SetIdPropriedade] = useState('123')  /* nao sei ainda */
  const [propriedades, setPropriedades] = useState([]);
  const [talhoes, setTalhoes] = useState([]);
  
  useEffect(() => {
      fetch(`http://localhost:8080/produtores/produtor-propriedades/${cpf}`)
      /* estou conseguindo acessar url pelo navegador, mas aqui nao esta dando fetch */
      .then(response => response.json())
      .then(data => { 
        /* adicionar todas as propriedades */
        console.log("Propriedades recebidas:", data);
        const nomes = data.map(propriedade => propriedade.nome);
        setPropriedades(nomes);

        /* basicamente faz isso:
          for (let i = 0; i < data.length; i++) {
            nomes.push(data[i].nome);
          }
        */
      })
      .catch(error => console.error('Erro ao buscar mensagem:', error));
  }, [cpf]);

  useEffect(() => {
      fetch(`http://localhost:8080/talhoes/, ${idPropriedade}`)
      /* estou conseguindo acessar url pelo navegador, mas aqui nao esta dando fetch */
      .then(response => response.json())
      .then(data => { 
        /* pegar todos os talhoes */
      })
      .catch(error => console.error('Erro ao buscar mensagem:', error));
  }, [propriedades]);

  return (
    <div>
      <h1>CPF do produtor: {cpf}</h1>
      <h2>Propriedades:</h2>
      <ul>
        {propriedades.map((nome, index) => (
          <li key={index}>{nome}</li> /* se um item da lista mudar, o react vai saber pela key */
        ))}
      </ul>
      <h2>Talhoes: </h2>
    </div>
  );
}

export default App;
