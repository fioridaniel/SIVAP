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

    private VariedadeCultura fromResultSet(ResultSet rs) throws SQLException {
        VariedadeCultura variedade = new VariedadeCultura();
        variedade.setId_variedade_cultura(rs.getInt("id_variedade_cultura"));
        variedade.setId_cultura(rs.getInt("id_cultura"));
        variedade.setDescricao(rs.getString("descricao"));
        variedade.setResistencia_seca(rs.getShort("resistencia_seca"));
        variedade.setResistencia_pragas(rs.getShort("resistencia_pragas"));
        variedade.setCiclo_vegetativo_dias(rs.getInt("ciclo_vegetativo_dias"));
        variedade.setProdutividade_nota(rs.getShort("produtividade_nota"));
        // Verifica se a coluna nome_cultura existe no resultado
        if (hasColumn(rs, "nome_cultura")) {
            variedade.setNome_cultura(rs.getString("nome_cultura"));
        }
        return variedade;
    }

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
        String sql = "SELECT vc.*, c.nome_cultura FROM variedade_cultura vc JOIN cultura c ON vc.id_cultura = c.id_cultura WHERE vc.id_variedade_cultura = ?";
        VariedadeCultura variedade = null;
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setInt(1, id);
            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                    variedade = fromResultSet(rs);
                }
            }
        }
        return variedade;
    }

    @Override
    public List<VariedadeCultura> listarTodos() throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT vc.*, c.nome_cultura FROM variedade_cultura vc JOIN cultura c ON vc.id_cultura = c.id_cultura ORDER BY c.nome_cultura, vc.descricao";
        List<VariedadeCultura> lista = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                lista.add(fromResultSet(rs));
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

    @Override
    public List<Object[]> variedadesComProducaoPorPropriedade(int idPropriedade) throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT " +
                "vc.id_variedade_cultura, " +
                "c.nome_cultura, " +
                "SUM(s.producao) AS total_produzido " +
                "FROM safra s " +
                "JOIN variedade_cultura vc ON s.id_variedade_cultura = vc.id_variedade_cultura " +
                "JOIN cultura c ON vc.id_cultura = c.id_cultura " +
                "JOIN talhao t ON s.id_talhao = t.id_talhao " +
                "WHERE t.id_propriedade = ? " +
                "GROUP BY vc.id_variedade_cultura, c.nome_cultura " +
                "ORDER BY total_produzido DESC";
        
        List<Object[]> resultado = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setInt(1, idPropriedade);
            try (ResultSet rs = pst.executeQuery()) {
                while (rs.next()) {
                    Object[] linha = new Object[3];
                    linha[0] = rs.getInt("id_variedade_cultura");
                    linha[1] = rs.getString("nome_cultura");
                    linha[2] = rs.getDouble("total_produzido");
                    resultado.add(linha);
                }
            }
        }
        return resultado;
    }

    private boolean hasColumn(ResultSet rs, String columnName) throws SQLException {
        ResultSetMetaData rsmd = rs.getMetaData();
        int columns = rsmd.getColumnCount();
        for (int x = 1; x <= columns; x++) {
            if (columnName.equals(rsmd.getColumnName(x))) {
                return true;
            }
        }
        return false;
    }
} 