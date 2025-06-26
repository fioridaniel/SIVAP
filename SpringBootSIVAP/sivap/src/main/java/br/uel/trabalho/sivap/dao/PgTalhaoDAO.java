package br.uel.trabalho.sivap.dao;

import br.uel.trabalho.sivap.model.Talhao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PgTalhaoDAO implements TalhaoDAO {

    @Autowired
    private DataSource dataSource;

    @Override
    public Talhao inserir(Talhao talhao) throws SQLException, IOException, ClassNotFoundException {
        String sql = "INSERT INTO talhao (id_propriedade, area) VALUES (?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pst.setInt(1, talhao.getId_propriedade());
            pst.setBigDecimal(2, talhao.getArea());
            pst.executeUpdate();
            try (ResultSet rs = pst.getGeneratedKeys()) {
                if (rs.next()) {
                    talhao.setId_talhao(rs.getInt(1));
                }
            }
        }
        return talhao;
    }

    @Override
    public Talhao buscaPorId(int idPropriedade, int idTalhao) throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT * FROM talhao WHERE id_propriedade = ? AND id_talhao = ?";
        Talhao talhao = null;
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setInt(1, idPropriedade);
            pst.setInt(2, idTalhao);
            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                    talhao = new Talhao(
                        rs.getInt("id_propriedade"),
                        rs.getInt("id_talhao"),
                        rs.getBigDecimal("area")
                    );
                }
            }
        }
        return talhao;
    }

    @Override
    public List<Talhao> listarTodos() throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT * FROM talhao ORDER BY id_talhao";
        List<Talhao> lista = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                Talhao talhao = new Talhao(
                    rs.getInt("id_propriedade"),
                    rs.getInt("id_talhao"),
                    rs.getBigDecimal("area")
                );
                lista.add(talhao);
            }
        }
        return lista;
    }

    @Override
    public void atualizar(Talhao talhao) throws SQLException, IOException, ClassNotFoundException {
        String sql = "UPDATE talhao SET area = ? WHERE id_propriedade = ? AND id_talhao = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setBigDecimal(1, talhao.getArea());
            pst.setInt(2, talhao.getId_propriedade());
            pst.setInt(3, talhao.getId_talhao());
            pst.executeUpdate();
        }
    }

    @Override
    public void deletar(int idPropriedade, int idTalhao) throws SQLException, IOException, ClassNotFoundException {
        String sql = "DELETE FROM talhao WHERE id_propriedade = ? AND id_talhao = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setInt(1, idPropriedade);
            pst.setInt(2, idTalhao);
            pst.executeUpdate();
        }
    }
} 