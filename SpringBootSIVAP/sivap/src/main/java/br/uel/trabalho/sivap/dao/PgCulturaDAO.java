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
        String sql = "INSERT INTO cultura (nome) VALUES (?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pst.setString(1, cultura.getNome());
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
    public Cultura buscaPorId(int id) throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT id, nome FROM cultura WHERE id = ?";
        Cultura cultura = null;
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setInt(1, id);
            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                    String nome = rs.getString("nome");
                    cultura = new Cultura(id, nome);
                }
            }
        }
        return cultura;
    }

    @Override
    public List<Cultura> listarTodos() throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT id, nome FROM cultura ORDER BY nome";
        List<Cultura> culturas = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                int id = rs.getInt("id");
                String nome = rs.getString("nome");
                culturas.add(new Cultura(id, nome));
            }
        }
        return culturas;
    }

    @Override
    public void atualizar(Cultura cultura) throws SQLException, IOException, ClassNotFoundException {
        String sql = "UPDATE cultura SET nome = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setString(1, cultura.getNome());
            pst.setInt(2, cultura.getId());
            pst.executeUpdate();
        }
    }

    @Override
    public void deletar(int id) throws SQLException, IOException, ClassNotFoundException {
        String sql = "DELETE FROM cultura WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setInt(1, id);
            pst.executeUpdate();
        }
    }
} 