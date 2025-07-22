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
public class RelatorioProdutividadeController {

    private static final Logger logger = LoggerFactory.getLogger(RelatorioProdutividadeController.class);

    @Autowired
    private DataSource dataSource;

    @GetMapping("/produtividade")
    public ResponseEntity<?> relatorioProdutividade() {
        logger.info("Iniciando consulta do relatório de produtividade");
        
        try {
            String sql = """
                SELECT 
                    p.nome as propriedade,
                    SUM(s.producao) as producao_total,
                    p.area,
                    ROUND(SUM(s.producao)/p.area, 2) as produtividade
                FROM propriedade p 
                JOIN safra s ON p.id = s.id_propriedade
                GROUP BY p.id, p.nome, p.area
                ORDER BY produtividade DESC
                """;

            List<Map<String, Object>> dados = new ArrayList<>();

            try (Connection conn = dataSource.getConnection();
                 PreparedStatement pst = SqlValidationUtil.createSafePreparedStatement(conn, sql);
                 ResultSet rs = pst.executeQuery()) {

                while (rs.next()) {
                    Map<String, Object> item = new HashMap<>();
                    item.put("propriedade", rs.getString("propriedade"));
                    item.put("producao_total", rs.getBigDecimal("producao_total"));
                    item.put("area", rs.getBigDecimal("area"));
                    item.put("produtividade", rs.getBigDecimal("produtividade"));
                    dados.add(item);
                }
            }

            // Validar resultado
            SqlValidationUtil.isResultSetValid(dados.size(), "produtividade");
            logger.info("Relatório de produtividade carregado com sucesso. {} registros encontrados", dados.size());
            return ResponseEntity.ok(dados);

        } catch (SQLException e) {
            logger.error("Erro SQL ao carregar relatório de produtividade: {}", e.getMessage(), e);
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "Erro ao carregar dados do relatório de produtividade");
            erro.put("detalhes", "Verifique se o banco de dados está acessível e se existem dados válidos");
            erro.put("codigo", "SQL_ERROR");
            return ResponseEntity.status(500).body(erro);
        } catch (Exception e) {
            logger.error("Erro inesperado ao carregar relatório de produtividade: {}", e.getMessage(), e);
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "Erro interno do servidor");
            erro.put("detalhes", "Ocorreu um erro inesperado. Tente novamente mais tarde");
            erro.put("codigo", "INTERNAL_ERROR");
            return ResponseEntity.status(500).body(erro);
        }
    }
}