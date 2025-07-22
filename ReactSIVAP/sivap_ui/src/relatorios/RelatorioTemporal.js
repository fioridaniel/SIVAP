import React, { useState, useEffect } from 'react';
import TabelaRelatorio from './TabelaRelatorio';

const RelatorioTemporal = () => {
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
      
      const response = await fetch('http://localhost:8080/api/relatorios/temporal');
      
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
      console.error('Erro ao buscar dados do relatório temporal:', error);
      setErro(error.message || 'Erro ao carregar dados do relatório. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatarAno = (valor) => {
    if (valor === null || valor === undefined) return '-';
    return valor.toString();
  };

  const formatarProducaoTotal = (valor) => {
    if (valor === null || valor === undefined) return '-';
    return `${Number(valor).toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })} kg`;
  };

  const formatarProducaoMedia = (valor) => {
    if (valor === null || valor === undefined) return '-';
    return `${Number(valor).toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })} kg`;
  };

  const formatarTotalSafras = (valor) => {
    if (valor === null || valor === undefined) return '-';
    return `${Number(valor).toLocaleString('pt-BR')} safra${Number(valor) !== 1 ? 's' : ''}`;
  };

  const colunas = [
    { 
      key: 'ano', 
      label: 'Ano',
      format: formatarAno
    },
    { 
      key: 'producao_total', 
      label: 'Produção Total',
      format: formatarProducaoTotal
    },
    { 
      key: 'producao_media', 
      label: 'Produção Média',
      format: formatarProducaoMedia
    },
    { 
      key: 'total_safras', 
      label: 'Número de Safras',
      format: formatarTotalSafras
    }
  ];

  return (
    <TabelaRelatorio
      dados={dados}
      colunas={colunas}
      titulo="Relatório de Produção por Ano"
      loading={loading}
      erro={erro}
    />
  );
};

export default RelatorioTemporal;