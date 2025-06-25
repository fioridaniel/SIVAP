package br.uel.trabalho.sivap.model;

public class Talhao {
    private int id;
    private double area;

    public Talhao(int id, double area) {
        this.id = id;
        this.area = area;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public double getArea() {
        return area;
    }

    public void setArea(double area) {
        this.area = area;
    }
}