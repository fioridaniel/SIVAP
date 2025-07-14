import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Login.css";

export default function AlterarSenha() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarNovaSenha: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cpfUsuario, setCpfUsuario] = useState("");

  React.useEffect(() => {
    if (location.state?.cpfUsuario) {
      setCpfUsuario(location.state.cpfUsuario);
    } else {
      // Se não tiver CPF, redirecionar para login
      navigate('/login');
    }
  }, [location.state, navigate]);

  // Função para lidar com mudanças nos campos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validações
    if (!formData.senhaAtual || !formData.novaSenha || !formData.confirmarNovaSenha) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    if (formData.novaSenha.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (formData.novaSenha !== formData.confirmarNovaSenha) {
      setError("As senhas não coincidem");
      return;
    }

    if (formData.senhaAtual === formData.novaSenha) {
      setError("A nova senha deve ser diferente da senha atual");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/produtores/${cpfUsuario}/alterar-senha`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senhaAtual: formData.senhaAtual,
          novaSenha: formData.novaSenha
        })
      });

      if (response.ok) {
        setSuccess("Senha alterada com sucesso!");
        // Limpar formulário
        setFormData({
          senhaAtual: "",
          novaSenha: "",
          confirmarNovaSenha: ""
        });
        // Redirecionar após 2 segundos
        setTimeout(() => {
          navigate('/propriedades', { state: { cpfUsuario: cpfUsuario } });
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erro ao alterar senha' }));
        setError(errorData.message || "Erro ao alterar senha. Verifique se a senha atual está correta.");
      }
    } catch (error) {
      console.error("Erro na alteração da senha:", error);
      setError("Erro de conexão com o servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/propriedades', { state: { cpfUsuario: cpfUsuario } });
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-logo">AgroSIVAP</div>
        <h1>Alterar<br />Senha</h1>
        <p>Atualize sua senha de acesso</p>
        
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

          {success && (
            <div className="success-message" style={{ 
              background: '#e8f5e8', 
              color: '#2e7d32', 
              padding: '10px', 
              borderRadius: '5px', 
              marginBottom: '15px',
              border: '1px solid #c8e6c9'
            }}>
              {success}
            </div>
          )}

          <div className="input-group">
            <input 
              type="password" 
              name="senhaAtual"
              placeholder="Senha Atual" 
              value={formData.senhaAtual}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <input 
              type="password" 
              name="novaSenha"
              placeholder="Nova Senha" 
              value={formData.novaSenha}
              onChange={handleInputChange}
              minLength="6"
              required
            />
          </div>

          <div className="input-group">
            <input 
              type="password" 
              name="confirmarNovaSenha"
              placeholder="Confirmar Nova Senha" 
              value={formData.confirmarNovaSenha}
              onChange={handleInputChange}
              minLength="6"
              required
            />
          </div>

          <button type="submit" disabled={isLoading} className="primary-btn">
            {isLoading ? "Alterando Senha..." : "Alterar Senha"}
          </button>
        </form>

        <div className="login-signup">
          <button onClick={handleVoltar} style={{ 
            background: 'none', 
            border: 'none', 
            color: '#388e3c', 
            textDecoration: 'underline', 
            cursor: 'pointer' 
          }}>
            ← Voltar às Propriedades
          </button>
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
          🔐<br />
          Alteração de<br />
          Senha
        </div>
      </div>
    </div>
  );
} 