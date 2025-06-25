package br.uel.trabalho.sivap.model;

import java.math.BigDecimal;

public class CondicaoClimatica {
    private int id_condicao_climatica;
    private int id_safra;
    private BigDecimal precipitacao_mm;
    private short distribuicao_chuva_nota;
    private BigDecimal velocidade_max_vento_kmh;
    private BigDecimal temperatura_media_c;
    private String observacoes;

    public CondicaoClimatica(int id_condicao_climatica, int id_safra, BigDecimal precipitacao_mm, 
                            short distribuicao_chuva_nota, BigDecimal velocidade_vento_kmh, 
                            BigDecimal temperatura_media_c, String observacoes) {
        this.id_condicao_climatica = id_condicao_climatica;
        this.id_safra = id_safra;
        this.precipitacao_mm = precipitacao_mm;
        this.distribuicao_chuva_nota = distribuicao_chuva_nota;
        this.velocidade_max_vento_kmh = velocidade_vento_kmh;
        this.temperatura_media_c = temperatura_media_c;
        this.observacoes = observacoes;
    }

    public int getId_condicao_climatica() {
        return id_condicao_climatica;
    }

    public void setId_condicao_climatica(int id_condicao_climatica) {
        this.id_condicao_climatica = id_condicao_climatica;
    }

    public int getId_safra() {
        return id_safra;
    }

    public void setId_safra(int id_safra) {
        this.id_safra = id_safra;
    }

    public BigDecimal getPrecipitacao_mm() {
        return precipitacao_mm;
    }

    public void setPrecipitacao_mm(BigDecimal precipitacao_mm) {
        this.precipitacao_mm = precipitacao_mm;
    }

    public short getDistribuicao_chuva_nota() {
        return distribuicao_chuva_nota;
    }

    public void setDistribuicao_chuva_nota(short distribuicao_chuva_nota) {
        this.distribuicao_chuva_nota = distribuicao_chuva_nota;
    }

    public BigDecimal getVelocidade_vento_kmh() {
        return velocidade_max_vento_kmh;
    }

    public void setVelocidade_vento_kmh(BigDecimal velocidade_max_vento_kmh) {
        this.velocidade_max_vento_kmh = velocidade_max_vento_kmh;
    }

    public BigDecimal getTemperatura_media_c() {
        return temperatura_media_c;
    }

    public void setTemperatura_media_c(BigDecimal temperatura_media_c) {
        this.temperatura_media_c = temperatura_media_c;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
}