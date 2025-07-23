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
public class RelatorioResistenciaController {

    private static final Logger logger = LoggerFactory.getLogger(RelatorioResistenciaController.class);

    @Autowired
    private DataSource dataSource;

    @GetMapping("/resistencia")
    public ResponseEntity<?> relatorioResistencia() {
        logger.info("Iniciando consulta do relatório de resistência");
        
        try {
            String sql = """
                SELECT 
                    vc.descricao as variedade,
                    vc.resistencia_seca,
                    vc.resistencia_pragas,
                    vc.produtividade_nota
                FROM variedade_cultura vc
                WHERE vc.resistencia_seca > (
                    SELECT AVG(resistencia_seca) FROM variedade_cultura
                    WHERE resistencia_seca IS NOT NULL
                )
                AND vc.resistencia_seca IS NOT NULL
                AND vc.resistencia_pragas IS NOT NULL
                AND vc.produtividade_nota IS NOT NULL
                ORDER BY vc.produtividade_nota DESC, vc.resistencia_seca DESC
                """;

            List<Map<String, Object>> dados = new ArrayList<>();

            try (Connection conn = dataSource.getConnection();
                 PreparedStatement pst = SqlValidationUtil.createSafePreparedStatement(conn, sql);
                 ResultSet rs = pst.executeQuery()) {

                while (rs.next()) {
                    Map<String, Object> item = new HashMap<>();
                    item.put("variedade", rs.getString("variedade"));
                    item.put("resistencia_seca", rs.getInt("resistencia_seca"));
                    item.put("resistencia_pragas", rs.getInt("resistencia_pragas"));
                    item.put("produtividade_nota", rs.getInt("produtividade_nota"));
                    dados.add(item);
                }
            }

            // Validar resultado
            SqlValidationUtil.isResultSetValid(dados.size(), "resistencia");
            logger.info("Relatório de resistência carregado com sucesso. {} registros encontrados", dados.size());
            return ResponseEntity.ok(dados);

        } catch (SQLException e) {
            logger.error("Erro SQL ao carregar relatório de resistência: {}", e.getMessage(), e);
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "Erro ao carregar dados do relatório de resistência");
            erro.put("detalhes", "Verifique se o banco de dados está acessível e se existem dados válidos");
            erro.put("codigo", "SQL_ERROR");
            return ResponseEntity.status(500).body(erro);
        } catch (Exception e) {
            logger.error("Erro inesperado ao carregar relatório de resistência: {}", e.getMessage(), e);
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "Erro interno do servidor");
            erro.put("detalhes", "Ocorreu um erro inesperado. Tente novamente mais tarde");
            erro.put("codigo", "INTERNAL_ERROR");
            return ResponseEntity.status(500).body(erro);
        }
    }
}