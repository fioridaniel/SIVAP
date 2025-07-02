import { useState, useEffect } from "react";

const VariedadeCultura = () => {
  const [idCultura, setIdCultura] = useState('');
  const [descricao, setDescricao] = useState('');
  const [resistenciaSeca, setResistenciaSeca] = useState('');
  const [resistenciaPragas, setResistenciaPragas] = useState('');
  const [cicloVegetativoDias, setCicloVegetativoDias] = useState('');
  const [produtividadeNota, setProdutividadeNota] = useState('');
  const [variedades, setVariedades] = useState([]);
  const [culturas, setCulturas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchVariedades();
    fetchCulturas();
  }, []);

  const fetchVariedades = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:8080/variedades-cultura');
      
      if (response.ok) {
        const data = await response.json();
        setVariedades(data);
      } else {
        setError('Erro ao carregar variedades');
      }
    } catch (error) {
      console.error('Erro ao buscar variedades:', error);
      setError('Erro de conexão com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCulturas = async () => {
    try {
      const response = await fetch('http://localhost:8080/culturas');
      if (response.ok) {
        const data = await response.json();
        setCulturas(data);
      }
    } catch (error) {
      console.error('Erro ao buscar culturas:', error);
    }
  };
  
  const sendForm = async (event) => {
    event.preventDefault();

    if(!idCultura || !descricao || !resistenciaSeca || !resistenciaPragas || !cicloVegetativoDias || !produtividadeNota) {
      alert("Preencha todos os campos para enviar os dados");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/variedades-cultura', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_cultura: parseInt(idCultura),
          descricao: descricao,
          resistencia_seca: parseInt(resistenciaSeca),
          resistencia_pragas: parseInt(resistenciaPragas),
          ciclo_vegetativo_dias: parseInt(cicloVegetativoDias),
          produtividade_nota: parseInt(produtividadeNota)
        })
      });
      
      if (response.ok) {
        alert("Variedade cadastrada com sucesso!");
        // Limpar formulário
        setIdCultura('');
        setDescricao('');
        setResistenciaSeca('');
        setResistenciaPragas('');
        setCicloVegetativoDias('');
        setProdutividadeNota('');
        fetchVariedades(); // Recarregar a lista
      } else {
        alert("Erro ao cadastrar variedade");
      }
    }
    catch(error) {
      console.log("erro ao processar request: " + error);
      alert("Erro de conexão com o servidor");
    }
  };

  const handleDeleteVariedade = async (variedade, event) => {
    event.stopPropagation();
    
    const confirmacao = window.confirm(
      `Tem certeza que deseja deletar a variedade "${variedade.descricao}"?\n\n` +
      `Esta ação irá deletar:\n` +
      `• Todas as safras que usam esta variedade\n` +
      `• Todas as condições climáticas dessas safras\n\n` +
      `Esta ação não pode ser desfeita!`
    );

    if (!confirmacao) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/variedades-cultura/${variedade.id_variedade_cultura}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Variedade deletada com sucesso!');
        fetchVariedades(); // Recarregar a lista
      } else {
        alert('Erro ao deletar variedade. Verifique se não há dependências.');
      }
    } catch (error) {
      console.error('Erro ao deletar variedade:', error);
      alert('Erro de conexão com o servidor');
    }
  };

  const getCulturaNome = (idCultura) => {
    const cultura = culturas.find(c => c.id_cultura === idCultura);
    return cultura ? cultura.nome_cultura : `ID ${idCultura}`;
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🌱</div>
        <p>Carregando variedades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⚠️</div>
        <p>{error}</p>
        <button onClick={fetchVariedades}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#388e3c', marginBottom: '30px' }}>🌾 Gestão de Variedades de Cultura</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Formulário */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#388e3c', marginBottom: '20px' }}>Cadastrar Nova Variedade</h2>
          
          <form onSubmit={sendForm} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Cultura:
                <select 
                  value={idCultura}
                  onChange={(e) => setIdCultura(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                  required
                >
                  <option value="">Selecione uma cultura</option>
                  {culturas.map(cultura => (
                    <option key={cultura.id_cultura} value={cultura.id_cultura}>
                      {cultura.nome_cultura}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Descrição:
                <input 
                  type="text" 
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                  placeholder="Ex: Milho Híbrido BT"
                  required
                />
              </label>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Resistência à Seca (1-10):
                  <input 
                    type="number" 
                    min="1" 
                    max="10"
                    value={resistenciaSeca}
                    onChange={(e) => setResistenciaSeca(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    required
                  />
                </label>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Resistência a Pragas (1-10):
                  <input 
                    type="number" 
                    min="1" 
                    max="10"
                    value={resistenciaPragas}
                    onChange={(e) => setResistenciaPragas(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    required
                  />
                </label>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Ciclo Vegetativo (dias):
                  <input 
                    type="number" 
                    min="1"
                    value={cicloVegetativoDias}
                    onChange={(e) => setCicloVegetativoDias(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    required
                  />
                </label>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Produtividade (1-10):
                  <input 
                    type="number" 
                    min="1" 
                    max="10"
                    value={produtividadeNota}
                    onChange={(e) => setProdutividadeNota(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    required
                  />
                </label>
              </div>
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
              Cadastrar Variedade
            </button>
          </form>
        </div>

        {/* Lista de Variedades */}
        <div style={{ background: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#388e3c', marginBottom: '20px' }}>Variedades Cadastradas</h2>
          
          {variedades.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              <p>Nenhuma variedade cadastrada ainda.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {variedades.map((variedade) => (
                <div 
                  key={variedade.id_variedade_cultura} 
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
                    <div style={{ fontWeight: '600', color: '#388e3c' }}>
                      {variedade.descricao}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      Cultura: {getCulturaNome(variedade.id_cultura)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>
                      Resistência Seca: {variedade.resistencia_seca}/10 | 
                      Resistência Pragas: {variedade.resistencia_pragas}/10 | 
                      Produtividade: {variedade.produtividade_nota}/10
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteVariedade(variedade, e)}
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
                    title="Deletar variedade"
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

export default VariedadeCultura; 