import React, { useState, useEffect } from 'react';
import TabelaRelatorio from './TabelaRelatorio';

const RelatorioResistencia = () => {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    try {
      setLoading(true);
      setErro(null);
      
      const response = await fetch('http://localhost:8080/api/relatorios/resistencia');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.erro || 'Erro ao carregar dados do relatório';
        const errorDetails = errorData.detalhes || 'Tente novamente mais tarde';
        throw new Error(`${errorMessage}. ${errorDetails}`);
      }
      
      const data = await response.json();
      
      // Verificar se a resposta é um erro mesmo com status 200
      if (data.erro) {
        const errorMessage = data.erro || 'Erro ao carregar dados do relatório';
        const errorDetails = data.detalhes || 'Tente novamente mais tarde';
        throw new Error(`${errorMessage}. ${errorDetails}`);
      }
      
      setDados(data);
    } catch (error) {
      console.error('Erro ao buscar dados do relatório de resistência:', error);
      setErro(error.message || 'Erro ao carregar dados do relatório. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatarResistencia = (valor) => {
    if (valor === null || valor === undefined) return '-';
    const num = Number(valor);
    let classe = '';
    let texto = '';
    
    if (num >= 8) {
      classe = 'resistencia-alta';
      texto = 'Alta';
    } else if (num >= 6) {
      classe = 'resistencia-media';
      texto = 'Média';
    } else {
      classe = 'resistencia-baixa';
      texto = 'Baixa';
    }
    
    return (
      <span className={classe}>
        {texto} ({num.toFixed(1)})
      </span>
    );
  };

  const formatarProdutividade = (valor) => {
    if (valor === null || valor === undefined) return '-';
    const num = Number(valor);
    let classe = '';
    
    if (num >= 8) {
      classe = 'produtividade-alta';
    } else if (num >= 6) {
      classe = 'produtividade-media';
    } else {
      classe = 'produtividade-baixa';
    }
    
    return (
      <span className={classe}>
        {num.toFixed(1)}/10
      </span>
    );
  };

  const colunas = [
    { 
      key: 'variedade', 
      label: 'Variedade' 
    },
    { 
      key: 'resistencia_seca', 
      label: 'Resistência à Seca',
      format: formatarResistencia
    },
    { 
      key: 'resistencia_pragas', 
      label: 'Resistência a Pragas',
      format: formatarResistencia
    },
    { 
      key: 'produtividade_nota', 
      label: 'Nota de Produtividade',
      format: formatarProdutividade
    }
  ];

  return (
    <>
      <style>
        {`
          .resistencia-alta, .produtividade-alta {
            background: linear-gradient(135deg, #4caf50, #388e3c);
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.9rem;
          }
          .resistencia-media, .produtividade-media {
            background: linear-gradient(135deg, #ff9800, #f57c00);
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.9rem;
          }
          .resistencia-baixa, .produtividade-baixa {
            background: linear-gradient(135deg, #f44336, #d32f2f);
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.9rem;
          }
        `}
      </style>
      <TabelaRelatorio
        dados={dados}
        colunas={colunas}
        titulo="Relatório de Resistência de Variedades"
        loading={loading}
        erro={erro}
      />
    </>
  );
};

export default RelatorioResistencia;