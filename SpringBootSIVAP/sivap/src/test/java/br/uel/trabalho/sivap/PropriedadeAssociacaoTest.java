package br.uel.trabalho.sivap;

import br.uel.trabalho.sivap.dao.PgPropriedadeDAO;
import br.uel.trabalho.sivap.model.Propriedade;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class PropriedadeAssociacaoTest {

    @Autowired
    private PgPropriedadeDAO propriedadeDAO;

    @Test
    public void testAssociacaoPropriedadeProdutor() throws SQLException, IOException, ClassNotFoundException {
        // CPF de teste (deve existir no banco)
        String cpfProdutor = "43091258670";
        
        // Criar uma propriedade de teste
        Propriedade propriedade = new Propriedade(0, "Propriedade Teste Associação", 
                new BigDecimal("-23.5505"), new BigDecimal("-46.6333"), new BigDecimal("100.50"));
        
        // Inserir a propriedade
        Propriedade propriedadeInserida = propriedadeDAO.inserir(propriedade);
        assertNotNull(propriedadeInserida.getId());
        
        // Associar ao produtor
        propriedadeDAO.associarProdutor(propriedadeInserida.getId(), cpfProdutor);
        
        // Verificar se a propriedade aparece na lista do produtor
        List<Propriedade> propriedadesDoProdutor = propriedadeDAO.buscarPropriedadesDoProdutor(cpfProdutor);
        
        boolean propriedadeEncontrada = propriedadesDoProdutor.stream()
                .anyMatch(p -> p.getId() == propriedadeInserida.getId());
        
        assertTrue(propriedadeEncontrada, "A propriedade deve aparecer na lista do produtor");
        
        // Verificar se o produtor aparece na lista da propriedade
        List<br.uel.trabalho.sivap.model.ProdutorRural> produtoresDaPropriedade = 
                propriedadeDAO.buscarProdutoresDaPropriedade(propriedadeInserida.getId());
        
        boolean produtorEncontrado = produtoresDaPropriedade.stream()
                .anyMatch(p -> p.getCpf().equals(cpfProdutor));
        
        assertTrue(produtorEncontrado, "O produtor deve aparecer na lista da propriedade");
        
        // Limpeza - desassociar e deletar a propriedade
        propriedadeDAO.desassociarProdutor(propriedadeInserida.getId(), cpfProdutor);
        propriedadeDAO.deletar(propriedadeInserida.getId());
    }
} 