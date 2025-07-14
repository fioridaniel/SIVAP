/* 
    dados que preciso: 
    - pegar todas as safras
    - para cada safra, pegar sua respectiva variedade de cultura e producao. 
    - para cada variedade de cultura, acumular o total produzido em todas as safras.
    - penso que faz sentido rankear as variedades de cultura pela conta => total_produzido / num_safras
        da respectiva variedade de cultura analisada. o que acha? 
*/

import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const MelhoresVariedades = () => {
    /* estados */
    const [safras, setSafras] = useState([]);
    const [producaoTotalPorVariedade, setProducaoTotalPorVariedade] = useState([]);

    /* outros dados */
    const { talhaoId } = useParams();

    useEffect(() => {
        pegarSafras();
    }, []);

    /* obs: dados hardcoded so para testar com mais facilidade (nao sou burro)*/
    const pegarSafras = async () => {
        try { 
            const responseTalhoes = await fetch(`http://localhost:8080/talhoes/propriedade/1`);
            if(responseTalhoes.ok) {
                const talhoes = await response.json();                
                
                /* vetor temporario para armazenar todas as safras daquela propriedade */
                const todasSafras = [];
                for(talhao of talhoes) { /* loop que pega todos as safras de todos os talhoes dessa propriedade */
                    const idTalhao = talhao.id_talhao;
                    const responseSafras = await fetch(`http://localhost:8080/safras/talhao/${idTalhao}`); /* idTalhao */
                    if(responseSafras.ok) {
                        const safras = await response.json();
                        todasSafras.push(...safras); /* isso aqui evita ser um array de array, coloca tudo junto */
                    }
                }

                setSafras(todasSafras);
            }
        }
        
        catch(error) {
            console.log(error);
        }
    }

    const pegarProducaoPorSafraPorVariedade = () => {
        const agrupado = {};
    
        /* acumulando todas as producoes de cada safra dessa determinada propriedade */
        for (const safra of safras) {
            const idVariedade = safra.id_variedade_cultura;
            if (!agrupado[idVariedade]) {
                agrupado[idVariedade] = { total: 0, count: 0 };
            }
            agrupado[idVariedade].total += safra.producao;
            agrupado[idVariedade].count += 1;
        }

        /* transforma o dicionario em um array */
        const temp_data = Object.entries(agrupado).map(([idVariedade, { total, count }]) => ({
            idVariedade,
            mediaProducao: total / count,
        }));
    
        setProducaoTotalPorVariedade(temp_data);
        alert(temp_data);
    };

    return(
        <h1>testando melhores variedades...</h1>
    );
}

export default MelhoresVariedades;