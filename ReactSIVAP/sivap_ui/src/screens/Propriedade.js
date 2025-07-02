import '../styles/Propriedade.css';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function App() {
  const [nome, setNome] = useState('');
  const [area, setArea] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [cpfUsuario, setCpfUsuario] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Pegar o CPF do usuário do estado da navegação
    if (location.state?.cpfUsuario) {
      setCpfUsuario(location.state.cpfUsuario);
    } else {
      // Se não tiver CPF, redirecionar para login
      navigate('/login');
    }
  }, [location.state, navigate]);
  
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
      const response = await fetch(`http://localhost:8080/propriedades?cpfProdutor=${cpfUsuario}`, {
        method: 'POST',
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
        alert("Propriedade cadastrada com sucesso!");
        // Limpar formulário
        setNome('');
        setArea('');
        setLatitude('');
        setLongitude('');
        // Redirecionar para a lista de propriedades
        navigate('/propriedades', { state: { cpfUsuario: cpfUsuario } });
      } else {
        alert("Erro ao cadastrar propriedade. Tente novamente.");
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

  return (
    <div className="propriedade-form-container">
      <div className="propriedade-form-header">
        <button className="back-btn" onClick={handleVoltar}>
          ← Voltar para Propriedades
        </button>
        <div className="header-content">
          <h1>🏡 Cadastrar Nova Propriedade</h1>
          <p className="header-subtitle">Adicione uma nova propriedade ao seu perfil</p>
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
              {isLoading ? 'Cadastrando...' : 'Cadastrar Propriedade'}
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