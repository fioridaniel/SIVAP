import { useState, useEffect } from 'react';
import '../styles/Cultura.css';

const Cultura = () => {
  const [nomeCultura, setNomeCultura] = useState('');
  const [culturas, setCulturas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchCulturas();
  }, []);

  const fetchCulturas = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:8080/culturas');
      
      if (response.ok) {
        const data = await response.json();
        setCulturas(data);
      } else {
        setError('Erro ao carregar culturas');
      }
    } catch (error) {
      console.error('Erro ao buscar culturas:', error);
      setError('Erro de conexão com o servidor');
    } finally {
      setIsLoading(false);
    }
  };
  
  const sendForm = async (event) => {
    event.preventDefault();

    if(!nomeCultura) {
      alert("Preencha todos os campos para enviar os dados");
      return;
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
      });
      
      if (response.ok) {
        alert("Cultura cadastrada com sucesso!");
        setNomeCultura('');
        fetchCulturas(); // Recarregar a lista
      } else {
        alert("Erro ao cadastrar cultura");
      }
    }
    catch(error) {
      console.log("erro ao processar request: " + error);
      alert("Erro de conexão com o servidor");
    }
  };

  const handleDeleteCultura = async (cultura, event) => {
    event.stopPropagation();
    
    const confirmacao = window.confirm(
      `Tem certeza que deseja deletar a cultura "${cultura.nome_cultura}"?\n\n` +
      `Esta ação irá deletar:\n` +
      `• Todas as variedades desta cultura\n` +
      `• Todas as safras que usam essas variedades\n\n` +
      `Esta ação não pode ser desfeita!`
    );

    if (!confirmacao) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/culturas/${cultura.id_cultura}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Cultura deletada com sucesso!');
        fetchCulturas(); // Recarregar a lista
      } else {
        alert('Erro ao deletar cultura. Verifique se não há dependências.');
      }
    } catch (error) {
      console.error('Erro ao deletar cultura:', error);
      alert('Erro de conexão com o servidor');
    }
  };

  if (isLoading) {
    return (
      <div className="cultura-container">
        <div className="loading">
          <div className="loading-icon">Carregando...</div>
          <p>Carregando culturas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cultura-container">
        <div className="error">
          <div className="error-icon">Erro</div>
          <p>{error}</p>
          <button onClick={fetchCulturas}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cultura-container">
      <div className="cultura-left">
        <div className="cultura-logo">AgroSIVAP</div>
        <h1>Gestão de<br />Culturas</h1>
        <p>Cadastre e gerencie as culturas do seu sistema</p>
        
        <form className="cultura-form" onSubmit={sendForm}>
          <label>
            Nome da Cultura:
            <input 
              type="text" 
              value={nomeCultura}
              onChange={(e) => setNomeCultura(e.target.value)}
              placeholder="Digite o nome da cultura (ex: Milho, Soja, Trigo...)"
              required
            />
          </label>
          
          <button type="submit">Cadastrar Cultura</button>
        </form>

        <div className="culturas-list">
          <h3>Culturas Cadastradas</h3>
          {culturas.length === 0 ? (
            <div className="no-culturas">
              <p>Nenhuma cultura cadastrada ainda.</p>
            </div>
          ) : (
            <div className="culturas-container">
              {culturas.map((cultura) => (
                <div key={cultura.id_cultura} className="cultura-item">
                  <div className="cultura-info">
                    <span className="cultura-icon">Cultura</span>
                    <span className="cultura-nome">{cultura.nome_cultura}</span>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={(e) => handleDeleteCultura(cultura, e)}
                    title="Deletar cultura"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="cultura-right">
        <div className="placeholder-img">
          Gestão de<br />
          Culturas
        </div>
      </div>
    </div>
  );
}

export default Cultura;