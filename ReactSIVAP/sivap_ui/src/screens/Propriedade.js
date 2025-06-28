import { useEffect, useState } from "react"

const Propriedade = () => {
    const [nome, setNome] = useState('');
    const [area, setArea] = useState('');

    /* nao sei se -1 eh o melhor para inicializar */
    const [latitude, setLatitude] = useState(-1);
    const [longitude, setLongitude] = useState(-1);
    
    const sendForm = () => {
        if(!nome || !area || !latitude || !longitude) {
            alert("Preencha todos os campos para enviar os dados");
        }

        /* fazer requisicao */
        try {
            const response = fetch('url', {
                method:'POST',
                body: JSON.stringify( {
                    nome: nome,
                    area: area,
                    latitude: latitude,
                    longitude: longitude
                })
            })
            console.log("reposta do server: " + response);
        }

        catch(error) {
            console.log("erro ao processar request: " + error);
        }
    }

    return (
        <form onSubmit={sendForm}>
            <label>
            Nome:
            <input type="text" onChange={(e) => setNome(e.target.value)} />
            </label>

            <label>
            area:
            <input type="text" onChange={(e) => setArea(e.target.value)} />
            </label>        
            
            <label>
            lat:
            <input type="text" onChange={(e) => setLatitude(e.target.value)} />
            </label>        
            
            <label>
            long:
            <input type="text" onChange={(e) => setLongitude(e.target.value)} />
            </label>        
            
            <input type="submit" value="Submit" />
        </form>
    );

    /* pegar dados do formulario e setar estados. depois disso, colocar no banco */
}