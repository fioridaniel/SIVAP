import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';

function App() {
  const [cpf, setCpf] = useState('93614250806'); /* cpf padrao por enquanto */
  const [idPropriedade, setIdPropriedade] = useState('123')  /* nao sei ainda */
  const [propriedades, setPropriedades] = useState([]);
  const [talhoes, setTalhoes] = useState([]);
  const [error, setError] = useState('');
  
  useEffect(() => {
      fetch(`http://localhost:8080/produtores/produtor-propriedades/${cpf}`)
      /* estou conseguindo acessar url pelo navegador, mas aqui nao esta dando fetch */
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => { 
        /* adicionar todas as propriedades */
        console.log("Propriedades recebidas:", data);
        const nomes = data.map(propriedade => propriedade.nome);
        setPropriedades(nomes);
        setError('');

        /* basicamente faz isso:
          for (let i = 0; i < data.length; i++) {
            nomes.push(data[i].nome);
          }
        */
      })
      .catch(error => {
        console.error('Erro ao buscar propriedades:', error);
        setError('Erro ao carregar propriedades: ' + error.message);
      });
  }, [cpf]);

  useEffect(() => {
      fetch(`http://localhost:8080/talhoes/propriedade/${idPropriedade}`)
      /* estou conseguindo acessar url pelo navegador, mas aqui nao esta dando fetch */
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => { 
        /* pegar todos os talhoes */
        console.log("Talhões recebidos:", data);
        setTalhoes(data);
      })
      .catch(error => {
        console.error('Erro ao buscar talhões:', error);
        setError('Erro ao carregar talhões: ' + error.message);
      });
  }, [idPropriedade]);

  return (
    <div>
      <h1>CPF do produtor: {cpf}</h1>
      <h2>Propriedades:</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <ul>
        {propriedades.map((nome, index) => (
          <li key={index}>{nome}</li> /* se um item da lista mudar, o react vai saber pela key */
        ))}
      </ul>
      <h2>Talhoes: </h2>
      <ul>
        {talhoes.map((talhao, index) => (
          <li key={index}>Talhão #{talhao.id_talhao} - Área: {talhao.area}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
