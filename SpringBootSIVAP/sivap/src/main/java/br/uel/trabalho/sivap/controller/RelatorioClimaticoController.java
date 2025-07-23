package br.uel.trabalho.sivap.controller;

import br.uel.trabalho.sivap.util.SqlValidationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/relatorios")
@CrossOrigin(origins = "*")
public class RelatorioClimaticoController {

    private static final Logger logger = LoggerFactory.getLogger(RelatorioClimaticoController.class);

    @Autowired
    private DataSource dataSource;

    @GetMapping("/climatico")
    public ResponseEntity<?> relatorioClimatico() {
        logger.info("Iniciando consulta do relatório climático");
        
        try {
            String sql = """
                SELECT 
                    c.nome_cultura,
                    ROUND(AVG(cc.temperatura_media_c), 2) as temp_media,
                    ROUND(AVG(cc.precipitacao_mm), 2) as precipitacao_media,
                    ROUND(AVG(s.producao), 2) as producao_media
                FROM cultura c
                JOIN variedade_cultura vc ON c.id_cultura = vc.id_cultura
                JOIN safra s ON vc.id_variedade_cultura = s.id_variedade_cultura
                JOIN condicao_climatica cc ON s.id_safra = cc.id_safra
                WHERE cc.temperatura_media_c IS NOT NULL 
                  AND cc.precipitacao_mm IS NOT NULL
                  AND s.producao IS NOT NULL
                GROUP BY c.nome_cultura
                ORDER BY producao_media DESC
                """;

            List<Map<String, Object>> dados = new ArrayList<>();

            try (Connection conn = dataSource.getConnection();
                 PreparedStatement pst = SqlValidationUtil.createSafePreparedStatement(conn, sql);
                 ResultSet rs = pst.executeQuery()) {

                while (rs.next()) {
                    Map<String, Object> item = new HashMap<>();
                    item.put("nome_cultura", rs.getString("nome_cultura"));
                    item.put("temp_media", rs.getBigDecimal("temp_media"));
                    item.put("precipitacao_media", rs.getBigDecimal("precipitacao_media"));
                    item.put("producao_media", rs.getBigDecimal("producao_media"));
                    dados.add(item);
                }
            }

            // Validar resultado
            SqlValidationUtil.isResultSetValid(dados.size(), "climatico");
            logger.info("Relatório climático carregado com sucesso. {} registros encontrados", dados.size());
            return ResponseEntity.ok(dados);

        } catch (SQLException e) {
            logger.error("Erro SQL ao carregar relatório climático: {}", e.getMessage(), e);
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "Erro ao carregar dados do relatório climático");
            erro.put("detalhes", "Verifique se o banco de dados está acessível e se existem dados válidos");
            erro.put("codigo", "SQL_ERROR");
            return ResponseEntity.status(500).body(erro);
        } catch (Exception e) {
            logger.error("Erro inesperado ao carregar relatório climático: {}", e.getMessage(), e);
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "Erro interno do servidor");
            erro.put("detalhes", "Ocorreu um erro inesperado. Tente novamente mais tarde");
            erro.put("codigo", "INTERNAL_ERROR");
            return ResponseEntity.status(500).body(erro);
        }
    }
}