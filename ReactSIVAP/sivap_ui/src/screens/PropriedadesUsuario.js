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

  const handleEditPropriedade = (propriedade, event) => {
    event.stopPropagation(); // Evita que o clique propague para o item da lista
    navigate(`/propriedade/${propriedade.id}`, { 
      state: { propriedade: propriedade, cpfUsuario: cpfUsuario } 
    });
  };

  const handleDeletePropriedade = async (propriedade, event) => {
    event.stopPropagation(); // Evita que o clique propague para o item da lista
    
    const confirmacao = window.confirm(
      `Tem certeza que deseja deletar a propriedade "${propriedade.nome}"?\n\n` +
      `Esta ação irá deletar:\n` +
      `• Todos os talhões da propriedade\n` +
      `• Todas as safras dos talhões\n` +
      `• Todas as condições climáticas das safras\n\n` +
      `Esta ação não pode ser desfeita!`
    );

    if (!confirmacao) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/propriedades/${propriedade.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Propriedade deletada com sucesso!');
        // Recarregar a lista de propriedades
        fetchPropriedades(cpfUsuario);
      } else {
        alert('Erro ao deletar propriedade. Verifique se não há dependências.');
      }
    } catch (error) {
      console.error('Erro ao deletar propriedade:', error);
      alert('Erro de conexão com o servidor');
    }
  };

  const handleLogout = () => {
    // Em uma implementação real, limparia o token de autenticação
    navigate('/login');
  };

  const handleAlterarSenha = () => {
    navigate('/alterar-senha', { state: { cpfUsuario: cpfUsuario } });
  };

  const handleDeletarConta = async () => {
    const confirmacao = window.confirm(
      `Tem certeza que deseja deletar sua conta?\n\n` +
      `Esta ação irá deletar:\n` +
      `• Sua conta de produtor\n` +
      `• Todas as suas propriedades\n` +
      `• Todos os talhões das propriedades\n` +
      `• Todas as safras dos talhões\n` +
      `• Todas as condições climáticas das safras\n\n` +
      `Esta ação não pode ser desfeita!\n\n` +
      `Digite "DELETAR" para confirmar:`
    );

    if (!confirmacao) {
      return;
    }

    const confirmacaoFinal = prompt("Digite 'DELETAR' para confirmar a exclusão da conta:");
    
    if (confirmacaoFinal !== "DELETAR") {
      alert("Operação cancelada.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/produtores/${cpfUsuario}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Conta deletada com sucesso!');
        navigate('/login');
      } else {
        alert('Erro ao deletar conta. Verifique se não há dependências.');
      }
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      alert('Erro de conexão com o servidor');
    }
  };

  if (isLoading) {
    return (
      <div className="propriedades-container">
        <div className="loading">
          <div className="loading-icon">Carregando...</div>
          <p>Carregando suas propriedades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="propriedades-container">
        <div className="error">
          <div className="error-icon">Erro</div>
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
          <h1>Minhas Propriedades</h1>
          <p className="header-subtitle">Gerencie suas propriedades rurais</p>
        </div>
        <div className="user-info">
          <span>CPF: {cpfUsuario}</span>
          <div className="user-actions">
            <button className="alterar-senha-btn" onClick={handleAlterarSenha}>
              🔐 Alterar Senha
            </button>
            <button className="deletar-conta-btn" onClick={handleDeletarConta}>
              🗑️ Deletar Conta
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="propriedades-content">
        {propriedades.length === 0 ? (
          <div className="no-properties">
            <div className="no-properties-icon">Nenhuma propriedade</div>
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
                <div className="property-list-icon">Propriedade</div>
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
                  <button 
                    className="edit-btn"
                    onClick={(e) => handleEditPropriedade(propriedade, e)}
                    title="Editar propriedade"
                  >
                    ✏️
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={(e) => handleDeletePropriedade(propriedade, e)}
                    title="Deletar propriedade"
                  >
                    🗑️
                  </button>
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