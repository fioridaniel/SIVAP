import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const RelatoriosPretendidos = () => {
    /* estados */
    const [talhoes, setTalhoes] = useState([]);
    const [producaoSafrasPorTalhao, setProducaoSafrasPorTalhao] = useState([]);

    /* outros dados */
    const { idPropriedade } = useParams();
    
    useEffect(() => {
        buscarTalhoes();
    }, []);
    
    useEffect(() => {
        buscarProducaoSafrasPorTalhao();
    }, [talhoes]);

    const buscarTalhoes = async () => {
        try {
            const resposta = await fetch(`http://localhost:8080/talhoes/propriedade/1`);
            if(resposta.ok) {
                const talhoes = await resposta.json();
                setTalhoes(talhoes);
            }
        } 
        
        catch (error) {
            console.log("nao foi possivel buscar dados dos talhoes: ", error);
            return;
        }
    }

    /*  
        para cada safra de um determinado talhao, eu quero a producao. vou acumular todas e calcular 
            a media. o resultado sera a media da producao desse determinado talhao em um periodo x, 
            e depois vou didivir essa media pela area do talhao para ficar justo. acho que faz sentido.  
                - preciso da producao de todas as safras daquele talhao
                - preciso da area do talhao
                - eixo y: producao / area
                - eixo x: id do talhao naquela propriedade  
    */
    
    const buscarProducaoSafrasPorTalhao = async () => {
        const dadosTemporarios = [];

        for(const talhao of talhoes) {
            
            try {
                const resposta = await fetch(`http://localhost:8080/safras/talhao/${talhao.id_talhao}`);
                if(resposta.ok) {
                    const safras = await resposta.json();
                    
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
                        mediaProducao: mediaPorArea,
                    })

                    alert("media de producoes desse talhao por area: "+mediaPorArea);
                }
            } 
            
            catch (error) {
                console.log("nao foi possivel buscar dados das safras: ", error);
                return;
            }
        }
        
        const top10Melhores = dadosTemporarios
        .sort((a, b) => b.mediaProducao - a.mediaProducao)  // maior para menor
        .slice(0, 10);  // 10 melhores    
        setProducaoSafrasPorTalhao(top10Melhores);
    }
    
    return (
        <h1>testando relatorios...</h1>
    );
}

export default RelatoriosPretendidos;