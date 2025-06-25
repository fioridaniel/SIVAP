package br.uel.trabalho.sivap.model;

import java.util.Date;

public class ProdutorRural{
    private String cpf;
    private String nome;
    private char sexo;
    private Date dt_nasc;
    private String endereco;

    public ProdutorRural(String cpf,  String nome, char sexo, Date dt_nasc, String endereco) {
        this.cpf = cpf;
        this.nome = nome;
        this.sexo = sexo;
        this.dt_nasc = dt_nasc;
        this.endereco = endereco;
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

    public char getSexo() {
        return this.sexo;
    }

    public void setSexo(char sexo) {
        this.sexo = sexo;
    }

    public Date getDt_nasc() {
        return this.dt_nasc;
    }

    public void setDt_nasc(Date dt_nasc) {
        this.dt_nasc = dt_nasc;
    }

    public String getEndereco() {
        return this.endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

}

