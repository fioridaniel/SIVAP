import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Talhao.css';

const AdicionarSafra = () => {
  const { idPropriedade, idTalhao, idSafra } = useParams();
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

  // Estados para edição
  const [isEditing, setIsEditing] = useState(false);
  const [existingCondicaoId, setExistingCondicaoId] = useState(null);

  useEffect(() => {
    // Fallback para buscar propriedade se não estiver no state
    if (!propriedade && idPropriedade) {
      fetch(`http://localhost:8080/propriedades/${idPropriedade}`)
        .then(res => res.json())
        .then(data => setPropriedade(data));
    }
    // Fallback para buscar talhao se não estiver no state
    if (!talhao && idPropriedade && idTalhao) {
      fetch(`http://localhost:8080/talhoes/${idPropriedade}/${idTalhao}`)
        .then(res => res.json())
        .then(data => setTalhao(data));
    }
    // Recuperar cpfUsuario do localStorage se não estiver no state
    if (!cpfUsuario) {
      const cpf = localStorage.getItem('cpfUsuario');
      if (cpf) setCpfUsuario(cpf);
    }
    if (location.state?.propriedade) {
      setPropriedade(location.state.propriedade);
    }
    if (location.state?.talhao) {
      setTalhao(location.state.talhao);
    }
    if (location.state?.cpfUsuario) {
      setCpfUsuario(location.state.cpfUsuario);
      localStorage.setItem('cpfUsuario', location.state.cpfUsuario);
    }
    if (location.state?.safra) {
      // Se há uma safra no estado, estamos editando
      setIsEditing(true);
      const safra = location.state.safra;
      setSafraData({
        dt_plantio: safra.dt_plantio,
        dt_colheita: safra.dt_colheita,
        producao: safra.producao.toString(),
        id_variedade_cultura: safra.id_variedade_cultura.toString()
      });
      
      if (safra.condicaoClimatica) {
        setCondicaoData({
          precipitacao_mm: safra.condicaoClimatica.precipitacao_mm.toString(),
          distribuicao_chuva_nota: safra.condicaoClimatica.distribuicao_chuva_nota.toString(),
          velocidade_max_vento_kmh: safra.condicaoClimatica.velocidade_vento_kmh.toString(),
          temperatura_media_c: safra.condicaoClimatica.temperatura_media_c.toString(),
          observacoes: safra.condicaoClimatica.observacoes || ''
        });
        setExistingCondicaoId(safra.condicaoClimatica.id_condicao_climatica);
      }
    }
    fetchVariedadesCultura();
  }, [location.state, propriedade, talhao, cpfUsuario, idPropriedade, idTalhao]);

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

    let safraPayload = null;
    let condicaoPayload = null;

    try {
      if (isEditing) {
        safraPayload = {
          ...safraData,
          id_propriedade: propriedade.id,
          id_talhao: parseInt(idTalhao),
          producao: safraData.producao ? parseFloat(safraData.producao) : null,
          id_variedade_cultura: safraData.id_variedade_cultura ? parseInt(safraData.id_variedade_cultura) : null,
          dt_plantio: safraData.dt_plantio || null,
          dt_colheita: safraData.dt_colheita || null
        };

        const safraResponse = await fetch(`http://localhost:8080/safras/${location.state.safra.id_safra}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(safraPayload)
        });

        if (!safraResponse.ok) {
          const errorData = await safraResponse.json().catch(() => ({ message: 'Não foi possível ler a resposta do erro.' }));
          throw new Error(`Erro ao atualizar safra: ${errorData.message || safraResponse.statusText}`);
        }

        // Atualizar ou criar condição climática
        condicaoPayload = {
          id_safra: location.state.safra.id_safra,
          precipitacao_mm: condicaoData.precipitacao_mm ? parseFloat(condicaoData.precipitacao_mm) : null,
          distribuicao_chuva_nota: condicaoData.distribuicao_chuva_nota ? parseInt(condicaoData.distribuicao_chuva_nota) : null,
          velocidade_max_vento_kmh: condicaoData.velocidade_max_vento_kmh ? parseFloat(condicaoData.velocidade_max_vento_kmh) : null,
          temperatura_media_c: condicaoData.temperatura_media_c ? parseFloat(condicaoData.temperatura_media_c) : null,
          observacoes: condicaoData.observacoes || null
        };

        const condicaoUrl = existingCondicaoId 
          ? `http://localhost:8080/condicoes-climaticas/${existingCondicaoId}`
          : 'http://localhost:8080/condicoes-climaticas';
        
        const condicaoMethod = existingCondicaoId ? 'PUT' : 'POST';

        const condicaoResponse = await fetch(condicaoUrl, {
          method: condicaoMethod,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(condicaoPayload)
        });

        if (!condicaoResponse.ok) {
          const errorData = await condicaoResponse.json().catch(() => ({ message: 'Não foi possível ler a resposta do erro.' }));
          throw new Error(`Erro ao atualizar condição climática: ${errorData.message || condicaoResponse.statusText}`);
        }

        setSuccess('Safra e condição climática atualizadas com sucesso!');
      } else {
        safraPayload = {
          ...safraData,
          id_propriedade: propriedade.id,
          id_talhao: parseInt(idTalhao),
          producao: safraData.producao ? parseFloat(safraData.producao) : null,
          id_variedade_cultura: safraData.id_variedade_cultura ? parseInt(safraData.id_variedade_cultura) : null,
          dt_plantio: safraData.dt_plantio || null,
          dt_colheita: safraData.dt_colheita || null
        };

        let safraCriada = null;
        let safraErro = null;
        try {
          const safraResponse = await fetch('http://localhost:8080/safras', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(safraPayload)
          });

          if (safraResponse.ok) {
            safraCriada = await safraResponse.json();
          } else {
            safraErro = await safraResponse.json().catch(() => ({ message: 'Não foi possível ler a resposta do erro.' }));
            // Tentar extrair id_safra da resposta, se possível
            safraCriada = safraErro && safraErro.id_safra ? safraErro : null;
            throw new Error(`Erro ao criar safra: ${safraErro.message || safraResponse.statusText}`);
          }
        } catch (safraError) {
          // Se a resposta do backend contiver id_safra, tentar cadastrar condição climática
          if (safraCriada && safraCriada.id_safra) {
            setError('Erro ao cadastrar safra, mas id_safra foi retornado. Tentando cadastrar condição climática...');
          } else {
            throw safraError;
          }
        }

        // Se safraCriada existe e tem id_safra, tentar cadastrar condição climática
        if (safraCriada && safraCriada.id_safra) {
          condicaoPayload = {
            id_safra: safraCriada.id_safra,
            precipitacao_mm: condicaoData.precipitacao_mm ? parseFloat(condicaoData.precipitacao_mm) : null,
            distribuicao_chuva_nota: condicaoData.distribuicao_chuva_nota ? parseInt(condicaoData.distribuicao_chuva_nota) : null,
            velocidade_max_vento_kmh: condicaoData.velocidade_max_vento_kmh ? parseFloat(condicaoData.velocidade_max_vento_kmh) : null,
            temperatura_media_c: condicaoData.temperatura_media_c ? parseFloat(condicaoData.temperatura_media_c) : null,
            observacoes: condicaoData.observacoes || null
          };
          try {
            const condicaoResponse = await fetch('http://localhost:8080/condicoes-climaticas', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(condicaoPayload)
            });
            if (!condicaoResponse.ok) {
              const errorData = await condicaoResponse.json().catch(() => ({ message: 'Não foi possível ler a resposta do erro.' }));
              throw new Error(`Erro ao criar condição climática: ${errorData.message || condicaoResponse.statusText}`);
            }
            setSuccess('Safra e condição climática cadastradas com sucesso!');
          } catch (condError) {
            let errorMsg = 'Erro ao cadastrar condição climática:';
            if (condError && condError.message) errorMsg += ' ' + condError.message;
            errorMsg += '\n\nPayload Condição Climática:\n' + JSON.stringify(condicaoPayload, null, 2);
            setError(errorMsg);
            console.error(errorMsg);
            return;
          }
        }
      }
      
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
      let errorMsg = 'Erro ao cadastrar:';
      if (error && error.message) errorMsg += ' ' + error.message;
      errorMsg += '\n\nPayload Safra:\n' + JSON.stringify(safraPayload, null, 2);
      if (condicaoPayload) {
        errorMsg += '\n\nPayload Condição Climática:\n' + JSON.stringify(condicaoPayload, null, 2);
      }
      setError(errorMsg);
      console.error(errorMsg);
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
          <h1>🌾 {isEditing ? 'Editar Safra e Condição Climática' : 'Adicionar Safra e Condição Climática'}</h1>
          <p className="header-subtitle">
            {isEditing ? 'Edite os dados da safra e suas condições climáticas' : 'Cadastre uma nova safra com suas condições climáticas'}
          </p>
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
                    placeholder="Digite a produção em toneladas"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="id_variedade_cultura">Variedade da Cultura:</label>
                  <select
                    id="id_variedade_cultura"
                    name="id_variedade_cultura"
                    value={safraData.id_variedade_cultura}
                    onChange={handleSafraChange}
                    required
                  >
                    <option value="">Selecione uma variedade</option>
                    {variedadesCultura.map(variedade => (
                      <option key={variedade.id_variedade_cultura} value={variedade.id_variedade_cultura}>
                        {variedade.descricao}
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
                    placeholder="Digite a precipitação em mm"
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
                    placeholder="Avalie a distribuição de 1 a 10"
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
                    placeholder="Digite a velocidade do vento"
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
                    placeholder="Digite a temperatura média"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="observacoes">Observações (opcional):</label>
                  <textarea
                    id="observacoes"
                    name="observacoes"
                    value={condicaoData.observacoes}
                    onChange={handleCondicaoChange}
                    placeholder="Observações adicionais sobre as condições climáticas..."
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="primary-btn"
                disabled={isLoading}
              >
                {isLoading ? (isEditing ? 'Atualizando...' : 'Cadastrando...') : (isEditing ? 'Atualizar Safra' : 'Cadastrar Safra')}
              </button>
              <button 
                type="button" 
                className="secondary-btn"
                onClick={handleBackToTalhao}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdicionarSafra; 