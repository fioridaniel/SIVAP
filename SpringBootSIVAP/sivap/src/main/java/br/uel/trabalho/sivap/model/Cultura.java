package br.uel.trabalho.sivap.model;

public class Cultura {
    private int id;
    private String nome;

    public Cultura(int id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    public int getId_cultura() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome_cultura() {
        return nome;
    }

    public void setNome_cultura(String nome) {
        this.nome = nome;
    }

}