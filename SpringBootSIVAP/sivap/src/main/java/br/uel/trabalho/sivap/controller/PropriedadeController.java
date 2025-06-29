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

    @GetMapping("/produtor/{cpf}")
    public List<Propriedade> listarPorProdutor(@PathVariable String cpf) throws SQLException, IOException, ClassNotFoundException {
        return propriedadeDAO.buscarPropriedadesDoProdutor(cpf);
    }

    @GetMapping("/{id}")
    public Propriedade buscarPorId(@PathVariable int id) throws SQLException, IOException, ClassNotFoundException {
        return propriedadeDAO.buscaPorId(id);
    }

    @PostMapping
    public void criar(@RequestBody Propriedade propriedade, @RequestParam(required = false) String cpfProdutor) throws SQLException, IOException, ClassNotFoundException {
        try {
            // Insere a propriedade
            Propriedade propriedadeInserida = propriedadeDAO.inserir(propriedade);
            
            // Se foi fornecido um CPF de produtor, associa automaticamente
            if (cpfProdutor != null && !cpfProdutor.trim().isEmpty()) {
                propriedadeDAO.associarProdutor(propriedadeInserida.getId(), cpfProdutor);
            }
        }
        catch(Exception e) {
            e.printStackTrace();
        }
    }

    @PostMapping("/{id}/associar-produtor")
    public void associarProdutor(@PathVariable int id, @RequestParam String cpfProdutor) throws SQLException, IOException, ClassNotFoundException {
        propriedadeDAO.associarProdutor(id, cpfProdutor);
    }

    @DeleteMapping("/{id}/desassociar-produtor")
    public void desassociarProdutor(@PathVariable int id, @RequestParam String cpfProdutor) throws SQLException, IOException, ClassNotFoundException {
        propriedadeDAO.desassociarProdutor(id, cpfProdutor);
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