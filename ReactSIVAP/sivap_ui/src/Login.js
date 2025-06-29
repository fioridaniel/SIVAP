import React from "react";
import "./Login.css";
import loginImage from "./assets/login_imagem.png";

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-logo">🌱 AgroSIVAP</div>
        <h1>Olá,<br />Bem-vindo de volta</h1>
        <p>Bem-vindo novamente ao seu espaço especial</p>
        <form className="login-form">
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Senha" />
          <div className="login-options">
            <label>
              <input type="checkbox" /> Lembrar-me
            </label>
            <a href="#">Esqueceu a senha?</a>
          </div>
          <button type="submit">Entrar</button>
        </form>
        <div className="login-signup">
          Não tem uma conta? <a href="#">Cadastre-se</a>
        </div>
      </div>
      <div className="login-right">
        <img src={loginImage} alt="Ilustração de agricultura" className="login-img" />
      </div>
    </div>
  );
} 