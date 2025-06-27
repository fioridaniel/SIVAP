package br.uel.trabalho.sivap;

import br.uel.trabalho.sivap.dao.*;
import br.uel.trabalho.sivap.model.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Random;

@SpringBootTest
@Transactional // Garante rollback após cada teste
public class DAOTest {
    @Autowired
    private PgProdutorRuralDAO produtorRuralDAO;
    @Autowired
    private PgPropriedadeDAO propriedadeDAO;
    @Autowired
    private PgCulturaDAO culturaDAO;
    @Autowired
    private PgVariedadeCulturaDAO variedadeCulturaDAO;
    @Autowired
    private PgTalhaoDAO talhaoDAO;
    @Autowired
    private PgSafraDAO safraDAO;
    @Autowired
    private PgCondicaoClimaticaDAO condicaoClimaticaDAO;

    private final Random random = new Random();

    private String gerarNomeUnico(String prefixo) {
        return prefixo + "_" + System.currentTimeMillis() % 10000;
    }

    private String gerarNomeCulturaUnico(String prefixo) {
        // Limita a 30 caracteres para o campo nome_cultura
        String nome = prefixo + "_" + System.currentTimeMillis() % 1000;
        return nome.length() > 30 ? nome.substring(0, 30) : nome;
    }

    private BigDecimal gerarCoordenadaUnica(double min, double max) {
        return new BigDecimal(String.valueOf(min + random.nextDouble() * (max - min)));
    }

    @Test
    void testCRUDProdutorRural() throws Exception {
        // Criação
        String cpfUnico = "999" + System.currentTimeMillis() % 100000000;
        ProdutorRural produtor = new ProdutorRural(cpfUnico, gerarNomeUnico("Teste Produtor"), 'm', new Date());
        produtorRuralDAO.inserir(produtor);
        // Leitura
        ProdutorRural encontrado = produtorRuralDAO.buscarPorCpf(cpfUnico);
        Assertions.assertNotNull(encontrado);
        Assertions.assertEquals(produtor.getNome(), encontrado.getNome());
        // Atualização
        encontrado.setNome(gerarNomeUnico("Produtor Atualizado"));
        produtorRuralDAO.atualizar(encontrado);
        ProdutorRural atualizado = produtorRuralDAO.buscarPorCpf(cpfUnico);
        Assertions.assertEquals(encontrado.getNome(), atualizado.getNome());
        // Deleção
        produtorRuralDAO.deletar(cpfUnico);
        Assertions.assertNull(produtorRuralDAO.buscarPorCpf(cpfUnico));
    }

    @Test
    void testCRUDPropriedade() throws Exception {
        String nomeUnico = gerarNomeUnico("Fazenda Teste");
        BigDecimal lat = gerarCoordenadaUnica(-25.0, -20.0);
        BigDecimal lon = gerarCoordenadaUnica(-55.0, -50.0);
        
        Propriedade prop = new Propriedade(0, nomeUnico, lat, lon, new BigDecimal("100.0"));
        propriedadeDAO.inserir(prop);
        Propriedade encontrada = propriedadeDAO.buscaPorId(prop.getId());
        Assertions.assertNotNull(encontrada);
        Assertions.assertEquals(nomeUnico, encontrada.getNome());
        encontrada.setNome(gerarNomeUnico("Fazenda Atualizada"));
        propriedadeDAO.atualizar(encontrada);
        Propriedade atualizada = propriedadeDAO.buscaPorId(prop.getId());
        Assertions.assertEquals(encontrada.getNome(), atualizada.getNome());
        propriedadeDAO.deletar(prop.getId());
        Assertions.assertNull(propriedadeDAO.buscaPorId(prop.getId()));
    }

    @Test
    void testCRUDCultura() throws Exception {
        String nomeUnico = gerarNomeCulturaUnico("Cultura Teste");
        Cultura cultura = new Cultura(0, nomeUnico);
        culturaDAO.inserir(cultura);
        Cultura encontrada = culturaDAO.buscaPorId(cultura.getId_cultura());
        Assertions.assertNotNull(encontrada);
        Assertions.assertEquals(nomeUnico, encontrada.getNome_cultura());
        encontrada.setNome_cultura(gerarNomeCulturaUnico("Cultura Atualizada"));
        culturaDAO.atualizar(encontrada);
        Cultura atualizada = culturaDAO.buscaPorId(cultura.getId_cultura());
        Assertions.assertEquals(encontrada.getNome_cultura(), atualizada.getNome_cultura());
        culturaDAO.deletar(cultura.getId_cultura());
        Assertions.assertNull(culturaDAO.buscaPorId(cultura.getId_cultura()));
    }

