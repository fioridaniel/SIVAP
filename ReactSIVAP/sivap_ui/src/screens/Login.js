import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import loginImage from "../assets/login_imagem.png";

export default function Login() {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCpfList, setShowCpfList] = useState(false);

  // Lista de CPFs válidos para teste
  const cpfsValidos = [
    { cpf: "87349612087", nome: "Dr. Joaquim da Mota" },
    { cpf: "60849213703", nome: "Sra. Eduarda Freitas" },
    { cpf: "29560817302", nome: "Théo Nascimento" },
    { cpf: "62715834071", nome: "Pedro Miguel Melo" },
    { cpf: "91843750600", nome: "Ana Laura da Luz" }
  ];

  // Função para formatar CPF automaticamente
  const formatarCPF = (valor) => {
    // Remove tudo que não é dígito
    const cpfLimpo = valor.replace(/\D/g, "");
    
    // Aplica a máscara
    const cpfFormatado = cpfLimpo.replace(/(\d{3})(\d)/, "$1.$2")
                                 .replace(/(\d{3})(\d)/, "$1.$2")
                                 .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    
    return cpfFormatado;
  };

  // Função para lidar com mudanças no campo CPF
  const handleCpfChange = (e) => {
    const valor = e.target.value;
    const cpfFormatado = formatarCPF(valor);
    setCpf(cpfFormatado);
  };

  // Função para selecionar CPF da lista
  const handleCpfSelect = (cpfSelecionado) => {
    setCpf(cpfSelecionado);
    setShowCpfList(false);
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      // Simula uma chamada de autenticação (substitua pela sua API real)
      console.log("CPF inserido:", cpf);
      
      // Aguarda um pouco para simular processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redireciona para a página de propriedades passando o CPF
      navigate("/propriedades", { 
        state: { cpfUsuario: cpf } 
      });
      
    } catch (error) {
      console.error("Erro na autenticação:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-logo">AgroSIVAP</div>
        <h1>Olá,<br />Bem-vindo de volta</h1>
        <p>Bem-vindo novamente ao seu espaço especial</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="CPF" 
              value={cpf}
              onChange={handleCpfChange}
              maxLength="14"
            />
            <button 
              type="button" 
              className="cpf-list-btn"
              onClick={() => setShowCpfList(!showCpfList)}
            >
              📋 CPFs de Teste
            </button>
            {showCpfList && (
              <div className="cpf-list">
                <h4>CPFs válidos para teste:</h4>
                {cpfsValidos.map((item, index) => (
                  <div 
                    key={index} 
                    className="cpf-item"
                    onClick={() => handleCpfSelect(item.cpf)}
                  >
                    <strong>{item.cpf}</strong> - {item.nome}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Senha" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <div className="login-options">
            <label>
              <input type="checkbox" /> Lembrar-me
            </label>
            <a href="#">Esqueceu a senha?</a>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <div className="login-signup">
          Não tem uma conta? <button onClick={() => navigate('/criar-conta')} style={{ 
            background: 'none', 
            border: 'none', 
            color: '#388e3c', 
            textDecoration: 'underline', 
            cursor: 'pointer' 
          }}>Cadastre-se</button>
        </div>
      </div>
      <div className="login-right">
        <img src={loginImage} alt="Ilustração de agricultura" className="login-img" />
      </div>
    </div>
  );
} 