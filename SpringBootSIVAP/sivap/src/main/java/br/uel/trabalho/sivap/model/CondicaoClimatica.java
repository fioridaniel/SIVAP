package br.uel.trabalho.sivap.model;

public class CondicaoClimatica {
    public double precipitacao;
    public double temperatura;
    public double velocidadeDoVento;

    /* vai de 0 ate 1 */
    public int distribuicaoDeChuva;

    public CondicaoClimatica(double precipitacao, double temperatura, double velocidadeDoVento) {
        this.precipitacao = precipitacao;
        this.temperatura = temperatura;
        this.velocidadeDoVento = velocidadeDoVento;
        this.distribuicaoDeChuva = 0;
    }

    public double getPrecipitacao() {
        return precipitacao;
    }

    public void setPrecipitacao(double precipitacao) {
        this.precipitacao = precipitacao;
    }

    public double getTemperatura() {
        return temperatura;
    }

    public void setTemperatura(double temperatura) {
        this.temperatura = temperatura;
    }

    public double getVelocidadeDoVento() {
        return velocidadeDoVento;
    }

    public void setVelocidadeDoVento(double velocidadeDoVento) {
        this.velocidadeDoVento = velocidadeDoVento;
    }

    public int getDistribuicaoDeChuva() {
        return distribuicaoDeChuva;
    }

    public void setDistribuicaoDeChuva(int distribuicaoDeChuva) {
        this.distribuicaoDeChuva = distribuicaoDeChuva;
    }
}