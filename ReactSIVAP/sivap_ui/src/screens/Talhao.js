import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Talhao.css';

const Talhao = () => {
  const { idPropriedade } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [talhoes, setTalhoes] = useState([]);
  const [propriedade, setPropriedade] = useState(null);
  const [cpfUsuario, setCpfUsuario] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para o formulário de novo talhão
  const [showForm, setShowForm] = useState(false);
  const [area, setArea] = useState('');
  
  useEffect(() => {
    if (location.state?.propriedade) {
      setPropriedade(location.state.propriedade);
    }
    if (location.state?.cpfUsuario) {
      setCpfUsuario(location.state.cpfUsuario);
    }
    fetchTalhoes();
  }, [idPropriedade, location.state]);

  const fetchTalhoes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080/talhoes/propriedade/${idPropriedade}`);
      
      if (response.ok) {
        const data = await response.json();
        setTalhoes(data);
      } else {
        setError('Erro ao carregar talhões');
      }
    } catch (error) {
      console.error('Erro ao buscar talhões:', error);
      setError('Erro de conexão com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const sendForm = async (event) => {
    event.preventDefault();

    if(!area) {
      alert("Preencha todos os campos para enviar os dados");
      return;
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
      });
      
      if (response.ok) {
        alert("Talhão cadastrado com sucesso!");
        setArea('');
        setShowForm(false);
        fetchTalhoes(); // Recarregar a lista
      } else {
        alert("Erro ao cadastrar talhão");
      }
    }
    catch(error) {
      console.log("erro ao processar request: " + error);
      alert("Erro de conexão com o servidor");
    }
  };

  const handleBackToProperties = () => {
    navigate('/propriedades', { state: { cpfUsuario: cpfUsuario } });
  };

  const handleViewDetails = (talhao) => {
    navigate(`/talhao-detalhes/${talhao.id_talhao}`, { 
      state: { 
        propriedade: propriedade, 
        cpfUsuario: cpfUsuario 
      } 
    });
  };

  if (isLoading) {
    return (
      <div className="talhao-container">
        <div className="loading">
          <div className="loading-icon">🌾</div>
          <p>Carregando talhões...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="talhao-container">
        <div className="error">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <button onClick={fetchTalhoes}>Tentar novamente</button>
          <button onClick={handleBackToProperties}>Voltar às Propriedades</button>
        </div>
      </div>
    );
  }

  return (
    <div className="talhao-container">
      <div className="talhao-header">
        <button className="back-btn" onClick={handleBackToProperties}>
          ← Voltar às Propriedades
        </button>
        <div className="header-content">
          <h1>🌾 Talhões da Propriedade</h1>
          <p className="header-subtitle">Gerencie os talhões de sua propriedade</p>
        </div>
        {propriedade && (
          <div className="propriedade-info">
            <h2>{propriedade.nome}</h2>
            <p>Área total: {propriedade.area} hectares</p>
          </div>
        )}
      </div>

      <div className="talhao-content">
        <div className="talhao-actions">
          <button 
            className="add-talhao-btn primary-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : '+ Novo Talhão'}
          </button>
        </div>

        {showForm && (
          <div className="talhao-form-container">
            <h3>Cadastrar Novo Talhão</h3>
            <form className="talhao-form" onSubmit={sendForm}>
              <label>
                Área (hectares):
                <input 
                  type="number" 
                  step="0.01"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Digite a área em hectares"
                  required
                />
              </label>
              
              <div className="form-buttons">
                <button type="submit" className="primary-btn">Cadastrar Talhão</button>
                <button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="talhoes-list">
          {talhoes.length === 0 ? (
            <div className="no-talhoes">
              <div className="no-talhoes-icon">🌱</div>
              <h3>Nenhum talhão cadastrado</h3>
              <p>Nenhum talhão cadastrado nesta propriedade.</p>
              <button 
                className="primary-btn"
                onClick={() => setShowForm(true)}
              >
                Cadastrar Primeiro Talhão
              </button>
            </div>
          ) : (
            <div className="talhoes-list-container">
              {talhoes.map((talhao) => (
                <div key={talhao.id_talhao} className="talhao-list-item">
                  <div className="talhao-list-icon">🌾</div>
                  <div className="talhao-list-info">
                    <h3>Talhão #{talhao.id_talhao}</h3>
                    <div className="talhao-list-details">
                      <span className="detail-item">
                        <span className="detail-label">Área:</span> 
                        <span className="detail-value">{talhao.area} hectares</span>
                      </span>
                    </div>
                  </div>
                  <div className="talhao-list-actions">
                    <button 
                      className="view-details-btn"
                      onClick={() => handleViewDetails(talhao)}
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Talhao;