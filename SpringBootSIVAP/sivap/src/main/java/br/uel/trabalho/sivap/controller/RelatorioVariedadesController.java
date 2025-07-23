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
public class RelatorioVariedadesController {

    private static final Logger logger = LoggerFactory.getLogger(RelatorioVariedadesController.class);

    @Autowired
    private DataSource dataSource;

    @GetMapping("/variedades")
    public ResponseEntity<?> relatorioVariedades() {
        logger.info("Iniciando consulta do relatório de variedades");
        
        try {
            String sql = """
                SELECT 
                    c.nome_cultura,
                    vc.descricao as variedade,
                    COUNT(s.id_safra) as total_plantios
                FROM cultura c 
                JOIN variedade_cultura vc ON c.id_cultura = vc.id_cultura
                JOIN safra s ON vc.id_variedade_cultura = s.id_variedade_cultura
                GROUP BY c.nome_cultura, vc.descricao
                ORDER BY total_plantios DESC
                """;

            List<Map<String, Object>> dados = new ArrayList<>();

            try (Connection conn = dataSource.getConnection();
                 PreparedStatement pst = SqlValidationUtil.createSafePreparedStatement(conn, sql);
                 ResultSet rs = pst.executeQuery()) {

                while (rs.next()) {
                    Map<String, Object> item = new HashMap<>();
                    item.put("nome_cultura", rs.getString("nome_cultura"));
                    item.put("variedade", rs.getString("variedade"));
                    item.put("total_plantios", rs.getInt("total_plantios"));
                    dados.add(item);
                }
            }

            // Validar resultado
            SqlValidationUtil.isResultSetValid(dados.size(), "variedades");
            logger.info("Relatório de variedades carregado com sucesso. {} registros encontrados", dados.size());
            return ResponseEntity.ok(dados);

        } catch (SQLException e) {
            logger.error("Erro SQL ao carregar relatório de variedades: {}", e.getMessage(), e);
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "Erro ao carregar dados do relatório de variedades");
            erro.put("detalhes", "Verifique se o banco de dados está acessível e se existem dados válidos");
            erro.put("codigo", "SQL_ERROR");
            return ResponseEntity.status(500).body(erro);
        } catch (Exception e) {
            logger.error("Erro inesperado ao carregar relatório de variedades: {}", e.getMessage(), e);
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "Erro interno do servidor");
            erro.put("detalhes", "Ocorreu um erro inesperado. Tente novamente mais tarde");
            erro.put("codigo", "INTERNAL_ERROR");
            return ResponseEntity.status(500).body(erro);
        }
    }
}