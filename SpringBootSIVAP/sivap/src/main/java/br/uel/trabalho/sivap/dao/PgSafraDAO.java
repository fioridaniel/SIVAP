package br.uel.trabalho.sivap.dao;

import br.uel.trabalho.sivap.model.Safra;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PgSafraDAO implements SafraDAO {

    @Autowired
    private DataSource dataSource;

    @Override
    public Safra inserir(Safra safra) throws SQLException, IOException, ClassNotFoundException {
        String sql = "INSERT INTO safra (id_propriedade, id_talhao, id_variedade_cultura, dt_plantio, dt_colheita, producao) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pst.setInt(1, safra.getId_propriedade());
            pst.setInt(2, safra.getId_talhao());
            pst.setInt(3, safra.getId_variedade_cultura());
            pst.setDate(4, new java.sql.Date(safra.getDt_plantio().getTime()));
            pst.setDate(5, new java.sql.Date(safra.getDt_colheita().getTime()));
            pst.setBigDecimal(6, safra.getProducao());
            pst.executeUpdate();
            try (ResultSet rs = pst.getGeneratedKeys()) {
                if (rs.next()) {
                    safra.setId_safra(rs.getInt(1));
                }
            }
        }
        return safra;
    }

    @Override
    public Safra buscaPorId(int id) throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT * FROM safra WHERE id_safra = ?";
        Safra safra = null;
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setInt(1, id);
            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                    safra = new Safra(
                        rs.getInt("id_safra"),
                        rs.getInt("id_propriedade"),
                        rs.getInt("id_talhao"),
                        rs.getInt("id_variedade_cultura"),
                        rs.getDate("dt_plantio"),
                        rs.getDate("dt_colheita"),
                        rs.getBigDecimal("producao")
                    );
                }
            }
        }
        return safra;
    }

    @Override
    public List<Safra> listarTodos() throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT * FROM safra ORDER BY id_safra";
        List<Safra> lista = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                Safra safra = new Safra(
                    rs.getInt("id_safra"),
                    rs.getInt("id_propriedade"),
                    rs.getInt("id_talhao"),
                    rs.getInt("id_variedade_cultura"),
                    rs.getDate("dt_plantio"),
                    rs.getDate("dt_colheita"),
                    rs.getBigDecimal("producao")
                );
                lista.add(safra);
            }
        }
        return lista;
    }

    @Override
    public void atualizar(Safra safra) throws SQLException, IOException, ClassNotFoundException {
        String sql = "UPDATE safra SET id_propriedade = ?, id_talhao = ?, id_variedade_cultura = ?, dt_plantio = ?, dt_colheita = ?, producao = ? WHERE id_safra = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setInt(1, safra.getId_propriedade());
            pst.setInt(2, safra.getId_talhao());
            pst.setInt(3, safra.getId_variedade_cultura());
            pst.setDate(4, new java.sql.Date(safra.getDt_plantio().getTime()));
            pst.setDate(5, new java.sql.Date(safra.getDt_colheita().getTime()));
            pst.setBigDecimal(6, safra.getProducao());
            pst.setInt(7, safra.getId_safra());
            pst.executeUpdate();
        }
    }

    @Override
    public void deletar(int id) throws SQLException, IOException, ClassNotFoundException {
        String sql = "DELETE FROM safra WHERE id_safra = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setInt(1, id);
            pst.executeUpdate();
        }
    }
} 