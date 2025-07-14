package br.uel.trabalho.sivap.controller;

import br.uel.trabalho.sivap.dao.PgPropriedadeDAO;
import br.uel.trabalho.sivap.model.Propriedade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<String> criar(@RequestBody Propriedade propriedade, @RequestParam(required = false) String cpfProdutor) {
        try {
            // Validações básicas
            if (propriedade.getNome() == null || propriedade.getNome().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Nome da propriedade é obrigatório");
            }
            if (propriedade.getLatitude() == null) {
                return ResponseEntity.badRequest().body("Latitude é obrigatória");
            }
            if (propriedade.getLongitude() == null) {
                return ResponseEntity.badRequest().body("Longitude é obrigatória");
            }
            if (propriedade.getArea() == null) {
                return ResponseEntity.badRequest().body("Área é obrigatória");
            }
            
            // Insere a propriedade
            Propriedade propriedadeInserida = propriedadeDAO.inserir(propriedade);
            
            // Se foi fornecido um CPF de produtor, associa automaticamente
            if (cpfProdutor != null && !cpfProdutor.trim().isEmpty()) {
                try {
                    propriedadeDAO.associarProdutor(propriedadeInserida.getId(), cpfProdutor);
                    return ResponseEntity.ok("Propriedade criada e associada ao produtor com sucesso");
                } catch (Exception e) {
                    // Se falhar na associação, pelo menos a propriedade foi criada
                    return ResponseEntity.ok("Propriedade criada com sucesso, mas houve erro na associação: " + e.getMessage());
                }
            } else {
                return ResponseEntity.ok("Propriedade criada com sucesso");
            }
        } catch (SQLException e) {
            return ResponseEntity.badRequest().body("Erro ao criar propriedade: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro interno do servidor: " + e.getMessage());
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