    @Test
    void testCRUDVariedadeCultura() throws Exception {
        // Primeiro, criar uma cultura para a FK
        String nomeCulturaUnico = gerarNomeCulturaUnico("Cultura para Variedade");
        Cultura cultura = new Cultura(0, nomeCulturaUnico);
        culturaDAO.inserir(cultura);
        
        String descricaoUnica = gerarNomeUnico("Variedade Teste");
        VariedadeCultura variedade = new VariedadeCultura(0, cultura.getId_cultura(), descricaoUnica, (short)5, (short)6, 90, (short)8);
        variedadeCulturaDAO.inserir(variedade);
        VariedadeCultura encontrada = variedadeCulturaDAO.buscaPorId(variedade.getId_variedade_cultura());
        Assertions.assertNotNull(encontrada);
        Assertions.assertEquals(descricaoUnica, encontrada.getDescricao());
        encontrada.setDescricao(gerarNomeUnico("Variedade Atualizada"));
        variedadeCulturaDAO.atualizar(encontrada);
        VariedadeCultura atualizada = variedadeCulturaDAO.buscaPorId(variedade.getId_variedade_cultura());
        Assertions.assertEquals(encontrada.getDescricao(), atualizada.getDescricao());
        variedadeCulturaDAO.deletar(variedade.getId_variedade_cultura());
        Assertions.assertNull(variedadeCulturaDAO.buscaPorId(variedade.getId_variedade_cultura()));
        culturaDAO.deletar(cultura.getId_cultura()); // Limpeza
    }

    @Test
    void testCRUDTalhao() throws Exception {
        // Primeiro, criar uma propriedade para a FK
        String nomePropUnico = gerarNomeUnico("Propriedade Talhao");
        BigDecimal lat = gerarCoordenadaUnica(-25.0, -20.0);
        BigDecimal lon = gerarCoordenadaUnica(-55.0, -50.0);
        
        Propriedade prop = new Propriedade(0, nomePropUnico, lat, lon, new BigDecimal("50.0"));
        propriedadeDAO.inserir(prop);
        Talhao talhao = new Talhao(prop.getId(), 0, new BigDecimal("20.0"));
        talhaoDAO.inserir(talhao);
        Talhao encontrado = talhaoDAO.buscaPorId(prop.getId(), talhao.getId_talhao());
        Assertions.assertNotNull(encontrado);
        Assertions.assertEquals(0, new BigDecimal("20.0").compareTo(encontrado.getArea()));
        encontrado.setArea(new BigDecimal("25.0"));
        talhaoDAO.atualizar(encontrado);
        Talhao atualizado = talhaoDAO.buscaPorId(prop.getId(), talhao.getId_talhao());
        Assertions.assertEquals(0, new BigDecimal("25.0").compareTo(atualizado.getArea()));
        talhaoDAO.deletar(prop.getId(), talhao.getId_talhao());
        Assertions.assertNull(talhaoDAO.buscaPorId(prop.getId(), talhao.getId_talhao()));
        propriedadeDAO.deletar(prop.getId()); // Limpeza
    }

