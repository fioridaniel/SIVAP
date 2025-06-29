import { useState } from 'react';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    setIsLoading(true);
    setMessage('');

    setTimeout(() => {
      if (email && password) {
        setMessage('Login realizado com sucesso!');
      } 
      
      else {
        setMessage('Por favor, preencha todos os campos.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setEmail('');
    setPassword('');
    setMessage('');
  };

  return (
    <div>
      <h1>Login</h1>
      
      <div>
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
            placeholder="Digite sua senha"
            disabled={isLoading}
          />
        </div>

        <div>
          <button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
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
        <a href="#forgot">Esqueceu a senha?</a>
      </div>

      <div>
        <p>Não tem uma conta? <a href="#register">Criar conta</a></p>
      </div>
    </div>
  );
}