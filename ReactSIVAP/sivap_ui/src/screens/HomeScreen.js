import { useEffect, useState } from "react";

const HomeScreen = () => {
    const [dado, setDado] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/proprietarios')
        .then(response => response.text())
        .then(data => setDado(data))
        .catch(error => console.error('Erro ao buscar mensagem:', error));
    }, []);

    return (
        <h1>Mensagem do server: {dado}</h1>
    )
}