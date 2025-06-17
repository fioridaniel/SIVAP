public class Propriedade {
    private int id;
    private String nome;
    private String endereco;
    private double area;

    public Propriedade(int id, String nome, String endereco, double area) {
        this.id = id;
        this.nome = nome;
        this.endereco = endereco;
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

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public double getArea() {
        return area;
    }

    public void setArea(double area) {
        this.area = area;
    }

}