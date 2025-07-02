import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Talhao.css';

const AdicionarSafra = () => {
  const { idTalhao } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [propriedade, setPropriedade] = useState(null);
  const [talhao, setTalhao] = useState(null);
  const [cpfUsuario, setCpfUsuario] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [variedadesCultura, setVariedadesCultura] = useState([]);
  
  // Estados para os campos da safra
  const [safraData, setSafraData] = useState({
    dt_plantio: '',
    dt_colheita: '',
    producao: '',
    id_variedade_cultura: ''
  });
  
  // Estados para os campos da condição climática
  const [condicaoData, setCondicaoData] = useState({
    precipitacao_mm: '',
    distribuicao_chuva_nota: '',
    velocidade_max_vento_kmh: '',
    temperatura_media_c: '',
    observacoes: ''
  });

  useEffect(() => {
    if (location.state?.propriedade) {
      setPropriedade(location.state.propriedade);
    }
    if (location.state?.talhao) {
      setTalhao(location.state.talhao);
    }
    if (location.state?.cpfUsuario) {
      setCpfUsuario(location.state.cpfUsuario);
    }
    fetchVariedadesCultura();
  }, [location.state]);

  const fetchVariedadesCultura = async () => {
    try {
      const response = await fetch('http://localhost:8080/variedades-cultura');
      if (response.ok) {
        const data = await response.json();
        setVariedadesCultura(data);
      }
    } catch (error) {
      console.error('Erro ao buscar variedades de cultura:', error);
    }
  };

  const handleSafraChange = (e) => {
    const { name, value } = e.target;
    setSafraData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCondicaoChange = (e) => {
    const { name, value } = e.target;
    setCondicaoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Primeiro, criar a safra
      const safraPayload = {
        ...safraData,
        id_talhao: parseInt(idTalhao),
        producao: parseFloat(safraData.producao),
        id_variedade_cultura: parseInt(safraData.id_variedade_cultura)
      };

      const safraResponse = await fetch('http://localhost:8080/safras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(safraPayload)
      });

      if (!safraResponse.ok) {
        throw new Error('Erro ao criar safra');
      }

      const safraCriada = await safraResponse.json();

      // Depois, criar a condição climática usando o ID da safra criada
      const condicaoPayload = {
        id_safra: safraCriada.id_safra,
        precipitacao_mm: parseFloat(condicaoData.precipitacao_mm),
        distribuicao_chuva_nota: parseInt(condicaoData.distribuicao_chuva_nota),
        velocidade_vento_kmh: parseFloat(condicaoData.velocidade_max_vento_kmh),
        temperatura_media_c: parseFloat(condicaoData.temperatura_media_c),
        observacoes: condicaoData.observacoes
      };

      const condicaoResponse = await fetch('http://localhost:8080/condicoes-climaticas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(condicaoPayload)
      });

      if (!condicaoResponse.ok) {
        throw new Error('Erro ao criar condição climática');
      }

      setSuccess('Safra e condição climática cadastradas com sucesso!');
      
      // Limpar formulário
      setSafraData({
        dt_plantio: '',
        dt_colheita: '',
        producao: '',
        id_variedade_cultura: ''
      });
      setCondicaoData({
        precipitacao_mm: '',
        distribuicao_chuva_nota: '',
        velocidade_max_vento_kmh: '',
        temperatura_media_c: '',
        observacoes: ''
      });

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate(`/talhao-detalhes/${idTalhao}`, { 
          state: { 
            propriedade: propriedade, 
            cpfUsuario: cpfUsuario,
            talhao: talhao
          } 
        });
      }, 2000);

    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setError('Erro ao cadastrar safra e condição climática. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToTalhao = () => {
    navigate(`/talhao-detalhes/${idTalhao}`, { 
      state: { 
        propriedade: propriedade, 
        cpfUsuario: cpfUsuario,
        talhao: talhao
      } 
    });
  };

  return (
    <div className="talhao-container">
      <div className="talhao-header">
        <button className="back-btn" onClick={handleBackToTalhao}>
          ← Voltar aos Detalhes do Talhão
        </button>
        <div className="header-content">
          <h1>🌾 Adicionar Safra e Condição Climática</h1>
          <p className="header-subtitle">Cadastre uma nova safra com suas condições climáticas</p>
        </div>
        {talhao && (
          <div className="talhao-info">
            <h2>Talhão #{talhao.id_talhao}</h2>
            <p>Área: {talhao.area} hectares</p>
          </div>
        )}
      </div>

      <div className="talhao-content">
        <div className="form-container">
          {error && (
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <p>{success}</p>
              <p>Redirecionando...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="safra-form">
            <div className="form-sections">
              {/* Seção da Safra */}
              <div className="form-section">
                <h3>📊 Informações da Safra</h3>
                
                <div className="form-group">
                  <label htmlFor="dt_plantio">Data de Plantio:</label>
                  <input
                    type="date"
                    id="dt_plantio"
                    name="dt_plantio"
                    value={safraData.dt_plantio}
                    onChange={handleSafraChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dt_colheita">Data de Colheita:</label>
                  <input
                    type="date"
                    id="dt_colheita"
                    name="dt_colheita"
                    value={safraData.dt_colheita}
                    onChange={handleSafraChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="producao">Produção (toneladas):</label>
                  <input
                    type="number"
                    id="producao"
                    name="producao"
                    value={safraData.producao}
                    onChange={handleSafraChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="id_variedade_cultura">Variedade/Cultura:</label>
                  <select
                    id="id_variedade_cultura"
                    name="id_variedade_cultura"
                    value={safraData.id_variedade_cultura}
                    onChange={handleSafraChange}
                    required
                  >
                    <option value="">Selecione uma variedade/cultura</option>
                    {variedadesCultura.map((variedade) => (
                      <option key={variedade.id_variedade_cultura} value={variedade.id_variedade_cultura}>
                        {variedade.nome_variedade} - {variedade.nome_cultura}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seção da Condição Climática */}
              <div className="form-section">
                <h3>🌤️ Condições Climáticas</h3>
                
                <div className="form-group">
                  <label htmlFor="precipitacao_mm">Precipitação (mm):</label>
                  <input
                    type="number"
                    id="precipitacao_mm"
                    name="precipitacao_mm"
                    value={condicaoData.precipitacao_mm}
                    onChange={handleCondicaoChange}
                    step="0.1"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="distribuicao_chuva_nota">Distribuição de Chuva (1-10):</label>
                  <input
                    type="number"
                    id="distribuicao_chuva_nota"
                    name="distribuicao_chuva_nota"
                    value={condicaoData.distribuicao_chuva_nota}
                    onChange={handleCondicaoChange}
                    min="1"
                    max="10"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="velocidade_max_vento_kmh">Velocidade Máxima do Vento (km/h):</label>
                  <input
                    type="number"
                    id="velocidade_max_vento_kmh"
                    name="velocidade_max_vento_kmh"
                    value={condicaoData.velocidade_max_vento_kmh}
                    onChange={handleCondicaoChange}
                    step="0.1"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="temperatura_media_c">Temperatura Média (°C):</label>
                  <input
                    type="number"
                    id="temperatura_media_c"
                    name="temperatura_media_c"
                    value={condicaoData.temperatura_media_c}
                    onChange={handleCondicaoChange}
                    step="0.1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="observacoes">Observações:</label>
                  <textarea
                    id="observacoes"
                    name="observacoes"
                    value={condicaoData.observacoes}
                    onChange={handleCondicaoChange}
                    rows="3"
                    placeholder="Observações adicionais sobre as condições climáticas..."
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={handleBackToTalhao}
                className="cancel-btn"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Cadastrando...' : 'Cadastrar Safra e Condição Climática'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdicionarSafra; 