package br.uel.trabalho.sivap.controller;

import br.uel.trabalho.sivap.dao.PgVariedadeCulturaDAO;
import br.uel.trabalho.sivap.model.VariedadeCultura;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/variedades-cultura")
public class VariedadeCulturaController {

    @Autowired
    private PgVariedadeCulturaDAO variedadeCulturaDAO;

    @GetMapping
    public List<VariedadeCultura> listarTodos() throws SQLException, IOException, ClassNotFoundException {
        return variedadeCulturaDAO.listarTodos();
    }

    @GetMapping("/{id}")
    public VariedadeCultura buscarPorId(@PathVariable int id) throws SQLException, IOException, ClassNotFoundException {
        return variedadeCulturaDAO.buscaPorId(id);
    }

    @PostMapping
    public void criar(@RequestBody VariedadeCultura variedade) throws SQLException, IOException, ClassNotFoundException {
        variedadeCulturaDAO.inserir(variedade);
    }

    @PutMapping("/{id}")
    public void atualizar(@PathVariable int id, @RequestBody VariedadeCultura variedade) throws SQLException, IOException, ClassNotFoundException {
        variedade.setId_variedade_cultura(id);
        variedadeCulturaDAO.atualizar(variedade);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) throws SQLException, IOException, ClassNotFoundException {
        variedadeCulturaDAO.deletar(id);
    }
} 