package br.uel.trabalho.sivap.model;

public class VariedadeCultura {
    private int id_variedade_cultura;
    private int id_cultura;
    private String descricao;
    private short resistencia_seca;
    private short resistencia_pragas;
    private int ciclo_vegetativo_dias;
    private short produtividade_nota;

    public VariedadeCultura(int id_variedade_cultura, int id_cultura, String descricao, 
                           short resistencia_seca, short resistencia_pragas, 
                           int ciclo_vegetativo_dias, short produtividade_nota) {
        this.id_variedade_cultura = id_variedade_cultura;
        this.id_cultura = id_cultura;
        this.descricao = descricao;
        this.resistencia_seca = resistencia_seca;
        this.resistencia_pragas = resistencia_pragas;
        this.ciclo_vegetativo_dias = ciclo_vegetativo_dias;
        this.produtividade_nota = produtividade_nota;
    }

    public int getId_variedade_cultura() {
        return id_variedade_cultura;
    }

    public void setId_variedade_cultura(int id_variedade_cultura) {
        this.id_variedade_cultura = id_variedade_cultura;
    }

    public int getId_cultura() {
        return id_cultura;
    }

    public void setId_cultura(int id_cultura) {
        this.id_cultura = id_cultura;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public short getResistencia_seca() {
        return resistencia_seca;
    }

    public void setResistencia_seca(short resistencia_seca) {
        this.resistencia_seca = resistencia_seca;
    }

    public short getResistencia_pragas() {
        return resistencia_pragas;
    }

    public void setResistencia_pragas(short resistencia_pragas) {
        this.resistencia_pragas = resistencia_pragas;
    }

    public int getCiclo_vegetativo_dias() {
        return ciclo_vegetativo_dias;
    }

    public void setCiclo_vegetativo_dias(int ciclo_vegetativo_dias) {
        this.ciclo_vegetativo_dias = ciclo_vegetativo_dias;
    }

    public short getProdutividade_nota() {
        return produtividade_nota;
    }

    public void setProdutividade_nota(short produtividade_nota) {
        this.produtividade_nota = produtividade_nota;
    }
}