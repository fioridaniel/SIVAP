import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function CriarConta() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cpf: "",
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    sexo: "",
    dtNasc: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Função para formatar CPF automaticamente
  const formatarCPF = (valor) => {
    const cpfLimpo = valor.replace(/\D/g, "");
    const cpfFormatado = cpfLimpo.replace(/(\d{3})(\d)/, "$1.$2")
                                 .replace(/(\d{3})(\d)/, "$1.$2")
                                 .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return cpfFormatado;
  };

  // Função para lidar com mudanças nos campos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "cpf") {
      const cpfFormatado = formatarCPF(value);
      setFormData(prev => ({
        ...prev,
        [name]: cpfFormatado
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Função para validar CPF
  const validarCPF = (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;
    
    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let dv1 = resto < 2 ? 0 : resto;
    
    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let dv2 = resto < 2 ? 0 : resto;
    
    return parseInt(cpfLimpo.charAt(9)) === dv1 && parseInt(cpfLimpo.charAt(10)) === dv2;
  };

  // Função para validar email
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validações
    if (!formData.cpf || !formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha || !formData.sexo || !formData.dtNasc) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    if (!validarCPF(formData.cpf)) {
      setError("CPF inválido");
      return;
    }

    if (!validarEmail(formData.email)) {
      setError("Email inválido");
      return;
    }

    if (formData.senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/produtores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cpf: formData.cpf.replace(/\D/g, ""), // Remove formatação
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          sexo: formData.sexo,
          dt_nasc: formData.dtNasc
        })
      });

      if (response.ok) {
        alert("Conta criada com sucesso! Faça login para continuar.");
        navigate('/login');
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erro ao criar conta' }));
        setError(errorData.message || "Erro ao criar conta. Verifique se o CPF não está em uso.");
      }
    } catch (error) {
      console.error("Erro na criação da conta:", error);
      setError("Erro de conexão com o servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/login');
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-logo">AgroSIVAP</div>
        <h1>Criar<br />Conta</h1>
        <p>Cadastre-se para começar a usar o sistema</p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message" style={{ 
              background: '#ffebee', 
              color: '#c62828', 
              padding: '10px', 
              borderRadius: '5px', 
              marginBottom: '15px',
              border: '1px solid #ffcdd2'
            }}>
              {error}
            </div>
          )}

          <div className="input-group">
            <input 
              type="text" 
              name="cpf"
              placeholder="CPF" 
              value={formData.cpf}
              onChange={handleInputChange}
              maxLength="14"
              required
            />
          </div>

          <div className="input-group">
            <input 
              type="text" 
              name="nome"
              placeholder="Nome Completo" 
              value={formData.nome}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <select 
              name="sexo"
              value={formData.sexo}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                backgroundColor: 'white'
              }}
            >
              <option value="">Selecione o sexo</option>
              <option value="m">Masculino</option>
              <option value="f">Feminino</option>
            </select>
          </div>

          <div className="input-group">
            <input 
              type="date" 
              name="dtNasc"
              placeholder="Data de Nascimento" 
              value={formData.dtNasc}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <input 
              type="email" 
              name="email"
              placeholder="Email" 
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <input 
              type="password" 
              name="senha"
              placeholder="Senha" 
              value={formData.senha}
              onChange={handleInputChange}
              minLength="6"
              required
            />
          </div>

          <div className="input-group">
            <input 
              type="password" 
              name="confirmarSenha"
              placeholder="Confirmar Senha" 
              value={formData.confirmarSenha}
              onChange={handleInputChange}
              minLength="6"
              required
            />
          </div>

          <button type="submit" disabled={isLoading} className="primary-btn">
            {isLoading ? "Criando Conta..." : "Criar Conta"}
          </button>
        </form>

        <div className="login-signup">
          Já tem uma conta? <button onClick={handleVoltar} style={{ 
            background: 'none', 
            border: 'none', 
            color: '#388e3c', 
            textDecoration: 'underline', 
            cursor: 'pointer' 
          }}>Faça login</button>
        </div>
      </div>
      
      <div className="login-right">
        <div className="placeholder-img" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          fontSize: '2rem',
          color: '#388e3c',
          textAlign: 'center',
          lineHeight: '1.4'
        }}>
          👨‍🌾<br />
          Cadastro de<br />
          Produtor
        </div>
      </div>
    </div>
  );
} 