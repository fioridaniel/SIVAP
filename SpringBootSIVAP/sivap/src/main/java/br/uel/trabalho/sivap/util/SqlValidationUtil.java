package br.uel.trabalho.sivap.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.regex.Pattern;

/**
 * Utilitário para validação de consultas SQL e prevenção de SQL injection
 */
public class SqlValidationUtil {
    
    private static final Logger logger = LoggerFactory.getLogger(SqlValidationUtil.class);
    
    // Padrões suspeitos que podem indicar tentativas de SQL injection
    private static final Pattern[] SUSPICIOUS_PATTERNS = {
        Pattern.compile(".*[';\"\\-\\-].*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*(union|select|insert|update|delete|drop|create|alter|exec|execute).*", Pattern.CASE_INSENSITIVE),
        Pattern.compile(".*(script|javascript|vbscript|onload|onerror).*", Pattern.CASE_INSENSITIVE)
    };
    
    /**
     * Valida se uma string contém padrões suspeitos de SQL injection
     * @param input String a ser validada
     * @return true se a string é segura, false caso contrário
     */
    public static boolean isInputSafe(String input) {
        if (input == null || input.trim().isEmpty()) {
            return true; // Entrada vazia é considerada segura
        }
        
        for (Pattern pattern : SUSPICIOUS_PATTERNS) {
            if (pattern.matcher(input).matches()) {
                logger.warn("Entrada suspeita detectada: {}", input);
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Valida se um parâmetro numérico está dentro de limites aceitáveis
     * @param value Valor a ser validado
     * @param min Valor mínimo aceitável
     * @param max Valor máximo aceitável
     * @return true se o valor está dentro dos limites
     */
    public static boolean isNumericParameterValid(Number value, Number min, Number max) {
        if (value == null) {
            return false;
        }
        
        double val = value.doubleValue();
        double minVal = min.doubleValue();
        double maxVal = max.doubleValue();
        
        return val >= minVal && val <= maxVal;
    }
    
    /**
     * Cria um PreparedStatement com logging para auditoria
     * @param connection Conexão com o banco
     * @param sql Query SQL
     * @return PreparedStatement configurado
     * @throws SQLException Se houver erro na criação
     */
    public static PreparedStatement createSafePreparedStatement(Connection connection, String sql) throws SQLException {
        logger.debug("Executando consulta SQL: {}", sql);
        
        // Verificar se a consulta contém apenas operações de leitura (SELECT)
        if (!sql.trim().toUpperCase().startsWith("SELECT")) {
            logger.warn("Tentativa de executar operação não-SELECT: {}", sql);
            throw new SQLException("Apenas consultas SELECT são permitidas nos relatórios");
        }
        
        return connection.prepareStatement(sql);
    }
    
    /**
     * Valida se o resultado de uma consulta não está vazio de forma suspeita
     * @param resultCount Número de resultados retornados
     * @param queryType Tipo da consulta para contexto
     * @return true se o resultado é válido
     */
    public static boolean isResultSetValid(int resultCount, String queryType) {
        logger.info("Consulta {} retornou {} registros", queryType, resultCount);
        
        // Para relatórios, é normal ter 0 resultados em alguns casos
        // Mas vamos logar para monitoramento
        if (resultCount == 0) {
            logger.info("Consulta {} não retornou dados - pode indicar ausência de dados ou problema na consulta", queryType);
        }
        
        // Verificar se há um número excessivo de resultados (possível problema de performance)
        if (resultCount > 10000) {
            logger.warn("Consulta {} retornou {} registros - número muito alto, pode impactar performance", queryType, resultCount);
        }
        
        return true;
    }
    
    /**
     * Sanitiza uma string removendo caracteres potencialmente perigosos
     * @param input String a ser sanitizada
     * @return String sanitizada
     */
    public static String sanitizeInput(String input) {
        if (input == null) {
            return null;
        }
        
        // Remove caracteres especiais comuns em ataques SQL injection
        String sanitized = input.replaceAll("[';\"\\-\\-]", "");
        sanitized = sanitized.replaceAll("(?i)\\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\\b", "");
        return sanitized.trim();
    }
}