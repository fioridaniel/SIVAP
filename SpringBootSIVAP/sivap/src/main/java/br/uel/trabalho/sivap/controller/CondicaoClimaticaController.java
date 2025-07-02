package br.uel.trabalho.sivap.controller;

import br.uel.trabalho.sivap.dao.PgCondicaoClimaticaDAO;
import br.uel.trabalho.sivap.model.CondicaoClimatica;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/condicoes-climaticas")
public class CondicaoClimaticaController {

    @Autowired
    private PgCondicaoClimaticaDAO condicaoClimaticaDAO;

    @GetMapping
    public List<CondicaoClimatica> listarTodos() throws SQLException, IOException, ClassNotFoundException {
        return condicaoClimaticaDAO.listarTodos();
    }

    @GetMapping("/{id}")
    public CondicaoClimatica buscarPorId(@PathVariable int id) throws SQLException, IOException, ClassNotFoundException {
        return condicaoClimaticaDAO.buscaPorId(id);
    }

    @GetMapping("/talhao/{idTalhao}")
    public List<CondicaoClimatica> listarPorTalhao(@PathVariable int idTalhao) throws SQLException, IOException, ClassNotFoundException {
        return condicaoClimaticaDAO.listarPorTalhao(idTalhao);
    }

    @GetMapping("/safra/{idSafra}")
    public CondicaoClimatica buscarPorSafra(@PathVariable int idSafra) throws SQLException, IOException, ClassNotFoundException {
        return condicaoClimaticaDAO.buscarPorSafra(idSafra);
    }

    @PostMapping
    public void criar(@RequestBody CondicaoClimatica condicao) throws SQLException, IOException, ClassNotFoundException {
        condicaoClimaticaDAO.inserir(condicao);
    }

    @PutMapping("/{id}")
    public void atualizar(@PathVariable int id, @RequestBody CondicaoClimatica condicao) throws SQLException, IOException, ClassNotFoundException {
        condicao.setId_condicao_climatica(id);
        condicaoClimaticaDAO.atualizar(condicao);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) throws SQLException, IOException, ClassNotFoundException {
        condicaoClimaticaDAO.deletar(id);
    }
} 