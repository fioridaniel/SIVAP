import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/PropriedadesUsuario.css';

const PropriedadesUsuario = () => {
  const [propriedades, setPropriedades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [cpfUsuario, setCpfUsuario] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Pegar o CPF do usuário do estado da navegação
    if (location.state?.cpfUsuario) {
      setCpfUsuario(location.state.cpfUsuario);
      fetchPropriedades(location.state.cpfUsuario);
    } else {
      // Se não tiver CPF, redirecionar para login
      navigate('/login');
    }
  }, [location.state, navigate]);

  const fetchPropriedades = async (cpf) => {
    try {
      setIsLoading(true);
      setError('');
      
      // Buscar propriedades do produtor específico
      const response = await fetch(`http://localhost:8080/propriedades/produtor/${cpf}`);
      
      if (response.ok) {
        const data = await response.json();
        setPropriedades(data);
      } else {
        setError('Erro ao carregar propriedades');
      }
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error);
      setError('Erro de conexão com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePropriedadeClick = (propriedade) => {
    // Navegar para a página de talhões com o ID da propriedade
    navigate(`/talhoes/${propriedade.id}`, { 
      state: { propriedade: propriedade, cpfUsuario: cpfUsuario } 
    });
  };

  const handleLogout = () => {
    // Em uma implementação real, limparia o token de autenticação
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="propriedades-container">
        <div className="loading">
          <div className="loading-icon">🌱</div>
          <p>Carregando suas propriedades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="propriedades-container">
        <div className="error">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <button onClick={() => fetchPropriedades(cpfUsuario)}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className="propriedades-container">
      <div className="propriedades-header">
        <div className="header-content">
          <h1>🌱 Minhas Propriedades</h1>
          <p className="header-subtitle">Gerencie suas propriedades rurais</p>
        </div>
        <div className="user-info">
          <span>CPF: {cpfUsuario}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>

      <div className="propriedades-content">
        {propriedades.length === 0 ? (
          <div className="no-properties">
            <div className="no-properties-icon">🏡</div>
            <h3>Nenhuma propriedade cadastrada</h3>
            <p>Você ainda não possui propriedades cadastradas.</p>
            <button 
              className="primary-btn"
              onClick={() => navigate('/propriedade', { state: { cpfUsuario: cpfUsuario } })}
            >
              Cadastrar Primeira Propriedade
            </button>
          </div>
        ) : (
          <div className="properties-list">
            {propriedades.map((propriedade) => (
              <div 
                key={propriedade.id} 
                className="property-list-item"
                onClick={() => handlePropriedadeClick(propriedade)}
              >
                <div className="property-list-icon">🏡</div>
                <div className="property-list-info">
                  <h3>{propriedade.nome}</h3>
                  <div className="property-list-details">
                    <span className="detail-item">
                      <span className="detail-label">Área:</span> 
                      <span className="detail-value">{propriedade.area} hectares</span>
                    </span>
                    <span className="detail-item">
                      <span className="detail-label">Localização:</span> 
                      <span className="detail-value">{propriedade.latitude}, {propriedade.longitude}</span>
                    </span>
                  </div>
                </div>
                <div className="property-list-actions">
                  <span className="view-talhoes">Ver Talhões →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="propriedades-footer">
        <button 
          className="add-property-btn primary-btn"
          onClick={() => navigate('/propriedade', { state: { cpfUsuario: cpfUsuario } })}
        >
          + Nova Propriedade
        </button>
      </div>
    </div>
  );
};

export default PropriedadesUsuario; 