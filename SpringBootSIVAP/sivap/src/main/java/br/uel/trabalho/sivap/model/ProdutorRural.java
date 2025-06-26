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

    public ProdutorRural(String cpf, String nome, char sexo, Date dt_nasc) {
        this.cpf = cpf;
        this.nome = nome;
        this.sexo = sexo;
        this.dt_nasc = dt_nasc;
        this.propriedades = new ArrayList<>();
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