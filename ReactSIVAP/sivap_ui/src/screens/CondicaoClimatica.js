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
  
  // Estados para edição
  const [editingCondicao, setEditingCondicao] = useState(null);
  const [editIdSafra, setEditIdSafra] = useState('');
  const [editPrecipitacaoMm, setEditPrecipitacaoMm] = useState('');
  const [editDistribuicaoChuvaNota, setEditDistribuicaoChuvaNota] = useState('');
  const [editVelocidadeVentoKmh, setEditVelocidadeVentoKmh] = useState('');
  const [editTemperaturaMediaC, setEditTemperaturaMediaC] = useState('');
  const [editObservacoes, setEditObservacoes] = useState('');
  
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

    if(!idSafra || !precipitacaoMm || !distribuicaoChuvaNota || !velocidadeVentoKmh || !temperaturaMediaC) {
      alert("Preencha todos os campos obrigatórios para enviar os dados");
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
          observacoes: observacoes || null
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
      `Tem certeza que deseja deletar a condição climática da Safra #${condicao.id_safra}?\n\n` +
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
        alert('Erro ao deletar condição climática.');
      }
    } catch (error) {
      console.error('Erro ao deletar condição climática:', error);
      alert('Erro de conexão com o servidor');
    }
  };

  const handleEditCondicao = (condicao, event) => {
    event.stopPropagation();
    setEditingCondicao(condicao);
    setEditIdSafra(condicao.id_safra.toString());
    setEditPrecipitacaoMm(condicao.precipitacao_mm.toString());
    setEditDistribuicaoChuvaNota(condicao.distribuicao_chuva_nota.toString());
    setEditVelocidadeVentoKmh(condicao.velocidade_vento_kmh.toString());
    setEditTemperaturaMediaC(condicao.temperatura_media_c.toString());
    setEditObservacoes(condicao.observacoes || '');
  };

  const handleUpdateCondicao = async (event) => {
    event.preventDefault();

    if(!editIdSafra || !editPrecipitacaoMm || !editDistribuicaoChuvaNota || !editVelocidadeVentoKmh || !editTemperaturaMediaC) {
      alert("Preencha todos os campos obrigatórios para atualizar os dados");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/condicoes-climaticas/${editingCondicao.id_condicao_climatica}`, {
        method:'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_safra: parseInt(editIdSafra),
          precipitacao_mm: parseFloat(editPrecipitacaoMm),
          distribuicao_chuva_nota: parseInt(editDistribuicaoChuvaNota),
          velocidade_vento_kmh: parseFloat(editVelocidadeVentoKmh),
          temperatura_media_c: parseFloat(editTemperaturaMediaC),
          observacoes: editObservacoes || null
        })
      });
      
      if (response.ok) {
        alert("Condição climática atualizada com sucesso!");
        // Limpar formulário de edição
        setEditIdSafra('');
        setEditPrecipitacaoMm('');
        setEditDistribuicaoChuvaNota('');
        setEditVelocidadeVentoKmh('');
        setEditTemperaturaMediaC('');
        setEditObservacoes('');
        setEditingCondicao(null);
        fetchCondicoes(); // Recarregar a lista
      } else {
        alert("Erro ao atualizar condição climática");
      }
    }
    catch(error) {
      console.log("erro ao processar request: " + error);
      alert("Erro de conexão com o servidor");
    }
  };

  const handleCancelEdit = () => {
    setEditingCondicao(null);
    setEditIdSafra('');
    setEditPrecipitacaoMm('');
    setEditDistribuicaoChuvaNota('');
    setEditVelocidadeVentoKmh('');
    setEditTemperaturaMediaC('');
    setEditObservacoes('');
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>Carregando...</div>
        <p>Carregando condições climáticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>Erro</div>
        <p>{error}</p>
        <button onClick={fetchCondicoes}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#1976d2', marginBottom: '30px' }}>Gestão de Condições Climáticas</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Formulário */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#1976d2', marginBottom: '20px' }}>Cadastrar Nova Condição Climática</h2>
          
          <form onSubmit={sendForm} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                ID da Safra:
                <input 
                  type="number" 
                  min="1"
                  value={idSafra}
                  onChange={(e) => setIdSafra(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                  placeholder="Digite o ID da safra"
                  required
                />
              </label>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Precipitação (mm):
                  <input 
                    type="number" 
                    step="0.1"
                    min="0"
                    value={precipitacaoMm}
                    onChange={(e) => setPrecipitacaoMm(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    required
                  />
                </label>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Distribuição de Chuva (1-10):
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
                  Velocidade do Vento (km/h):
                  <input 
                    type="number" 
                    step="0.1"
                    min="0"
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
                Observações (opcional):
                <textarea 
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', minHeight: '80px' }}
                  placeholder="Observações adicionais sobre as condições climáticas..."
                />
              </label>
            </div>
            
            <button 
              type="submit"
              style={{
                background: '#1976d2',
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

          {editingCondicao && (
            <div style={{ marginTop: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '10px', border: '2px solid #1976d2' }}>
              <h3 style={{ color: '#1976d2', marginBottom: '20px' }}>Editar Condição Climática</h3>
              
              <form onSubmit={handleUpdateCondicao} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    ID da Safra:
                    <input 
                      type="number" 
                      min="1"
                      value={editIdSafra}
                      onChange={(e) => setEditIdSafra(e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                      placeholder="Digite o ID da safra"
                      required
                    />
                  </label>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Precipitação (mm):
                      <input 
                        type="number" 
                        step="0.1"
                        min="0"
                        value={editPrecipitacaoMm}
                        onChange={(e) => setEditPrecipitacaoMm(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                        required
                      />
                    </label>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Distribuição de Chuva (1-10):
                      <input 
                        type="number" 
                        min="1" 
                        max="10"
                        value={editDistribuicaoChuvaNota}
                        onChange={(e) => setEditDistribuicaoChuvaNota(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                        required
                      />
                    </label>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                      Velocidade do Vento (km/h):
                      <input 
                        type="number" 
                        step="0.1"
                        min="0"
                        value={editVelocidadeVentoKmh}
                        onChange={(e) => setEditVelocidadeVentoKmh(e.target.value)}
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
                        value={editTemperaturaMediaC}
                        onChange={(e) => setEditTemperaturaMediaC(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                        required
                      />
                    </label>
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Observações (opcional):
                    <textarea 
                      value={editObservacoes}
                      onChange={(e) => setEditObservacoes(e.target.value)}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', minHeight: '80px' }}
                      placeholder="Observações adicionais sobre as condições climáticas..."
                    />
                  </label>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    type="submit"
                    style={{
                      background: '#1976d2',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    Atualizar Condição Climática
                  </button>
                  <button 
                    type="button"
                    onClick={handleCancelEdit}
                    style={{
                      background: '#666',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Lista de Condições Climáticas */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#1976d2', marginBottom: '20px' }}>Condições Climáticas Cadastradas</h2>
          
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
                    alignItems: 'center',
                    padding: '12px',
                    background: '#f9f9f9',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', color: '#1976d2' }}>
                      Safra #{condicao.id_safra}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      Precipitação: {condicao.precipitacao_mm}mm | 
                      Distribuição: {condicao.distribuicao_chuva_nota}/10
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      Vento: {condicao.velocidade_vento_kmh} km/h | 
                      Temperatura: {condicao.temperatura_media_c}°C
                    </div>
                    {condicao.observacoes && (
                      <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>
                        Obs: {condicao.observacoes}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button 
                      onClick={(e) => handleEditCondicao(condicao, e)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '50%',
                        color: '#1976d2',
                        opacity: '0.7',
                        transition: 'all 0.3s ease'
                      }}
                      title="Editar condição climática"
                    >
                      ✏️
                    </button>
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
                        transition: 'all 0.3s ease'
                      }}
                      title="Deletar condição climática"
                    >
                      🗑️
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
}

export default CondicaoClimatica;