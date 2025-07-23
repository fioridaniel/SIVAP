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
public class RelatorioTemporalController {

    private static final Logger logger = LoggerFactory.getLogger(RelatorioTemporalController.class);

    @Autowired
    private DataSource dataSource;

    @GetMapping("/temporal")
    public ResponseEntity<?> relatorioTemporal() {
        logger.info("Iniciando consulta do relatório temporal");
        
        try {
            String sql = """
                SELECT 
                    EXTRACT(YEAR FROM s.dt_colheita) as ano,
                    SUM(s.producao) as producao_total,
                    ROUND(AVG(s.producao), 2) as producao_media,
                    COUNT(s.id_safra) as total_safras
                FROM safra s
                WHERE s.dt_colheita IS NOT NULL
                GROUP BY EXTRACT(YEAR FROM s.dt_colheita)
                ORDER BY ano
                """;

            List<Map<String, Object>> dados = new ArrayList<>();

            try (Connection conn = dataSource.getConnection();
                 PreparedStatement pst = SqlValidationUtil.createSafePreparedStatement(conn, sql);
                 ResultSet rs = pst.executeQuery()) {

                while (rs.next()) {
                    Map<String, Object> item = new HashMap<>();
                    item.put("ano", rs.getInt("ano"));
                    item.put("producao_total", rs.getBigDecimal("producao_total"));
                    item.put("producao_media", rs.getBigDecimal("producao_media"));
                    item.put("total_safras", rs.getInt("total_safras"));
                    dados.add(item);
                }
            }

            // Validar resultado
            SqlValidationUtil.isResultSetValid(dados.size(), "temporal");
            logger.info("Relatório temporal carregado com sucesso. {} registros encontrados", dados.size());
            return ResponseEntity.ok(dados);

        } catch (SQLException e) {
            logger.error("Erro SQL ao carregar relatório temporal: {}", e.getMessage(), e);
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "Erro ao carregar dados do relatório temporal");
            erro.put("detalhes", "Verifique se o banco de dados está acessível e se existem dados válidos");
            erro.put("codigo", "SQL_ERROR");
            return ResponseEntity.status(500).body(erro);
        } catch (Exception e) {
            logger.error("Erro inesperado ao carregar relatório temporal: {}", e.getMessage(), e);
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "Erro interno do servidor");
            erro.put("detalhes", "Ocorreu um erro inesperado. Tente novamente mais tarde");
            erro.put("codigo", "INTERNAL_ERROR");
            return ResponseEntity.status(500).body(erro);
        }
    }
}