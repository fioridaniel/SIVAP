import React, { useState, useEffect } from 'react';
import TabelaRelatorio from './TabelaRelatorio';

const RelatorioVariedades = () => {
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
      
      const response = await fetch('http://localhost:8080/api/relatorios/variedades');
      
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
      console.error('Erro ao buscar dados do relatório de variedades:', error);
      setErro(error.message || 'Erro ao carregar dados do relatório. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatarQuantidade = (valor) => {
    if (valor === null || valor === undefined) return '-';
    return `${Number(valor).toLocaleString('pt-BR')} plantio${Number(valor) !== 1 ? 's' : ''}`;
  };

  const colunas = [
    { 
      key: 'nome_cultura', 
      label: 'Cultura' 
    },
    { 
      key: 'variedade', 
      label: 'Variedade' 
    },
    { 
      key: 'total_plantios', 
      label: 'Total de Plantios',
      format: formatarQuantidade
    }
  ];

  return (
    <TabelaRelatorio
      dados={dados}
      colunas={colunas}
      titulo="Relatório de Variedades Mais Plantadas"
      loading={loading}
      erro={erro}
    />
  );
};

export default RelatorioVariedades;