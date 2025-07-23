import React, { useState, useEffect } from 'react';
import TabelaRelatorio from './TabelaRelatorio';

const RelatorioClimatico = () => {
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
      
      const response = await fetch('http://localhost:8080/api/relatorios/climatico');
      
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
      console.error('Erro ao buscar dados do relatório climático:', error);
      setErro(error.message || 'Erro ao carregar dados do relatório. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatarTemperatura = (valor) => {
    if (valor === null || valor === undefined) return '-';
    return `${Number(valor).toLocaleString('pt-BR', { 
      minimumFractionDigits: 1, 
      maximumFractionDigits: 1 
    })}°C`;
  };

  const formatarPrecipitacao = (valor) => {
    if (valor === null || valor === undefined) return '-';
    return `${Number(valor).toLocaleString('pt-BR', { 
      minimumFractionDigits: 1, 
      maximumFractionDigits: 1 
    })} mm`;
  };

  const formatarProducaoMedia = (valor) => {
    if (valor === null || valor === undefined) return '-';
    return `${Number(valor).toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })} kg`;
  };

  const colunas = [
    { 
      key: 'nome_cultura', 
      label: 'Cultura' 
    },
    { 
      key: 'temp_media', 
      label: 'Temperatura Média',
      format: formatarTemperatura
    },
    { 
      key: 'precipitacao_media', 
      label: 'Precipitação Média',
      format: formatarPrecipitacao
    },
    { 
      key: 'producao_media', 
      label: 'Produção Média',
      format: formatarProducaoMedia
    }
  ];

  return (
    <TabelaRelatorio
      dados={dados}
      colunas={colunas}
      titulo="Relatório de Condições Climáticas Médias"
      loading={loading}
      erro={erro}
    />
  );
};

export default RelatorioClimatico;