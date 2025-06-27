package br.uel.trabalho.sivap.dao;

import br.uel.trabalho.sivap.model.Cultura;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PgCulturaDAO implements CulturaDAO {

    @Autowired
    private DataSource dataSource;

    @Override
    public Cultura inserir(Cultura cultura) throws SQLException, IOException, ClassNotFoundException {
        String sql = "INSERT INTO cultura (nome_cultura) VALUES (?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pst.setString(1, cultura.getNome_cultura());
            pst.executeUpdate();
            try (ResultSet rs = pst.getGeneratedKeys()) {
                if (rs.next()) {
                    cultura.setId(rs.getInt(1));
                }
            }
        }
        return cultura;
    }

    @Override
    public Cultura buscaPorId(int id_cultura) throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT id_cultura, nome_cultura FROM cultura WHERE id_cultura = ?";
        Cultura cultura = null;
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setInt(1, id_cultura);
            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                    String nome_cultura = rs.getString("nome_cultura");
                    cultura = new Cultura(id_cultura, nome_cultura);
                }
            }
        }
        return cultura;
    }

    @Override
    public List<Cultura> listarTodos() throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT id_cultura, nome_cultura FROM cultura ORDER BY nome_cultura";
        List<Cultura> culturas = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                int id_cultura = rs.getInt("id_cultura");
                String nome_cultura = rs.getString("nome_cultura");
                culturas.add(new Cultura(id_cultura, nome_cultura));
            }
        }
        return culturas;
    }

    @Override
    public void atualizar(Cultura cultura) throws SQLException, IOException, ClassNotFoundException {
        String sql = "UPDATE cultura SET nome_cultura = ? WHERE id_cultura = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setString(1, cultura.getNome_cultura());
            pst.setInt(2, cultura.getId_cultura());
            pst.executeUpdate();
        }
    }

    @Override
    public void deletar(int id_cultura) throws SQLException, IOException, ClassNotFoundException {
        String sql = "DELETE FROM cultura WHERE id_cultura = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setInt(1, id_cultura);
            pst.executeUpdate();
        }
    }
} 