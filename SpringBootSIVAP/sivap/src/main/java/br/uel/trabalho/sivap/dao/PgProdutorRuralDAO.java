package br.uel.trabalho.sivap.dao;

import br.uel.trabalho.sivap.model.ProdutorRural;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PgProdutorRuralDAO implements ProdutorRuralDAO {

    @Autowired
    private DataSource dataSource;

    @Override
    public ProdutorRural inserir(ProdutorRural produtor) throws SQLException, IOException, ClassNotFoundException {
        String sql = "INSERT INTO produtores_rurais (cpf, nome, sexo, dt_nasc, endereco) VALUES (?, ?, ?, ?, ?);";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setString(1, produtor.getCpf());
            pst.setString(2, produtor.getNome());
            pst.setString(3, String.valueOf(produtor.getSexo())); // Converte char para String para o JDBC
            pst.setDate(4, new java.sql.Date(produtor.getDt_nasc().getTime())); // Converte java.util.Date para java.sql.Date
            pst.setString(5, produtor.getEndereco());

            pst.executeUpdate();
        }
        return produtor;
    }

    @Override
    public ProdutorRural buscarPorCpf(String cpf) throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT * FROM produtores_rurais WHERE cpf = ?;";
        ProdutorRural produtor = null;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setString(1, cpf);

            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                    String nome = rs.getString("nome");
                    char sexo = rs.getString("sexo").charAt(0);
                    java.util.Date dtNasc = rs.getDate("dt_nasc");
                    String endereco = rs.getString("endereco");

                    produtor = new ProdutorRural(cpf, nome, sexo, dtNasc, endereco);
                }
            }
        }
        return produtor;
    }

    @Override
    public List<ProdutorRural> listarTodos() throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT * FROM produtores_rurais ORDER BY nome;";
        List<ProdutorRural> produtores = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            while (rs.next()) {
                String cpf = rs.getString("cpf");
                String nome = rs.getString("nome");
                char sexo = rs.getString("sexo").charAt(0);
                java.util.Date dtNasc = rs.getDate("dt_nasc");
                String endereco = rs.getString("endereco");

                ProdutorRural produtor = new ProdutorRural(cpf, nome, sexo, dtNasc, endereco);
                produtores.add(produtor);
            }
        }
        return produtores;
    }

    @Override
    public void atualizar(ProdutorRural produtor) throws SQLException, IOException, ClassNotFoundException {
        String sql = "UPDATE produtores_rurais SET nome = ?, sexo = ?, dt_nasc = ?, endereco = ? WHERE cpf = ?;";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setString(1, produtor.getNome());
            pst.setString(2, String.valueOf(produtor.getSexo()));
            pst.setDate(3, new java.sql.Date(produtor.getDt_nasc().getTime()));
            pst.setString(4, produtor.getEndereco());
            pst.setString(5, produtor.getCpf());

            pst.executeUpdate();
        }
    }

    @Override
    public void deletar(String cpf) throws SQLException, IOException, ClassNotFoundException {
        String sql = "DELETE FROM produtores_rurais WHERE cpf = ?;";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setString(1, cpf);
            pst.executeUpdate();
        }
    }
}