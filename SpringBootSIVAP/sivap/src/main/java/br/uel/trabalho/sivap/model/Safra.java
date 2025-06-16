public class Safra {
    public double producao;
    public Date dt_plantio;
    public Date dt_colheita;

    public Safra(double producao, Date dt_plantio, Date dt_colheita) {
        this.producao = producao;
        this.dt_plantio = dt_plantio;
        this.dt_colheita = dt_colheita;
    }

    public double getProdutividade() {
        return this.producao
    }

    public void setProducao(double producao) {
        this.producao =  producao;
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
}