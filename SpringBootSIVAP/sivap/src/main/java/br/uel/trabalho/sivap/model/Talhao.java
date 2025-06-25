package br.uel.trabalho.sivap.model;

import java.math.BigDecimal;

public class Talhao {
    private int id_propriedade;
    private int id_talhao;
    private BigDecimal area;

    public Talhao(int id_propriedade, int id_talhao, BigDecimal area) {
        this.id_propriedade = id_propriedade;
        this.id_talhao = id_talhao;
        this.area = area;
    }

    public int getId_propriedade() {
        return id_propriedade;
    }

    public void setId_propriedade(int id_propriedade) {
        this.id_propriedade = id_propriedade;
    }

    public int getId_talhao() {
        return id_talhao;
    }

    public void setId_talhao(int id_talhao) {
        this.id_talhao = id_talhao;
    }

    public BigDecimal getArea() {
        return area;
    }

    public void setArea(BigDecimal area) {
        this.area = area;
    }
}