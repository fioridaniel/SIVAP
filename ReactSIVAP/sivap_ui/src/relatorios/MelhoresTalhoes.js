import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../styles/RelatoriosPretendidos.css';

const RelatoriosPretendidos = () => {
    /* estados */
    const [talhoes, setTalhoes] = useState([]);
    const [producaoSafrasPorTalhao, setProducaoSafrasPorTalhao] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /* outros dados */
    const { idPropriedade } = useParams();
    
    console.log("RelatoriosPretendidos renderizando...");
    console.log("idPropriedade:", idPropriedade);
    console.log("talhoes:", talhoes);
    console.log("producaoSafrasPorTalhao:", producaoSafrasPorTalhao);
    console.log("isLoading:", isLoading);
    console.log("error:", error);
    
    useEffect(() => {
        console.log("useEffect 1 - buscando talhões");
        buscarTalhoes();
    }, []);
    
    useEffect(() => {
        console.log("useEffect 2 - talhões mudaram:", talhoes.length);
        if (talhoes.length > 0) {
            buscarProducaoSafrasPorTalhao();
        }
    }, [talhoes]);

    const buscarTalhoes = async () => {
        console.log("Iniciando busca de talhões...");
        try {
            const resposta = await fetch(`http://localhost:8080/talhoes/propriedade/${idPropriedade}`);
            console.log("Resposta da API talhões:", resposta.status);
            
            if(resposta.ok) {
                const talhoes = await resposta.json();
                console.log("Talhões recebidos:", talhoes);
                setTalhoes(talhoes);
            } 
            
            else {
                console.log("Erro na resposta da API talhões:", resposta.status);
                setError("Erro ao buscar talhões");
            }
        } 
        
        catch (error) {
            console.log("Erro ao buscar talhões:", error);
            setError("Erro de conexão ao buscar talhões");
        }
    }

    const buscarProducaoSafrasPorTalhao = async () => {
        console.log("Iniciando busca de produção por talhão...");
        setIsLoading(true);
        setError(null);
        const dadosTemporarios = [];

        for(const talhao of talhoes) {
            try {
                console.log(`Buscando safras para talhão ${talhao.id_talhao}...`);
                const resposta = await fetch(`http://localhost:8080/safras/talhao/${talhao.id_talhao}`);
                
                if(resposta.ok) {
                    const safras = await resposta.json();
                    console.log(`Safras do talhão ${talhao.id_talhao}:`, safras);
                    
                    if (safras.length > 0) {
                        /* pegar todas as producoes */
                        let somaProducoes = 0;
                        let numSafras = 0;
                        for(const safra of safras) {
                            somaProducoes += safra.producao;
                            numSafras++;
                        }

                        const mediaProducao = somaProducoes / numSafras;
                        const mediaPorArea = mediaProducao / talhao.area; 

                        dadosTemporarios.push({
                            idTalhao: talhao.id_talhao,
                            area: talhao.area,
                            mediaProducao: mediaProducao,
                            mediaPorArea: mediaPorArea,
                            numSafras: numSafras
                        });

                        console.log(`Talhão ${talhao.id_talhao}: ${mediaPorArea.toFixed(2)}`); /* duas casas decimais */
                    } 
                    
                    else {
                        console.log(`Talhão ${talhao.id_talhao}: Nenhuma safra encontrada`);
                    }
                } 
                
                else {
                    console.log(`Erro ao buscar safras do talhão ${talhao.id_talhao}:`, resposta.status);
                }
            } 
            catch (error) {
                console.log(`Erro ao buscar safras do talhão ${talhao.id_talhao}:`, error);
                continue; /* continua para o proximo talhao */
            }
        }
        
        console.log("Dados temporários:", dadosTemporarios);
        
        const top10Melhores = dadosTemporarios
            .sort((a, b) => b.mediaPorArea - a.mediaPorArea)  // maior para menor
            .slice(0, 10);  // 10 melhores    
        
        console.log("Top 10 melhores:", top10Melhores);
        setProducaoSafrasPorTalhao(top10Melhores);
        setIsLoading(false);
    }
    
    // Função para gerar cor baseada na posição do ranking
    const getRankingColor = (index) => {
        if (index === 0) return 'relatorios-bar-gold';
        if (index === 1) return 'relatorios-bar-silver';
        if (index === 2) return 'relatorios-bar-bronze';
        return 'relatorios-bar-green';
    };

    // Função para gerar largura da barra (normalizada)
    const getBarWidth = (mediaPorArea, maxValue) => {
        return (mediaPorArea / maxValue) * 100;
    };

    const maxProdutividade = producaoSafrasPorTalhao.length > 0 
        ? Math.max(...producaoSafrasPorTalhao.map(t => t.mediaPorArea))
        : 0;

    return (
        <div className="relatorios-container">
            <div className="relatorios-header">
                <h1 className="relatorios-title">Top 10 Melhores Talhões</h1>
                <p className="relatorios-subtitle">Ranking de Produtividade por Hectare</p>
            </div>

            {error && (
                <div className="relatorios-error">
                    <h2>Erro</h2>
                    <p>{error}</p>
                    <button onClick={buscarTalhoes}>Tentar novamente</button>
                </div>
            )}

            {isLoading && (
                <div className="relatorios-loading">
                    <div className="relatorios-loading-spinner"></div>
                    <p>Carregando dados de produtividade...</p>
                </div>
            )}

            {!isLoading && !error && talhoes.length === 0 && (
                <div className="relatorios-empty-state">
                    <h2>📭 Nenhum talhão encontrado</h2>
                    <p>Não há talhões cadastrados para esta propriedade.</p>
                </div>
            )}

            {producaoSafrasPorTalhao.length > 0 && (
                <div className="relatorios-content">
                    {/* Gráfico de Barras */}
                    <div className="relatorios-chart-container">
                        <h2 className="relatorios-chart-title">Gráfico de Produtividade</h2>
                        <div className="relatorios-chart">
                            {producaoSafrasPorTalhao.map((talhao, index) => (
                                <div key={talhao.idTalhao} className="relatorios-bar-container">
                                    <div className="relatorios-bar-label">
                                        <span className="relatorios-ranking">#{index + 1}</span>
                                        <span className="relatorios-talhao-name">Talhão {talhao.idTalhao}</span>
                                    </div>
                                    <div className="relatorios-bar-wrapper">
                                        <div 
                                            className={`relatorios-bar ${getRankingColor(index)}`}
                                            style={{ width: `${getBarWidth(talhao.mediaPorArea, maxProdutividade)}%` }}
                                        >
                                            <span className="relatorios-bar-value">
                                                {talhao.mediaPorArea.toFixed(2)} kg/ha
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tabela de Ranking */}
                    <div className="relatorios-table-container">
                        <h2 className="relatorios-table-title">Ranking Detalhado</h2>
                        <div className="relatorios-table">
                            <div className="relatorios-table-header">
                                <div className="relatorios-header-cell">Posição</div>
                                <div className="relatorios-header-cell">Talhão</div>
                                <div className="relatorios-header-cell">Produtividade</div>
                                <div className="relatorios-header-cell">Área</div>
                                <div className="relatorios-header-cell">Safras</div>
                            </div>
                            {producaoSafrasPorTalhao.map((talhao, index) => (
                                <div key={talhao.idTalhao} className="relatorios-table-row">
                                    <div className={`relatorios-table-cell relatorios-position-cell ${getRankingColor(index)}`}>
                                        {index + 1}º
                                    </div>
                                    <div className="relatorios-table-cell">#{talhao.idTalhao}</div>
                                    <div className="relatorios-table-cell">
                                        <strong>{talhao.mediaPorArea.toFixed(2)} kg/ha</strong>
                                    </div>
                                    <div className="relatorios-table-cell">{talhao.area} ha</div>
                                    <div className="relatorios-table-cell">{talhao.numSafras} safras</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="relatorios-stats-container">
                        <h2 className="relatorios-stats-title">📈 Estatísticas</h2>
                        <div className="relatorios-stats-grid">
                            <div className="relatorios-stat-card">
                                <h3>Melhor Talhão</h3>
                                <p>Talhão #{producaoSafrasPorTalhao[0]?.idTalhao}</p>
                                <p><strong>{producaoSafrasPorTalhao[0]?.mediaPorArea.toFixed(2)} kg/ha</strong></p>
                            </div>
                            <div className="relatorios-stat-card">
                                <h3>📊 Média Geral</h3>
                                <p><strong>
                                    {(producaoSafrasPorTalhao.reduce((sum, t) => sum + t.mediaPorArea, 0) / producaoSafrasPorTalhao.length).toFixed(2)} kg/ha
                                </strong></p>
                            </div>
                            <div className="relatorios-stat-card">
                                <h3>Total de Safras</h3>
                                <p><strong>
                                    {producaoSafrasPorTalhao.reduce((sum, t) => sum + t.numSafras, 0)} safras
                                </strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!isLoading && !error && talhoes.length > 0 && producaoSafrasPorTalhao.length === 0 && (
                <div className="relatorios-empty-state">
                    <h2>Nenhum dado encontrado</h2>
                    <p>Não há dados de produção suficientes para gerar o relatório.</p>
                </div>
            )}
        </div>
    );
}

export default RelatoriosPretendidos;