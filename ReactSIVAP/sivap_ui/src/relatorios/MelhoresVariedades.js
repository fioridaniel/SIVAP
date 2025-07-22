import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const MelhoresVariedades = () => {
    const [safras, setSafras] = useState([]);
    const [producaoTotalPorVariedade, setProducaoTotalPorVariedade] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        pegarSafras();
    }, []);

    const pegarSafras = async () => {
        try { 
            setLoading(true);
            setErro(null);
            
            const responseTalhoes = await fetch(`http://localhost:8080/talhoes/propriedade/1`);
            if(responseTalhoes.ok) {
                const talhoes = await responseTalhoes.json();                
                
                const todasSafras = [];
                for(const talhao of talhoes) {
                    const idTalhao = talhao.id_talhao;
                    const responseSafras = await fetch(`http://localhost:8080/safras/talhao/${idTalhao}`);
                    if(responseSafras.ok) {
                        const safras = await responseSafras.json();
                        todasSafras.push(...safras);
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

    const pegarProducaoPorSafraPorVariedade = (safrasData) => {
        const agrupado = {};
    
        for (const safra of safrasData) {
            const idVariedade = safra.id_variedade_cultura;
            if (!agrupado[idVariedade]) {
                agrupado[idVariedade] = { total: 0, count: 0 };
            }
            agrupado[idVariedade].total += safra.producao;
            agrupado[idVariedade].count += 1;
        }

        const temp_data = Object.entries(agrupado).map(([idVariedade, { total, count }]) => ({
            idVariedade,
            mediaProducao: total / count,
        }));
    
        setProducaoTotalPorVariedade(temp_data);
    };

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Carregando dados das variedades...</h2>
            </div>
        );
    }

    if (erro) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Erro ao carregar dados</h2>
                <p>{erro}</p>
                <button onClick={() => navigate('/propriedades')}>Voltar</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <button onClick={() => navigate('/propriedades')}>← Voltar</button>
            <h1>Melhores Variedades</h1>
            <p>Total de safras analisadas: {safras.length}</p>
            <p>Variedades encontradas: {producaoTotalPorVariedade.length}</p>
            
            {producaoTotalPorVariedade.length > 0 && (
                <div>
                    <h3>Produção média por variedade:</h3>
                    <ul>
                        {producaoTotalPorVariedade.map((item, index) => (
                            <li key={index}>
                                Variedade ID {item.idVariedade}: {item.mediaProducao.toFixed(2)} kg
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default MelhoresVariedades;