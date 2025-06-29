import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Talhao.css';

const TalhaoDetalhes = () => {
  const { idTalhao } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [talhao, setTalhao] = useState(null);
  const [propriedade, setPropriedade] = useState(null);
  const [cpfUsuario, setCpfUsuario] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [safrasComCondicoes, setSafrasComCondicoes] = useState([]);
  const [safrasExibidas, setSafrasExibidas] = useState([]);
  const [safrasVisiveis, setSafrasVisiveis] = useState(10);
  const [todasSafrasCarregadas, setTodasSafrasCarregadas] = useState(false);

  useEffect(() => {
    if (location.state?.propriedade) {
      setPropriedade(location.state.propriedade);
    }
    if (location.state?.cpfUsuario) {
      setCpfUsuario(location.state.cpfUsuario);
    }
    fetchTalhaoDetalhes();
  }, [idTalhao, location.state]);

  useEffect(() => {
    // Atualizar safras exibidas quando safrasComCondicoes mudar
    setSafrasExibidas(safrasComCondicoes.slice(0, safrasVisiveis));
    setTodasSafrasCarregadas(safrasVisiveis >= safrasComCondicoes.length);
  }, [safrasComCondicoes, safrasVisiveis]);

  const fetchTalhaoDetalhes = async () => {
    try {
      setIsLoading(true);
      
      // Buscar detalhes do talhão
      const talhaoResponse = await fetch(`http://localhost:8080/talhoes/${idTalhao}`);
      
      if (talhaoResponse.ok) {
        const talhaoData = await talhaoResponse.json();
        setTalhao(talhaoData);
        
        // Buscar safras com suas condições climáticas em uma única requisição
        const safrasResponse = await fetch(`http://localhost:8080/safras/talhao/${idTalhao}/com-condicoes`);
        if (safrasResponse.ok) {
          const safrasData = await safrasResponse.json();
          setSafrasComCondicoes(safrasData);
        } else {
          console.error('Erro ao buscar safras com condições climáticas');
          setSafrasComCondicoes([]);
        }
      } else {
        setError('Erro ao carregar detalhes do talhão');
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do talhão:', error);
      setError('Erro de conexão com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const carregarMaisSafras = () => {
    const novasSafrasVisiveis = Math.min(safrasVisiveis + 10, safrasComCondicoes.length);
    setSafrasVisiveis(novasSafrasVisiveis);
  };

  const handleBackToTalhoes = () => {
    navigate(`/talhoes/${propriedade?.id || ''}`, { 
      state: { 
        propriedade: propriedade, 
        cpfUsuario: cpfUsuario 
      } 
    });
  };

  const handleBackToProperties = () => {
    navigate('/propriedades', { state: { cpfUsuario: cpfUsuario } });
  };

  if (isLoading) {
    return (
      <div className="talhao-container">
        <div className="loading">
          <div className="loading-icon">🌾</div>
          <p>Carregando detalhes do talhão...</p>
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
          <button onClick={fetchTalhaoDetalhes}>Tentar novamente</button>
          <button onClick={handleBackToTalhoes}>Voltar aos Talhões</button>
        </div>
      </div>
    );
  }

  if (!talhao) {
    return (
      <div className="talhao-container">
        <div className="error">
          <div className="error-icon">❌</div>
          <p>Talhão não encontrado</p>
          <button onClick={handleBackToTalhoes}>Voltar aos Talhões</button>
        </div>
      </div>
    );
  }

  return (
    <div className="talhao-container">
      <div className="talhao-header">
        <div className="header-top">
          <button className="back-btn" onClick={handleBackToTalhoes}>
            ← Voltar aos Talhões
          </button>
          <button 
            className="add-safra-btn" 
            onClick={() => navigate(`/adicionar-safra/${idTalhao}`, { 
              state: { 
                propriedade: propriedade, 
                cpfUsuario: cpfUsuario,
                talhao: talhao
              } 
            })}
          >
            ➕ Adicionar Safra
          </button>
        </div>
        <div className="header-content">
          <h1>🌾 Detalhes do Talhão</h1>
          <p className="header-subtitle">Informações detalhadas do talhão</p>
        </div>
        {propriedade && (
          <div className="propriedade-info">
            <h2>{propriedade.nome}</h2>
            <p>Propriedade: {propriedade.nome}</p>
          </div>
        )}
      </div>

      <div className="talhao-content">
        <div className="talhao-details-container">
          <div className="talhao-main-info">
            <div className="talhao-card">
              <div className="talhao-card-header">
                <h2>Talhão #{talhao.id_talhao}</h2>
                <div className="talhao-icon">🌾</div>
              </div>
              <div className="talhao-card-content">
                <div className="detail-row">
                  <span className="detail-label">ID do Talhão:</span>
                  <span className="detail-value">{talhao.id_talhao}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Área:</span>
                  <span className="detail-value">{talhao.area} hectares</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ID da Propriedade:</span>
                  <span className="detail-value">{talhao.id_propriedade}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="talhao-sections">
            <div className="section-card">
              <div className="section-header">
                <h3>📊 Safras e Condições Climáticas</h3>
                <div className="safras-count">
                  <span>Mostrando {safrasExibidas.length} de {safrasComCondicoes.length} safras</span>
                </div>
              </div>
              {safrasComCondicoes.length === 0 ? (
                <div className="no-data">
                  <p>Nenhuma safra registrada para este talhão</p>
                </div>
              ) : (
                <div className="safras-container">
                  <div className="safras-list">
                    {safrasExibidas.map((safra) => (
                      <div key={safra.id_safra} className="safra-item">
                        <div className="safra-info">
                          <h4>Safra #{safra.id_safra}</h4>
                          <div className="safra-details">
                            <div className="safra-basic-info">
                              <p><strong>Data de Plantio:</strong> {new Date(safra.dt_plantio).toLocaleDateString('pt-BR')}</p>
                              <p><strong>Data de Colheita:</strong> {new Date(safra.dt_colheita).toLocaleDateString('pt-BR')}</p>
                              <p><strong>Produção:</strong> {safra.producao} ton</p>
                              <p><strong>Variedade/Cultura ID:</strong> {safra.id_variedade_cultura}</p>
                            </div>
                            
                            {safra.condicaoClimatica ? (
                              <div className="condicao-climatica-info">
                                <h5>🌤️ Condições Climáticas</h5>
                                <div className="condicao-grid">
                                  <div className="condicao-item">
                                    <span className="condicao-label">Precipitação:</span>
                                    <span className="condicao-value">{safra.condicaoClimatica.precipitacao_mm}mm</span>
                                  </div>
                                  <div className="condicao-item">
                                    <span className="condicao-label">Distribuição de Chuva:</span>
                                    <span className="condicao-value">{safra.condicaoClimatica.distribuicao_chuva_nota}/10</span>
                                  </div>
                                  <div className="condicao-item">
                                    <span className="condicao-label">Velocidade do Vento:</span>
                                    <span className="condicao-value">{safra.condicaoClimatica.velocidade_vento_kmh} km/h</span>
                                  </div>
                                  <div className="condicao-item">
                                    <span className="condicao-label">Temperatura Média:</span>
                                    <span className="condicao-value">{safra.condicaoClimatica.temperatura_media_c}°C</span>
                                  </div>
                                </div>
                                {safra.condicaoClimatica.observacoes && (
                                  <div className="condicao-observacoes">
                                    <span className="condicao-label">Observações:</span>
                                    <p>{safra.condicaoClimatica.observacoes}</p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="no-condicao">
                                <p>⚠️ Nenhuma condição climática registrada para esta safra</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {!todasSafrasCarregadas && safrasComCondicoes.length > 10 && (
                    <div className="load-more-container">
                      <button className="load-more-btn" onClick={carregarMaisSafras}>
                        📄 Carregar mais 10 safras
                      </button>
                    </div>
                  )}
                  
                  {todasSafrasCarregadas && safrasComCondicoes.length > 10 && (
                    <div className="all-safras-loaded">
                      <p>✅ Todas as {safrasComCondicoes.length} safras foram carregadas</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalhaoDetalhes; 