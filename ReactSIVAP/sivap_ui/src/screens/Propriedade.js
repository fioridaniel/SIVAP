import '../styles/Propriedade.css';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

function App() {
  const [nome, setNome] = useState('');
  const [area, setArea] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [cpfUsuario, setCpfUsuario] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [propriedadeId, setPropriedadeId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  useEffect(() => {
    // Pegar o CPF do usuário do estado da navegação
    if (location.state?.cpfUsuario) {
      setCpfUsuario(location.state.cpfUsuario);
    } else {
      // Se não tiver CPF, redirecionar para login
      navigate('/login');
    }

    // Se há um ID na URL, estamos editando uma propriedade existente
    if (id) {
      setIsEditing(true);
      setPropriedadeId(parseInt(id));
      fetchPropriedade(parseInt(id));
    }
  }, [location.state, navigate, id]);
  
  const fetchPropriedade = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8080/propriedades/${id}`);
      
      if (response.ok) {
        const propriedade = await response.json();
        setNome(propriedade.nome);
        setArea(propriedade.area.toString());
        setLatitude(propriedade.latitude.toString());
        setLongitude(propriedade.longitude.toString());
      } else {
        alert('Erro ao carregar propriedade');
        navigate('/propriedades', { state: { cpfUsuario: cpfUsuario } });
      }
    } catch (error) {
      console.error('Erro ao buscar propriedade:', error);
      alert('Erro de conexão com o servidor');
      navigate('/propriedades', { state: { cpfUsuario: cpfUsuario } });
    } finally {
      setIsLoading(false);
    }
  };

  const sendForm = async (event) => {
    event.preventDefault();

    if(!nome || !area || !latitude || !longitude) {
      alert("Preencha todos os campos para enviar os dados");
      return;
    }

    if (!cpfUsuario) {
      alert("Erro: CPF do usuário não encontrado. Faça login novamente.");
      navigate('/login');
      return;
    }

    setIsLoading(true);

    try {
      const url = isEditing 
        ? `http://localhost:8080/propriedades/${propriedadeId}`
        : `http://localhost:8080/propriedades?cpfProdutor=${cpfUsuario}`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          area: parseFloat(area)
        })
      });

      if (response.ok) {
        const message = isEditing ? "Propriedade atualizada com sucesso!" : "Propriedade cadastrada com sucesso!";
        alert(message);
        // Limpar formulário
        setNome('');
        setArea('');
        setLatitude('');
        setLongitude('');
        // Redirecionar para a lista de propriedades
        navigate('/propriedades', { state: { cpfUsuario: cpfUsuario } });
      } else {
        const errorMessage = isEditing ? "Erro ao atualizar propriedade." : "Erro ao cadastrar propriedade.";
        alert(errorMessage + " Tente novamente.");
      }
    } catch(error) {
      console.log("erro ao processar request: " + error);
      alert("Erro de conexão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleVoltar = () => {
    navigate('/propriedades', { state: { cpfUsuario: cpfUsuario } });
  };

  if (isLoading && isEditing) {
    return (
      <div className="propriedade-form-container">
        <div className="loading">
          <div className="loading-icon">Carregando...</div>
          <p>Carregando dados da propriedade...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="propriedade-form-container">
      <div className="propriedade-form-header">
        <button className="back-btn" onClick={handleVoltar}>
          ← Voltar para Propriedades
        </button>
        <div className="header-content">
          <h1>🏡 {isEditing ? 'Editar Propriedade' : 'Cadastrar Nova Propriedade'}</h1>
          <p className="header-subtitle">
            {isEditing ? 'Edite os dados da propriedade' : 'Adicione uma nova propriedade ao seu perfil'}
          </p>
        </div>
        <div className="user-info">
          <span>CPF: {cpfUsuario}</span>
        </div>
      </div>

      <div className="propriedade-form-content">
        <form onSubmit={sendForm} className="propriedade-form">
          <div className="form-group">
            <label>
              Nome da Propriedade
              <input 
                type="text" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome da propriedade"
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Área (hectares)
              <input 
                type="number" 
                step="0.01"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Digite a área em hectares"
                required
              />
            </label>
          </div>
          
          <div className="form-group">
            <label>
              Latitude
              <input 
                type="number" 
                step="0.000001"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Digite a latitude"
                required
              />
            </label>
          </div>
          
          <div className="form-group">
            <label>
              Longitude
              <input 
                type="number" 
                step="0.000001"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Digite a longitude"
                required
              />
            </label>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="primary-btn"
              disabled={isLoading}
            >
              {isLoading ? (isEditing ? 'Atualizando...' : 'Cadastrando...') : (isEditing ? 'Atualizar Propriedade' : 'Cadastrar Propriedade')}
            </button>
            <button 
              type="button" 
              className="secondary-btn"
              onClick={handleVoltar}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;