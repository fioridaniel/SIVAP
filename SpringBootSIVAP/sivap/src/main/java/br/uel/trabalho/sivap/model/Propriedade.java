package br.uel.trabalho.sivap.model;

public class Propriedade {
    private int id;
    private String nome;
    private double latitude;
    private double longitude;
    private double area;

    public Propriedade(int id, String nome, double latitude, double longitude, double area) {
        this.id = id;
        this.nome = nome;
        this.latitude = latitude;
        this.longitude = longitude;
        this.area = area;
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

    public double getLatitude() {return latitude;}

    public void setLatitude(double latitude) {this.latitude = latitude;}

    public double getLongitude() {return longitude;}

    public void setLongitude(double longitude) {this.longitude = longitude;}

    public double getArea() {
        return area;
    }

    public void setArea(double area) {
        this.area = area;
    }

}