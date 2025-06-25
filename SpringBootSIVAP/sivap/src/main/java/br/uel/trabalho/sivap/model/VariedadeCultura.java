package br.uel.trabalho.sivap.model;

public class VariedadeCultura {
    private int id;
    private double produtividade;

    /* resistencia varia de 0 a 1 */
    private int resistencia_seca;
    private int resistencia_pragas;

    private String descricao;

    public VariedadeCultura(int id, double produtividade, int resistencia_pragas, String descricao) {
        this.id = id;
        this.produtividade = produtividade;
        this.resistencia_pragas = resistencia_pragas;
        this.descricao = descricao;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public double getProdutividade() {
        return produtividade;
    }

    public void setProdutividade(double produtividade) {
        this.produtividade = produtividade;
    }

    public int getResistencia_seca() {
        return resistencia_seca;
    }

    public void setResistencia_seca(int resistencia_seca) {
        this.resistencia_seca = resistencia_seca;
    }

    public int getResistencia_pragas() {
        return resistencia_pragas;
    }

    public void setResistencia_pragas(int resistencia_pragas) {
        this.resistencia_pragas = resistencia_pragas;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}