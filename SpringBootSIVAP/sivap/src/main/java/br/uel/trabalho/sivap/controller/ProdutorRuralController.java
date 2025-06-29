package br.uel.trabalho.sivap.controller;

import br.uel.trabalho.sivap.dao.PgProdutorRuralDAO;
import br.uel.trabalho.sivap.model.ProdutorRural;
import br.uel.trabalho.sivap.model.Propriedade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

//@CrossOrigin(origins = "http://localhost:3000") /* importante */
@RestController /* faz com que os dados sejam retornados em json */
@RequestMapping("/produtores")
public class ProdutorRuralController {

    @Autowired
    private PgProdutorRuralDAO produtorRuralDAO;

    @GetMapping
    public List<ProdutorRural> listarTodos() throws SQLException, IOException, ClassNotFoundException {
        return produtorRuralDAO.listarTodos();
    }

    /* esse metodo aqui vai ser utilizado na pagina inicial de determinado produtor */
    @GetMapping("/produtor-propriedades/{cpf}")
    public List<Propriedade> buscarPropriedadesDoProdutor(@PathVariable String cpf) throws SQLException, IOException, ClassNotFoundException {
       return produtorRuralDAO.buscarPropriedadesDoProdutor(cpf);
    }

    @GetMapping("/{cpf}")
    public ProdutorRural buscarPorCpf(@PathVariable String cpf) throws SQLException, IOException, ClassNotFoundException {
        return produtorRuralDAO.buscarPorCpf(cpf);
    }

    @PostMapping
    public void criar(@RequestBody ProdutorRural produtor) throws SQLException, IOException, ClassNotFoundException {
        produtorRuralDAO.inserir(produtor);
    }

    @PutMapping("/{cpf}")
    public void atualizar(@PathVariable String cpf, @RequestBody ProdutorRural produtor) throws SQLException, IOException, ClassNotFoundException {
        produtor.setCpf(cpf);
        produtorRuralDAO.atualizar(produtor);
    }

    @DeleteMapping("/{cpf}")
    public void deletar(@PathVariable String cpf) throws SQLException, IOException, ClassNotFoundException {
        produtorRuralDAO.deletar(cpf);
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello, World";
    }
} 