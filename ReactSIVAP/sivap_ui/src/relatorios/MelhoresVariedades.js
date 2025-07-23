import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../styles/MelhoresVariedades.css';

/* seria interessante adicionar o nome da cultura do lado do ranking, fica menos obscuro. */
const MelhoresVariedades = () => {
    const [safras, setSafras] = useState([]);
    const [producaoTotalPorVariedade, setProducaoTotalPorVariedade] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setErro] = useState(null);

    const { idPropriedade } = useParams();

    useEffect(() => {
        pegarSafras();
    }, []);

    useEffect(() => {
        pegarProducaoPorSafraPorVariedade();
    }, [safras])

    /* obs: dados hardcoded so para testar com mais facilidade (nao sou burro)*/
    const pegarSafras = async () => {
        try { 
            const responseTalhoes = await fetch(`http://localhost:8080/talhoes/propriedade/${idPropriedade}`);
            if(responseTalhoes.ok) {
                const talhoes = await responseTalhoes.json();                
              
                const todasSafras = [];
                for(const talhao of talhoes) { /* loop que pega todos as safras de todos os talhoes dessa propriedade */
                    const idTalhao = talhao.id_talhao;
                    const responseSafras = await fetch(`http://localhost:8080/safras/talhao/${idTalhao}`);
                    if(responseSafras.ok) {
                        const safras = await responseSafras.json();
                        /* pegar o nome da variedade */
                        todasSafras.push(...safras); /* isso aqui evita ser um array de array, coloca tudo junto */
                    }
                }

                setSafras(todasSafras);
                pegarProducaoPorSafraPorVariedade(todasSafras);
            }
        } catch(error) {
            console.error('Erro ao carregar dados:', error);
            setErro('Erro ao carregar dados das safras');
        } finally {
            setLoading(false);
        }
    }
    
    const pegarProducaoPorSafraPorVariedade = async () => {
        const response = await fetch(`http://localhost:8080/variedades-cultura/com-producao/propriedade/${idPropriedade}`);
        const dados = await response.json();

        // dados sera algo como:
        // [
        //   [1, "soja", 1500.5],
        //   [3, "milho", 1200.0],
        //   [2, "feijao", 800.25]
        // ]

        // Transformar array [id, nome, valor] para objetos
        const dadosFormatados = dados.map(item => ({
            idVariedade: item[0],
            nomeCultura: item[1],
            mediaProducao: item[2]
        }));

        setProducaoTotalPorVariedade(dadosFormatados);
    };

    // Para o gráfico de barras
    const maxProdutividade = producaoTotalPorVariedade.length > 0 
        ? Math.max(...producaoTotalPorVariedade.map(t => t.mediaProducao))
        : 0;

    return(
        <div className="mv-container">
            <div className="mv-header">
                <h1 className="mv-title">Ranking de Melhores Variedades</h1>
                <p className="mv-subtitle">Média de produção por variedade de cultura</p>
            </div>

            {producaoTotalPorVariedade.length > 0 ? (
                <div className="mv-content">
                    {/* Gráfico de Barras */}
                    <div className="mv-chart-container">
                        <h2 className="mv-chart-title">Gráfico de Produtividade Média</h2>
                        <div className="mv-chart">
                            {producaoTotalPorVariedade.map((variedade, index) => (
                                <div key={variedade.idVariedade} className="mv-bar-container">
                                    <div className="mv-bar-label">
                                        <span className="mv-position-cell">{index + 1}</span>
                                        <span className="mv-variedade-name">Variedade {variedade.idVariedade} - {variedade.nomeCultura}</span>
                                    </div>
                                    <div className="mv-bar-wrapper">
                                        <div 
                                            className="mv-bar"
                                            style={{ width: `${(variedade.mediaProducao / maxProdutividade) * 100}%` }}
                                        >
                                            <span className="mv-bar-value">
                                                {variedade.mediaProducao.toFixed(2)} kg/safra
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tabela de Ranking */}
                    <div className="mv-table-container">
                        <h2 className="mv-table-title">Tabela de Ranking</h2>
                        <div className="mv-table">
                            <div className="mv-table-header">
                                <div className="mv-header-cell">Posição</div>
                                <div className="mv-header-cell">Variedade</div>
                                <div className="mv-header-cell">Média de Produção</div>
                            </div>
                            {producaoTotalPorVariedade.map((variedade, index) => (
                                <div key={variedade.idVariedade} className="mv-table-row">
                                    <div className="mv-table-cell mv-position-cell">{index + 1}</div>
                                    <div className="mv-table-cell">{variedade.idVariedade} - {variedade.nomeCultura}</div>
                                    <div className="mv-table-cell">
                                        <strong>{variedade.mediaProducao.toFixed(2)} kg/safra</strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mv-empty-state">
                    <h2>Nenhum dado encontrado</h2>
                    <p>Não há dados de produção suficientes para gerar o relatório.</p>
                </div>
            )}
        </div>
    );
}

export default MelhoresVariedades;