package br.uel.trabalho.sivap.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class Propriedade {
    private int id;
    private String nome;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private BigDecimal area;
    private List<ProdutorRural> produtores;

    public Propriedade(int id, String nome, BigDecimal latitude, BigDecimal longitude, BigDecimal area) {
        this.id = id;
        this.nome = nome;
        this.latitude = latitude;
        this.longitude = longitude;
        this.area = area;
        this.produtores = new ArrayList<>();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public BigDecimal getLatitude() {return latitude;}

    public void setLatitude(BigDecimal latitude) {this.latitude = latitude;}

    public BigDecimal getLongitude() {return longitude;}

    public void setLongitude(BigDecimal longitude) {this.longitude = longitude;}

    public BigDecimal getArea() {
        return area;
    }

    public void setArea(BigDecimal area) {
        this.area = area;
    }

    public List<ProdutorRural> getProdutores() {
        return produtores;
    }

    public void setProdutores(List<ProdutorRural> produtores) {
        this.produtores = produtores;
    }

    public void adicionarProdutor(ProdutorRural produtor) {
        this.produtores.add(produtor);
    }

    public void removerProdutor(ProdutorRural produtor) {
        this.produtores.remove(produtor);
    }
}