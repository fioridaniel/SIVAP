package br.uel.trabalho.sivap.dao;

import br.uel.trabalho.sivap.model.ProdutorRural;
import br.uel.trabalho.sivap.model.Propriedade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PgProdutorRuralDAO implements ProdutorRuralDAO {

    @Autowired
    private DataSource dataSource;

    @Override
    public ProdutorRural inserir(ProdutorRural produtor) throws SQLException, IOException, ClassNotFoundException {
        String sql = "INSERT INTO produtor_rural (cpf, nome, sexo, dt_nasc) VALUES (?, ?, ?, ?);";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setString(1, produtor.getCpf());
            pst.setString(2, produtor.getNome());
            pst.setString(3, String.valueOf(produtor.getSexo())); // Converte char para String para o JDBC
            pst.setDate(4, new java.sql.Date(produtor.getDt_nasc().getTime())); // Converte java.util.Date para java.sql.Date

            pst.executeUpdate();
        }
        return produtor;
    }

    @Override
    public ProdutorRural buscarPorCpf(String cpf) throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT * FROM produtor_rural WHERE cpf = ?;";
        ProdutorRural produtor = null;

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setString(1, cpf);

            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                    String nome = rs.getString("nome");
                    char sexo = rs.getString("sexo").charAt(0);
                    java.util.Date dtNasc = rs.getDate("dt_nasc");

                    produtor = new ProdutorRural(cpf, nome, sexo, dtNasc);
                    
                    // Carrega as propriedades associadas
                    List<Propriedade> propriedades = buscarPropriedadesDoProdutor(cpf);
                    produtor.setPropriedades(propriedades);
                }
            }
        }
        return produtor;
    }

    @Override
    public List<ProdutorRural> listarTodos() throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT * FROM produtor_rural ORDER BY nome;";
        List<ProdutorRural> produtores = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            while (rs.next()) {
                String cpf = rs.getString("cpf");
                String nome = rs.getString("nome");
                char sexo = rs.getString("sexo").charAt(0);
                java.util.Date dtNasc = rs.getDate("dt_nasc");

                ProdutorRural produtor = new ProdutorRural(cpf, nome, sexo, dtNasc);
                
                // Carrega as propriedades associadas
                List<Propriedade> propriedades = buscarPropriedadesDoProdutor(cpf);
                produtor.setPropriedades(propriedades);
                
                produtores.add(produtor);
            }
        }
        return produtores;
    }

    @Override
    public void atualizar(ProdutorRural produtor) throws SQLException, IOException, ClassNotFoundException {
        String sql = "UPDATE produtor_rural SET nome = ?, sexo = ?, dt_nasc = ? WHERE cpf = ?;";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setString(1, produtor.getNome());
            pst.setString(2, String.valueOf(produtor.getSexo()));
            pst.setDate(3, new java.sql.Date(produtor.getDt_nasc().getTime()));
            pst.setString(4, produtor.getCpf());

            pst.executeUpdate();
        }
    }

    @Override
    public void deletar(String cpf) throws SQLException, IOException, ClassNotFoundException {
        String sql = "DELETE FROM produtor_rural WHERE cpf = ?;";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setString(1, cpf);
            pst.executeUpdate();
        }
    }

    @Override
    public void associarPropriedade(String cpfProdutor, int idPropriedade) throws SQLException, IOException, ClassNotFoundException {
        String sql = "INSERT INTO produtor_propriedade (cpf_produtor_rural, id_propriedade) VALUES (?, ?);";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setString(1, cpfProdutor);
            pst.setInt(2, idPropriedade);

            pst.executeUpdate();
        }
    }

    @Override
    public void desassociarPropriedade(String cpfProdutor, int idPropriedade) throws SQLException, IOException, ClassNotFoundException {
        String sql = "DELETE FROM produtor_propriedade WHERE cpf_produtor_rural = ? AND id_propriedade = ?;";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setString(1, cpfProdutor);
            pst.setInt(2, idPropriedade);

            pst.executeUpdate();
        }
    }

    @Override
    public List<Propriedade> buscarPropriedadesDoProdutor(String cpfProdutor) throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT p.id, p.nome, p.latitude, p.longitude, p.area " +
                    "FROM propriedade p " +
                    "INNER JOIN produtor_propriedade pp ON p.id = pp.id_propriedade " +
                    "WHERE pp.cpf_produtor_rural = ?;";
        
        List<Propriedade> propriedades = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setString(1, cpfProdutor);

            try (ResultSet rs = pst.executeQuery()) {
                while (rs.next()) {
                    int id = rs.getInt("id");
                    String nome = rs.getString("nome");
                    BigDecimal latitude = rs.getBigDecimal("latitude");
                    BigDecimal longitude = rs.getBigDecimal("longitude");
                    BigDecimal area = rs.getBigDecimal("area");

                    Propriedade propriedade = new Propriedade(id, nome, latitude, longitude, area);
                    propriedades.add(propriedade);
                }
            }
        }
        return propriedades;
    }
}