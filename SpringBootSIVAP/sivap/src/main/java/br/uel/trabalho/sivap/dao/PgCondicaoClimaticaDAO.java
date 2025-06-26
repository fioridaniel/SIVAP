package br.uel.trabalho.sivap.dao;

import br.uel.trabalho.sivap.model.CondicaoClimatica;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PgCondicaoClimaticaDAO implements CondicaoClimaticaDAO {

    @Autowired
    private DataSource dataSource;

    @Override
    public CondicaoClimatica inserir(CondicaoClimatica condicao) throws SQLException, IOException, ClassNotFoundException {
        String sql = "INSERT INTO condicao_climatica (id_safra, precipitacao_mm, distribuicao_chuva_nota, velocidade_max_vento_kmh, temperatura_media_c, observacoes) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pst.setInt(1, condicao.getId_safra());
            pst.setBigDecimal(2, condicao.getPrecipitacao_mm());
            pst.setShort(3, condicao.getDistribuicao_chuva_nota());
            pst.setBigDecimal(4, condicao.getVelocidade_vento_kmh());
            pst.setBigDecimal(5, condicao.getTemperatura_media_c());
            pst.setString(6, condicao.getObservacoes());
            pst.executeUpdate();
            try (ResultSet rs = pst.getGeneratedKeys()) {
                if (rs.next()) {
                    condicao.setId_condicao_climatica(rs.getInt(1));
                }
            }
        }
        return condicao;
    }

    @Override
    public CondicaoClimatica buscaPorId(int id) throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT * FROM condicao_climatica WHERE id_condicao_climatica = ?";
        CondicaoClimatica condicao = null;
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setInt(1, id);
            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                    condicao = new CondicaoClimatica(
                        rs.getInt("id_condicao_climatica"),
                        rs.getInt("id_safra"),
                        rs.getBigDecimal("precipitacao_mm"),
                        rs.getShort("distribuicao_chuva_nota"),
                        rs.getBigDecimal("velocidade_max_vento_kmh"),
                        rs.getBigDecimal("temperatura_media_c"),
                        rs.getString("observacoes")
                    );
                }
            }
        }
        return condicao;
    }

    @Override
    public List<CondicaoClimatica> listarTodos() throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT * FROM condicao_climatica ORDER BY id_condicao_climatica";
        List<CondicaoClimatica> lista = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                CondicaoClimatica condicao = new CondicaoClimatica(
                    rs.getInt("id_condicao_climatica"),
                    rs.getInt("id_safra"),
                    rs.getBigDecimal("precipitacao_mm"),
                    rs.getShort("distribuicao_chuva_nota"),
                    rs.getBigDecimal("velocidade_max_vento_kmh"),
                    rs.getBigDecimal("temperatura_media_c"),
                    rs.getString("observacoes")
                );
                lista.add(condicao);
            }
        }
        return lista;
    }

    @Override
    public void atualizar(CondicaoClimatica condicao) throws SQLException, IOException, ClassNotFoundException {
        String sql = "UPDATE condicao_climatica SET id_safra = ?, precipitacao_mm = ?, distribuicao_chuva_nota = ?, velocidade_max_vento_kmh = ?, temperatura_media_c = ?, observacoes = ? WHERE id_condicao_climatica = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setInt(1, condicao.getId_safra());
            pst.setBigDecimal(2, condicao.getPrecipitacao_mm());
            pst.setShort(3, condicao.getDistribuicao_chuva_nota());
            pst.setBigDecimal(4, condicao.getVelocidade_vento_kmh());
            pst.setBigDecimal(5, condicao.getTemperatura_media_c());
            pst.setString(6, condicao.getObservacoes());
            pst.setInt(7, condicao.getId_condicao_climatica());
            pst.executeUpdate();
        }
    }

    @Override
    public void deletar(int id) throws SQLException, IOException, ClassNotFoundException {
        String sql = "DELETE FROM condicao_climatica WHERE id_condicao_climatica = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {
            pst.setInt(1, id);
            pst.executeUpdate();
        }
    }
} 