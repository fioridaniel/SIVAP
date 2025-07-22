import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RelatoriosPretendidos.css';

const RelatoriosPretendidos = () => {
  const navigate = useNavigate();

  const relatorios = [
    {
      titulo: 'Relatório de Produtividade por Propriedade',
      descricao: 'Análise da produtividade de cada propriedade rural',
      rota: '/relatorios/produtividade'
    },
    {
      titulo: 'Relatório de Variedades Mais Plantadas',
      descricao: 'Ranking das variedades mais cultivadas',
      rota: '/relatorios/variedades'
    },
    {
      titulo: 'Relatório de Produção por Ano',
      descricao: 'Evolução temporal da produção agrícola',
      rota: '/relatorios/temporal'
    },
    {
      titulo: 'Relatório de Condições Climáticas',
      descricao: 'Análise do impacto climático na produção',
      rota: '/relatorios/climatico'
    },
    {
      titulo: 'Relatório de Produtores Mais Ativos',
      descricao: 'Produtores com maior número de safras',
      rota: '/relatorios/produtores'
    },
    {
      titulo: 'Relatório de Resistência de Variedades',
      descricao: 'Comparação de resistência entre variedades',
      rota: '/relatorios/resistencia'
    }
  ];

  return (
    <div className="relatorios-container">
      <div className="relatorios-header">
        <button className="back-btn" onClick={() => navigate('/propriedades')}>
          ← Voltar
        </button>
        <h1>Relatórios do Sistema SIVAP</h1>
        <p>Selecione um relatório para visualizar</p>
      </div>

      <div className="relatorios-grid">
        {relatorios.map((relatorio, index) => (
          <div 
            key={index} 
            className="relatorio-card"
            onClick={() => navigate(relatorio.rota)}
          >
            <h3>{relatorio.titulo}</h3>
            <p>{relatorio.descricao}</p>
            <div className="card-arrow">→</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatoriosPretendidos;