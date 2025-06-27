package br.uel.trabalho.sivap.controller;

import br.uel.trabalho.sivap.dao.PgCulturaDAO;
import br.uel.trabalho.sivap.model.Cultura;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/culturas")
public class CulturaController {

    @Autowired
    private PgCulturaDAO culturaDAO;

    @GetMapping
    public List<Cultura> listarTodos() throws SQLException, IOException, ClassNotFoundException {
        return culturaDAO.listarTodos();
    }

    @GetMapping("/{id}")
    public Cultura buscarPorId(@PathVariable int id) throws SQLException, IOException, ClassNotFoundException {
        return culturaDAO.buscaPorId(id);
    }

    @PostMapping
    public void criar(@RequestBody Cultura cultura) throws SQLException, IOException, ClassNotFoundException {
        culturaDAO.inserir(cultura);
    }

    @PutMapping("/{id}")
    public void atualizar(@PathVariable int id, @RequestBody Cultura cultura) throws SQLException, IOException, ClassNotFoundException {
        cultura.setId(id);
        culturaDAO.atualizar(cultura);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) throws SQLException, IOException, ClassNotFoundException {
        culturaDAO.deletar(id);
    }
} 