import { useState } from 'react';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = () => {
    setIsLoading(true);
    setMessage('');

    setTimeout(() => {
      if (name && email && password && confirmPassword) {
        if (password === confirmPassword) {
          if (password.length >= 6) {
            setMessage('Cadastro realizado com sucesso!');
          } else {
            setMessage('A senha deve ter pelo menos 6 caracteres.');
          }
        } else {
          setMessage('As senhas não coincidem.');
        }
      } else {
        setMessage('Por favor, preencha todos os campos.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setMessage('');
  };

  return (
    <div>
      <h1>Criar Conta</h1>
      
      <div>
        <div>
          <label htmlFor="name">Nome completo:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome completo"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha (mín. 6 caracteres)"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirmar senha:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Digite sua senha novamente"
            disabled={isLoading}
          />
        </div>

        <div>
          <button onClick={handleRegister} disabled={isLoading}>
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </button>
          <button onClick={handleReset} disabled={isLoading}>
            Limpar
          </button>
        </div>
      </div>

      {message && (
        <div>
          <p>{message}</p>
        </div>
      )}

      <div>
        <p>Já tem uma conta? <a href="#login">Fazer login</a></p>
      </div>
    </div>
  );
}