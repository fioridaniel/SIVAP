import { useState, useEffect } from 'react';

const CondicaoClimatica = () => {
  const [idSafra, setIdSafra] = useState('');
  const [precipitacaoMm, setPrecipitacaoMm] = useState('');
  const [distribuicaoChuvaNota, setDistribuicaoChuvaNota] = useState('');
  const [velocidadeVentoKmh, setVelocidadeVentoKmh] = useState('');
  const [temperaturaMediaC, setTemperaturaMediaC] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [condicoes, setCondicoes] = useState([]);
  const [safras, setSafras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchCondicoes();
    fetchSafras();
  }, []);

  const fetchCondicoes = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:8080/condicoes-climaticas');
      
      if (response.ok) {
        const data = await response.json();
        setCondicoes(data);
      } else {
        setError('Erro ao carregar condições climáticas');
      }
    } catch (error) {
      console.error('Erro ao buscar condições climáticas:', error);
      setError('Erro de conexão com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSafras = async () => {
    try {
      const response = await fetch('http://localhost:8080/safras');
      if (response.ok) {
        const data = await response.json();
        setSafras(data);
      }
    } catch (error) {
      console.error('Erro ao buscar safras:', error);
    }
  };
  
  const sendForm = async (event) => {
    event.preventDefault();

    if(!idSafra || !precipitacaoMm || !distribuicaoChuvaNota || !velocidadeVentoKmh || !temperaturaMediaC || !observacoes) {
      alert("Preencha todos os campos para enviar os dados");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/condicoes-climaticas', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_safra: parseInt(idSafra),
          precipitacao_mm: parseFloat(precipitacaoMm),
          distribuicao_chuva_nota: parseInt(distribuicaoChuvaNota),
          velocidade_vento_kmh: parseFloat(velocidadeVentoKmh),
          temperatura_media_c: parseFloat(temperaturaMediaC),
          observacoes: observacoes
        })
      });
      
      if (response.ok) {
        alert("Condição climática cadastrada com sucesso!");
        // Limpar formulário
        setIdSafra('');
        setPrecipitacaoMm('');
        setDistribuicaoChuvaNota('');
        setVelocidadeVentoKmh('');
        setTemperaturaMediaC('');
        setObservacoes('');
        fetchCondicoes(); // Recarregar a lista
      } else {
        alert("Erro ao cadastrar condição climática");
      }
    }
    catch(error) {
      console.log("erro ao processar request: " + error);
      alert("Erro de conexão com o servidor");
    }
  };

  const handleDeleteCondicao = async (condicao, event) => {
    event.stopPropagation();
    
    const confirmacao = window.confirm(
      `Tem certeza que deseja deletar esta condição climática?\n\n` +
      `Esta ação irá deletar:\n` +
      `• A condição climática da safra #${condicao.id_safra}\n\n` +
      `Esta ação não pode ser desfeita!`
    );

    if (!confirmacao) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/condicoes-climaticas/${condicao.id_condicao_climatica}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Condição climática deletada com sucesso!');
        fetchCondicoes(); // Recarregar a lista
      } else {
        alert('Erro ao deletar condição climática. Verifique se não há dependências.');
      }
    } catch (error) {
      console.error('Erro ao deletar condição climática:', error);
      alert('Erro de conexão com o servidor');
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🌤️</div>
        <p>Carregando condições climáticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⚠️</div>
        <p>{error}</p>
        <button onClick={fetchCondicoes}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#388e3c', marginBottom: '30px' }}>🌤️ Gestão de Condições Climáticas</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Formulário */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#388e3c', marginBottom: '20px' }}>Cadastrar Nova Condição Climática</h2>
          
          <form onSubmit={sendForm} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Safra:
                <select 
                  value={idSafra}
                  onChange={(e) => setIdSafra(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                  required
                >
                  <option value="">Selecione uma safra</option>
                  {safras.map(safra => (
                    <option key={safra.id_safra} value={safra.id_safra}>
                      Safra #{safra.id_safra} - Talhão #{safra.id_talhao}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Precipitação (mm):
                  <input 
                    type="number" 
                    step="0.1"
                    value={precipitacaoMm}
                    onChange={(e) => setPrecipitacaoMm(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    required
                  />
                </label>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Distribuição Chuva (1-10):
                  <input 
                    type="number" 
                    min="1" 
                    max="10"
                    value={distribuicaoChuvaNota}
                    onChange={(e) => setDistribuicaoChuvaNota(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    required
                  />
                </label>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Velocidade Vento (km/h):
                  <input 
                    type="number" 
                    step="0.1"
                    value={velocidadeVentoKmh}
                    onChange={(e) => setVelocidadeVentoKmh(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    required
                  />
                </label>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Temperatura Média (°C):
                  <input 
                    type="number" 
                    step="0.1"
                    value={temperaturaMediaC}
                    onChange={(e) => setTemperaturaMediaC(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    required
                  />
                </label>
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Observações:
                <textarea 
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', minHeight: '80px', resize: 'vertical' }}
                  placeholder="Descreva observações sobre as condições climáticas..."
                  required
                />
              </label>
            </div>
            
            <button 
              type="submit"
              style={{
                background: '#388e3c',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Cadastrar Condição Climática
            </button>
          </form>
        </div>

        {/* Lista de Condições Climáticas */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#388e3c', marginBottom: '20px' }}>Condições Climáticas Cadastradas</h2>
          
          {condicoes.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              <p>Nenhuma condição climática cadastrada ainda.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {condicoes.map((condicao) => (
                <div 
                  key={condicao.id_condicao_climatica} 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    padding: '12px',
                    background: '#f9f9f9',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#388e3c', marginBottom: '5px' }}>
                      Safra #{condicao.id_safra}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
                      Precipitação: {condicao.precipitacao_mm}mm | 
                      Distribuição: {condicao.distribuicao_chuva_nota}/10
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
                      Vento: {condicao.velocidade_vento_kmh} km/h | 
                      Temperatura: {condicao.temperatura_media_c}°C
                    </div>
                    {condicao.observacoes && (
                      <div style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic' }}>
                        Obs: {condicao.observacoes}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={(e) => handleDeleteCondicao(condicao, e)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: '50%',
                      color: '#d32f2f',
                      opacity: '0.7',
                      transition: 'all 0.3s ease',
                      marginLeft: '10px'
                    }}
                    title="Deletar condição climática"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CondicaoClimatica;