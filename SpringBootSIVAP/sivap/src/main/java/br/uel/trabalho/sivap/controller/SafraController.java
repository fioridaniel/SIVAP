package br.uel.trabalho.sivap.controller;

import br.uel.trabalho.sivap.dao.PgSafraDAO;
import br.uel.trabalho.sivap.model.Safra;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/safras")
public class SafraController {

    @Autowired
    private PgSafraDAO safraDAO;

    @GetMapping
    public List<Safra> listarTodos() throws SQLException, IOException, ClassNotFoundException {
        return safraDAO.listarTodos();
    }

    @GetMapping("/{id}")
    public Safra buscarPorId(@PathVariable int id) throws SQLException, IOException, ClassNotFoundException {
        return safraDAO.buscaPorId(id);
    }

    @PostMapping
    public void criar(@RequestBody Safra safra) throws SQLException, IOException, ClassNotFoundException {
        safraDAO.inserir(safra);
    }

    @PutMapping("/{id}")
    public void atualizar(@PathVariable int id, @RequestBody Safra safra) throws SQLException, IOException, ClassNotFoundException {
        safra.setId_safra(id);
        safraDAO.atualizar(safra);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) throws SQLException, IOException, ClassNotFoundException {
        safraDAO.deletar(id);
    }
} 