    @Test
    void testCRUDSafra() throws Exception {
        // Criar dependências: propriedade, talhao, cultura, variedade
        String nomePropUnico = gerarNomeUnico("Propriedade Safra");
        BigDecimal lat = gerarCoordenadaUnica(-25.0, -20.0);
        BigDecimal lon = gerarCoordenadaUnica(-55.0, -50.0);
        
        Propriedade prop = new Propriedade(0, nomePropUnico, lat, lon, new BigDecimal("60.0"));
        propriedadeDAO.inserir(prop);
        Talhao talhao = new Talhao(prop.getId(), 0, new BigDecimal("30.0"));
        talhaoDAO.inserir(talhao);
        
        String nomeCulturaUnico = gerarNomeCulturaUnico("Cultura Safra");
        Cultura cultura = new Cultura(0, nomeCulturaUnico);
        culturaDAO.inserir(cultura);
        
        String descricaoVariedadeUnica = gerarNomeUnico("Variedade Safra");
        VariedadeCultura variedade = new VariedadeCultura(0, cultura.getId_cultura(), descricaoVariedadeUnica, (short)7, (short)7, 100, (short)9);
        variedadeCulturaDAO.inserir(variedade);
        
        Safra safra = new Safra(0, prop.getId(), talhao.getId_talhao(), variedade.getId_variedade_cultura(), new Date(), new Date(), new BigDecimal("1000.0"));
        safraDAO.inserir(safra);
        Safra encontrada = safraDAO.buscaPorId(safra.getId_safra());
        Assertions.assertNotNull(encontrada);
        Assertions.assertEquals(0, new BigDecimal("1000.0").compareTo(encontrada.getProducao()));
        encontrada.setProducao(new BigDecimal("1100.0"));
        safraDAO.atualizar(encontrada);
        Safra atualizada = safraDAO.buscaPorId(safra.getId_safra());
        Assertions.assertEquals(0, new BigDecimal("1100.0").compareTo(atualizada.getProducao()));
        safraDAO.deletar(safra.getId_safra());
        Assertions.assertNull(safraDAO.buscaPorId(safra.getId_safra()));
        variedadeCulturaDAO.deletar(variedade.getId_variedade_cultura());
        culturaDAO.deletar(cultura.getId_cultura());
        talhaoDAO.deletar(prop.getId(), talhao.getId_talhao());
        propriedadeDAO.deletar(prop.getId());
    }

    @Test
    void testCRUDCondicaoClimatica() throws Exception {
        // Criar dependências: propriedade, talhao, cultura, variedade, safra
        String nomePropUnico = gerarNomeUnico("Propriedade Clima");
        BigDecimal lat = gerarCoordenadaUnica(-25.0, -20.0);
        BigDecimal lon = gerarCoordenadaUnica(-55.0, -50.0);
        
        Propriedade prop = new Propriedade(0, nomePropUnico, lat, lon, new BigDecimal("70.0"));
        propriedadeDAO.inserir(prop);
        Talhao talhao = new Talhao(prop.getId(), 0, new BigDecimal("40.0"));
        talhaoDAO.inserir(talhao);
        
        String nomeCulturaUnico = gerarNomeCulturaUnico("Cultura Clima");
        Cultura cultura = new Cultura(0, nomeCulturaUnico);
        culturaDAO.inserir(cultura);
        
        String descricaoVariedadeUnica = gerarNomeUnico("Variedade Clima");
        VariedadeCultura variedade = new VariedadeCultura(0, cultura.getId_cultura(), descricaoVariedadeUnica, (short)8, (short)8, 110, (short)10);
        variedadeCulturaDAO.inserir(variedade);
        
        Safra safra = new Safra(0, prop.getId(), talhao.getId_talhao(), variedade.getId_variedade_cultura(), new Date(), new Date(), new BigDecimal("2000.0"));
        safraDAO.inserir(safra);
        
        String observacaoUnica = gerarNomeUnico("Observação Teste");
        CondicaoClimatica cond = new CondicaoClimatica(0, safra.getId_safra(), new BigDecimal("500.0"), (short)9, new BigDecimal("12.0"), new BigDecimal("25.0"), observacaoUnica);
        condicaoClimaticaDAO.inserir(cond);
        CondicaoClimatica encontrada = condicaoClimaticaDAO.buscaPorId(cond.getId_condicao_climatica());
        Assertions.assertNotNull(encontrada);
        Assertions.assertEquals(observacaoUnica, encontrada.getObservacoes());
        encontrada.setObservacoes(gerarNomeUnico("Observação Atualizada"));
        condicaoClimaticaDAO.atualizar(encontrada);
        CondicaoClimatica atualizada = condicaoClimaticaDAO.buscaPorId(cond.getId_condicao_climatica());
        Assertions.assertEquals(encontrada.getObservacoes(), atualizada.getObservacoes());
        condicaoClimaticaDAO.deletar(cond.getId_condicao_climatica());
        Assertions.assertNull(condicaoClimaticaDAO.buscaPorId(cond.getId_condicao_climatica()));
        safraDAO.deletar(safra.getId_safra());
        variedadeCulturaDAO.deletar(variedade.getId_variedade_cultura());
        culturaDAO.deletar(cultura.getId_cultura());
        talhaoDAO.deletar(prop.getId(), talhao.getId_talhao());
        propriedadeDAO.deletar(prop.getId());
    }
} 