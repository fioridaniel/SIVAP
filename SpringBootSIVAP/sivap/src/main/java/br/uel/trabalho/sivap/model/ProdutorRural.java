package br.uel.trabalho.sivap.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ProdutorRural{
    private String cpf;
    private String nome;
    private char sexo;
    private Date dt_nasc;
    private List<Propriedade> propriedades;
    // Campos email e senha são aceitos na requisição mas não salvos no banco
    private String email;
    private String senha;

    // Construtor padrão necessário para deserialização JSON
    public ProdutorRural() {
        this.propriedades = new ArrayList<>();
        this.email = "";
        this.senha = "";
    }

    public ProdutorRural(String cpf, String nome, char sexo, Date dt_nasc) {
        this.cpf = cpf;
        this.nome = nome;
        this.sexo = sexo;
        this.dt_nasc = dt_nasc;
        this.propriedades = new ArrayList<>();
        this.email = "";
        this.senha = "";
    }

    // Construtor para compatibilidade com front-end
    public ProdutorRural(String cpf, String nome, String email, String senha, char sexo, Date dt_nasc) {
        this.cpf = cpf;
        this.nome = nome;
        this.sexo = sexo;
        this.dt_nasc = dt_nasc;
        this.propriedades = new ArrayList<>();
        // Campos email e senha são descartados
        this.email = "";
        this.senha = "";
    }

    public String getCpf() {
        return this.cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getNome() {
        return this.nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return this.senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public char getSexo() {
        return this.sexo;
    }

    public void setSexo(char sexo) {
        this.sexo = sexo;
    }

    // Método adicional para aceitar String do JSON
    public void setSexo(String sexo) {
        if (sexo != null && !sexo.isEmpty()) {
            this.sexo = sexo.charAt(0);
        }
    }

    public Date getDt_nasc() {
        return this.dt_nasc;
    }

    public void setDt_nasc(Date dt_nasc) {
        this.dt_nasc = dt_nasc;
    }

    // Método adicional para aceitar String do JSON
    public void setDt_nasc(String dt_nasc) {
        if (dt_nasc != null && !dt_nasc.isEmpty()) {
            try {
                // Assumindo formato yyyy-MM-dd
                java.sql.Date sqlDate = java.sql.Date.valueOf(dt_nasc);
                this.dt_nasc = new Date(sqlDate.getTime());
            } catch (IllegalArgumentException e) {
                // Se não conseguir converter, mantém null
                this.dt_nasc = null;
            }
        }
    }

    public List<Propriedade> getPropriedades() {
        return this.propriedades;
    }

    public void setPropriedades(List<Propriedade> propriedades) {
        this.propriedades = propriedades;
    }

    public void adicionarPropriedade(Propriedade propriedade) {
        if (!this.propriedades.contains(propriedade)) {
            this.propriedades.add(propriedade);
        }
    }

    public void removerPropriedade(Propriedade propriedade) {
        this.propriedades.remove(propriedade);
    }
}