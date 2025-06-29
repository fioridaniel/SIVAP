package br.uel.trabalho.sivap.controller;

import br.uel.trabalho.sivap.dao.PgPropriedadeDAO;
import br.uel.trabalho.sivap.model.Propriedade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/propriedades")
public class PropriedadeController {

    @Autowired
    private PgPropriedadeDAO propriedadeDAO;

    @GetMapping
    public List<Propriedade> listarTodos() throws SQLException, IOException, ClassNotFoundException {
        return propriedadeDAO.listarTodos();
    }

    @GetMapping("/{id}")
    public Propriedade buscarPorId(@PathVariable int id) throws SQLException, IOException, ClassNotFoundException {
        return propriedadeDAO.buscaPorId(id);
    }

    @PostMapping
    public void criar(@RequestBody Propriedade propriedade) throws SQLException, IOException, ClassNotFoundException {
        try {
            propriedadeDAO.inserir(propriedade);
        }
        catch(Exception e) {
            e.printStackTrace();
        }
    }

    @PutMapping("/{id}")
    public void atualizar(@PathVariable int id, @RequestBody Propriedade propriedade) throws SQLException, IOException, ClassNotFoundException {
        propriedade.setId(id);
        propriedadeDAO.atualizar(propriedade);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) throws SQLException, IOException, ClassNotFoundException {
        propriedadeDAO.deletar(id);
    }
} 