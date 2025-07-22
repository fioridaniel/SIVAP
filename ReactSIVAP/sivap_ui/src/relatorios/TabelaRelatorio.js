import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TabelaRelatorio.css';

const TabelaRelatorio = ({ dados, colunas, titulo, loading = false, erro = null }) => {
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="relatorio-container">
        <div className="relatorio-header">
          <div className="header-top">
            <button className="back-btn" onClick={() => navigate('/propriedades')}>
              ← Voltar
            </button>
            <h1>{titulo}</h1>
          </div>
        </div>
        <div className="relatorio-content">
          <div className="loading">
            <div className="loading-icon">Carregando...</div>
            <p>Carregando dados do relatório...</p>
          </div>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="relatorio-container">
        <div className="relatorio-header">
          <div className="header-top">
            <button className="back-btn" onClick={() => navigate('/propriedades')}>
              ← Voltar
            </button>
            <h1>{titulo}</h1>
          </div>
        </div>
        <div className="relatorio-content">
          <div className="error">
            <div className="error-icon">⚠️</div>
            <h3>Erro ao carregar relatório</h3>
            <p className="error-message">{erro}</p>
            <div className="error-actions">
              <button 
                className="retry-btn" 
                onClick={() => window.location.reload()}
              >
                Tentar Novamente
              </button>
              <button 
                className="back-btn-error" 
                onClick={() => navigate('/propriedades')}
              >
                Voltar ao Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relatorio-container">
      <div className="relatorio-header">
        <div className="header-top">
          <button className="back-btn" onClick={() => navigate('/propriedades')}>
            ← Voltar
          </button>
          <h1>{titulo}</h1>
        </div>
        <p className="header-subtitle">
          {dados.length === 0 ? 'Nenhum dado encontrado' : `${dados.length} registro${dados.length !== 1 ? 's' : ''} encontrado${dados.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      <div className="relatorio-content">
        {dados.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">📊</div>
            <h3>Nenhum dado disponível</h3>
            <p>Não há dados para exibir neste relatório no momento.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="relatorio-table">
              <thead>
                <tr>
                  {colunas.map(coluna => (
                    <th key={coluna.key}>{coluna.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dados.map((item, index) => (
                  <tr key={index}>
                    {colunas.map(coluna => (
                      <td key={coluna.key}>
                        {coluna.format ? coluna.format(item[coluna.key]) : item[coluna.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabelaRelatorio;