package br.uel.trabalho.sivap.dao;

import br.uel.trabalho.sivap.model.VariedadeCultura;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PgVariedadeCulturaDAO implements VariedadeCulturaDAO {

    @Autowired
    private DataSource dataSource;

    @Override
    public VariedadeCultura inserir(VariedadeCultura variedade) throws SQLException, IOException, ClassNotFoundException {
        String sql = "INSERT INTO variedade_cultura (id_cultura, descricao, resistencia_seca, resistencia_pragas, ciclo_vegetativo_dias, produtividade_nota) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pst.setInt(1, variedade.getId_cultura());
            pst.setString(2, variedade.getDescricao());
            pst.setShort(3, variedade.getResistencia_seca());
            pst.setShort(4, variedade.getResistencia_pragas());
            pst.setInt(5, variedade.getCiclo_vegetativo_dias());
            pst.setShort(6, variedade.getProdutividade_nota());
            pst.executeUpdate();
            try (ResultSet rs = pst.getGeneratedKeys()) {
                if (rs.next()) {
                    variedade.setId_variedade_cultura(rs.getInt(1));
                }
            }
        }
        return variedade;
    }

    @Override
    public VariedadeCultura buscaPorId(int id) throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT * FROM variedade_cultura WHERE id_variedade_cultura = ?";
        VariedadeCultura variedade = null;
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setInt(1, id);
            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                    variedade = new VariedadeCultura(
                        rs.getInt("id_variedade_cultura"),
                        rs.getInt("id_cultura"),
                        rs.getString("descricao"),
                        rs.getShort("resistencia_seca"),
                        rs.getShort("resistencia_pragas"),
                        rs.getInt("ciclo_vegetativo_dias"),
                        rs.getShort("produtividade_nota")
                    );
                }
            }
        }
        return variedade;
    }

    @Override
    public List<VariedadeCultura> listarTodos() throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT * FROM variedade_cultura ORDER BY id_variedade_cultura";
        List<VariedadeCultura> lista = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                VariedadeCultura variedade = new VariedadeCultura(
                    rs.getInt("id_variedade_cultura"),
                    rs.getInt("id_cultura"),
                    rs.getString("descricao"),
                    rs.getShort("resistencia_seca"),
                    rs.getShort("resistencia_pragas"),
                    rs.getInt("ciclo_vegetativo_dias"),
                    rs.getShort("produtividade_nota")
                );
                lista.add(variedade);
            }
        }
        return lista;
    }

    @Override
    public void atualizar(VariedadeCultura variedade) throws SQLException, IOException, ClassNotFoundException {
        String sql = "UPDATE variedade_cultura SET id_cultura = ?, descricao = ?, resistencia_seca = ?, resistencia_pragas = ?, ciclo_vegetativo_dias = ?, produtividade_nota = ? WHERE id_variedade_cultura = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setInt(1, variedade.getId_cultura());
            pst.setString(2, variedade.getDescricao());
            pst.setShort(3, variedade.getResistencia_seca());
            pst.setShort(4, variedade.getResistencia_pragas());
            pst.setInt(5, variedade.getCiclo_vegetativo_dias());
            pst.setShort(6, variedade.getProdutividade_nota());
            pst.setInt(7, variedade.getId_variedade_cultura());
            pst.executeUpdate();
        }
    }

    @Override
    public void deletar(int id) throws SQLException, IOException, ClassNotFoundException {
        String sql = "DELETE FROM variedade_cultura WHERE id_variedade_cultura = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setInt(1, id);
            pst.executeUpdate();
        }
    }
} 