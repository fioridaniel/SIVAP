package br.uel.trabalho.sivap.controller;

import br.uel.trabalho.sivap.dao.PgTalhaoDAO;
import br.uel.trabalho.sivap.model.Talhao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/talhoes")
public class TalhaoController {

    @Autowired
    private PgTalhaoDAO talhaoDAO;

    @GetMapping
    public List<Talhao> listarTodos() throws SQLException, IOException, ClassNotFoundException {
        return talhaoDAO.listarTodos();
    }

    @GetMapping("/{idPropriedade}/{idTalhao}")
    public Talhao buscarPorId(@PathVariable int idPropriedade, @PathVariable int idTalhao) throws SQLException, IOException, ClassNotFoundException {
        return talhaoDAO.buscaPorId(idPropriedade, idTalhao);
    }

    @PostMapping
    public void criar(@RequestBody Talhao talhao) throws SQLException, IOException, ClassNotFoundException {
        talhaoDAO.inserir(talhao);
    }

    @PutMapping("/{idPropriedade}/{idTalhao}")
    public void atualizar(@PathVariable int idPropriedade, @PathVariable int idTalhao, @RequestBody Talhao talhao) throws SQLException, IOException, ClassNotFoundException {
        talhao.setId_propriedade(idPropriedade);
        talhao.setId_talhao(idTalhao);
        talhaoDAO.atualizar(talhao);
    }

    @DeleteMapping("/{idPropriedade}/{idTalhao}")
    public void deletar(@PathVariable int idPropriedade, @PathVariable int idTalhao) throws SQLException, IOException, ClassNotFoundException {
        talhaoDAO.deletar(idPropriedade, idTalhao);
    }
} 