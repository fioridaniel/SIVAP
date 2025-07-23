import React, { useState, useEffect } from 'react';
import TabelaRelatorio from './TabelaRelatorio';

const RelatorioProdutores = () => {
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
      
      const response = await fetch('http://localhost:8080/api/relatorios/produtores');
      
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
      console.error('Erro ao buscar dados do relatório de produtores:', error);
      setErro(error.message || 'Erro ao carregar dados do relatório. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatarNumeroPropriedades = (valor) => {
    if (valor === null || valor === undefined) return '-';
    return `${Number(valor).toLocaleString('pt-BR')} propriedade${Number(valor) !== 1 ? 's' : ''}`;
  };

  const formatarTotalSafras = (valor) => {
    if (valor === null || valor === undefined) return '-';
    const num = Number(valor);
    return (
      <span className={num > 5 ? 'destaque-alto' : num > 3 ? 'destaque-medio' : ''}>
        {num.toLocaleString('pt-BR')} safra{num !== 1 ? 's' : ''}
      </span>
    );
  };

  const colunas = [
    { 
      key: 'produtor', 
      label: 'Produtor' 
    },
    { 
      key: 'num_propriedades', 
      label: 'Número de Propriedades',
      format: formatarNumeroPropriedades
    },
    { 
      key: 'total_safras', 
      label: 'Total de Safras',
      format: formatarTotalSafras
    }
  ];

  return (
    <>
      <style>
        {`
          .destaque-alto {
            background: linear-gradient(135deg, #4caf50, #388e3c);
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.9rem;
          }
          .destaque-medio {
            background: linear-gradient(135deg, #8bc34a, #689f38);
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
        titulo="Relatório de Produtores Mais Ativos"
        loading={loading}
        erro={erro}
      />
    </>
  );
};

export default RelatorioProdutores;