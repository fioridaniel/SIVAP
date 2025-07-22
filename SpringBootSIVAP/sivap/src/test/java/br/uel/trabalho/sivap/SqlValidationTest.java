package br.uel.trabalho.sivap;

import br.uel.trabalho.sivap.util.SqlValidationUtil;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Testes básicos para validação SQL
 */
public class SqlValidationTest {

    @Test
    public void testInputSafeValidation() {
        // Testes com entradas seguras
        assertTrue(SqlValidationUtil.isInputSafe("João Silva"));
        assertTrue(SqlValidationUtil.isInputSafe("Propriedade Rural 123"));
        assertTrue(SqlValidationUtil.isInputSafe(""));
        assertTrue(SqlValidationUtil.isInputSafe(null));
        
        // Testes com entradas suspeitas
        assertFalse(SqlValidationUtil.isInputSafe("'; DROP TABLE users; --"));
        assertFalse(SqlValidationUtil.isInputSafe("1' OR '1'='1"));
        assertFalse(SqlValidationUtil.isInputSafe("UNION SELECT * FROM users"));
        assertFalse(SqlValidationUtil.isInputSafe("<script>alert('xss')</script>"));
    }

    @Test
    public void testNumericParameterValidation() {
        // Testes com valores válidos
        assertTrue(SqlValidationUtil.isNumericParameterValid(5, 1, 10));
        assertTrue(SqlValidationUtil.isNumericParameterValid(1, 1, 10));
        assertTrue(SqlValidationUtil.isNumericParameterValid(10, 1, 10));
        
        // Testes com valores inválidos
        assertFalse(SqlValidationUtil.isNumericParameterValid(0, 1, 10));
        assertFalse(SqlValidationUtil.isNumericParameterValid(11, 1, 10));
        assertFalse(SqlValidationUtil.isNumericParameterValid(null, 1, 10));
    }

    @Test
    public void testResultSetValidation() {
        // Todos os casos devem retornar true (apenas para logging)
        assertTrue(SqlValidationUtil.isResultSetValid(0, "test"));
        assertTrue(SqlValidationUtil.isResultSetValid(10, "test"));
        assertTrue(SqlValidationUtil.isResultSetValid(1000, "test"));
        assertTrue(SqlValidationUtil.isResultSetValid(15000, "test")); // Deve gerar warning
    }

    @Test
    public void testInputSanitization() {
        assertEquals("João Silva", SqlValidationUtil.sanitizeInput("João Silva"));
        assertEquals("Test  TABLE", SqlValidationUtil.sanitizeInput("Test'; DROP TABLE"));
        assertEquals("Normal text", SqlValidationUtil.sanitizeInput("Normal text"));
        assertNull(SqlValidationUtil.sanitizeInput(null));
        assertEquals("", SqlValidationUtil.sanitizeInput(""));
        
        // Test that SQL keywords are removed
        assertEquals("Test  users", SqlValidationUtil.sanitizeInput("Test SELECT users"));
        assertEquals("Data", SqlValidationUtil.sanitizeInput("Data'; INSERT"));
    }
}