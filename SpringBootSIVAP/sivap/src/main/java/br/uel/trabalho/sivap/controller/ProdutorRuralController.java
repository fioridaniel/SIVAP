package br.uel.trabalho.sivap.controller;

import br.uel.trabalho.sivap.dao.PgProdutorRuralDAO;
import br.uel.trabalho.sivap.model.ProdutorRural;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/produtores")
public class ProdutorRuralController {

    @Autowired
    private PgProdutorRuralDAO produtorRuralDAO;

    @GetMapping
    public List<ProdutorRural> listarTodos() throws SQLException, IOException, ClassNotFoundException {
        return produtorRuralDAO.listarTodos();
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