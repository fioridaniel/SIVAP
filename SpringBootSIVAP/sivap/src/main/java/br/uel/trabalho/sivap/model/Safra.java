package br.uel.trabalho.sivap.model;

import java.math.BigDecimal;
import java.util.Date;

public class Safra {
    private int id_safra;
    private int id_propriedade;
    private int id_talhao;
    private int id_variedade_cultura;
    private Date dt_plantio;
    private Date dt_colheita;
    private BigDecimal producao;

    public Safra(int id_safra, int id_propriedade, int id_talhao, int id_variedade_cultura, 
                 Date dt_plantio, Date dt_colheita, BigDecimal producao) {
        this.id_safra = id_safra;
        this.id_propriedade = id_propriedade;
        this.id_talhao = id_talhao;
        this.id_variedade_cultura = id_variedade_cultura;
        this.dt_plantio = dt_plantio;
        this.dt_colheita = dt_colheita;
        this.producao = producao;
    }

    public Safra() {
    }

    public int getId_safra() {
        return id_safra;
    }

    public void setId_safra(int id_safra) {
        this.id_safra = id_safra;
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

    public int getId_variedade_cultura() {
        return id_variedade_cultura;
    }

    public void setId_variedade_cultura(int id_variedade_cultura) {
        this.id_variedade_cultura = id_variedade_cultura;
    }

    public Date getDt_plantio() {
        return this.dt_plantio;
    }

    public void setDt_plantio(Date dt_plantio) {
        this.dt_plantio = dt_plantio;
    }

    public Date getDt_colheita() {
        return this.dt_colheita;
    }

    public void setDt_colheita(Date dt_colheita) {
        this.dt_colheita = dt_colheita;
    }

    public BigDecimal getProducao() {
        return this.producao;
    }

    public void setProducao(BigDecimal producao) {
        this.producao = producao;
    }
}