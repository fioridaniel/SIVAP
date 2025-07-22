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
public class RelatorioProdutoresController {

    private static final Logger logger = LoggerFactory.getLogger(RelatorioProdutoresController.class);

    @Autowired
    private DataSource dataSource;

    @GetMapping("/produtores")
    public ResponseEntity<?> relatorioProdutores() {
        logger.info("Iniciando consulta do relatório de produtores");
        
        try {
            String sql = """
                SELECT 
                    pr.nome as produtor,
                    COUNT(DISTINCT pp.id_propriedade) as num_propriedades,
                    COUNT(s.id_safra) as total_safras
                FROM produtor_rural pr
                JOIN produtor_propriedade pp ON pr.cpf = pp.cpf_produtor_rural
                JOIN safra s ON pp.id_propriedade = s.id_propriedade
                GROUP BY pr.cpf, pr.nome
                HAVING COUNT(s.id_safra) > 2
                ORDER BY total_safras DESC
                """;

            List<Map<String, Object>> dados = new ArrayList<>();

            try (Connection conn = dataSource.getConnection();
                 PreparedStatement pst = SqlValidationUtil.createSafePreparedStatement(conn, sql);
                 ResultSet rs = pst.executeQuery()) {

                while (rs.next()) {
                    Map<String, Object> item = new HashMap<>();
                    item.put("produtor", rs.getString("produtor"));
                    item.put("num_propriedades", rs.getInt("num_propriedades"));
                    item.put("total_safras", rs.getInt("total_safras"));
                    dados.add(item);
                }
            }

            // Validar resultado
            SqlValidationUtil.isResultSetValid(dados.size(), "produtores");
            logger.info("Relatório de produtores carregado com sucesso. {} registros encontrados", dados.size());
            return ResponseEntity.ok(dados);

        } catch (SQLException e) {
            logger.error("Erro SQL ao carregar relatório de produtores: {}", e.getMessage(), e);
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "Erro ao carregar dados do relatório de produtores");
            erro.put("detalhes", "Verifique se o banco de dados está acessível e se existem dados válidos");
            erro.put("codigo", "SQL_ERROR");
            return ResponseEntity.status(500).body(erro);
        } catch (Exception e) {
            logger.error("Erro inesperado ao carregar relatório de produtores: {}", e.getMessage(), e);
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "Erro interno do servidor");
            erro.put("detalhes", "Ocorreu um erro inesperado. Tente novamente mais tarde");
            erro.put("codigo", "INTERNAL_ERROR");
            return ResponseEntity.status(500).body(erro);
        }
    }
}