import React, { useState, useEffect } from 'react';
import TabelaRelatorio from './TabelaRelatorio';

const RelatorioProdutividade = () => {
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
      
      const response = await fetch('http://localhost:8080/api/relatorios/produtividade');
      
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
      console.error('Erro ao buscar dados do relatório de produtividade:', error);
      setErro(error.message || 'Erro ao carregar dados do relatório. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatarNumero = (valor) => {
    if (valor === null || valor === undefined) return '-';
    return Number(valor).toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  const formatarArea = (valor) => {
    if (valor === null || valor === undefined) return '-';
    return `${Number(valor).toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })} ha`;
  };

  const formatarProducao = (valor) => {
    if (valor === null || valor === undefined) return '-';
    return `${Number(valor).toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })} kg`;
  };

  const formatarProdutividade = (valor) => {
    if (valor === null || valor === undefined) return '-';
    return `${Number(valor).toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })} kg/ha`;
  };

  const colunas = [
    { 
      key: 'propriedade', 
      label: 'Propriedade' 
    },
    { 
      key: 'producao_total', 
      label: 'Produção Total',
      format: formatarProducao
    },
    { 
      key: 'area', 
      label: 'Área',
      format: formatarArea
    },
    { 
      key: 'produtividade', 
      label: 'Produtividade',
      format: formatarProdutividade
    }
  ];

  return (
    <TabelaRelatorio
      dados={dados}
      colunas={colunas}
      titulo="Relatório de Produtividade por Propriedade"
      loading={loading}
      erro={erro}
    />
  );
};

export default RelatorioProdutividade;