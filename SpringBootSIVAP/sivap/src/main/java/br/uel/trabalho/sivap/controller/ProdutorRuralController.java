package br.uel.trabalho.sivap.controller;

import br.uel.trabalho.sivap.dao.PgProdutorRuralDAO;
import br.uel.trabalho.sivap.model.ProdutorRural;
import br.uel.trabalho.sivap.model.Propriedade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<String> criar(@RequestBody ProdutorRural produtor) {
        try {
            // Validações básicas
            if (produtor.getCpf() == null || produtor.getCpf().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("CPF é obrigatório");
            }
            if (produtor.getNome() == null || produtor.getNome().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Nome é obrigatório");
            }
            if (produtor.getSexo() == '\0') {
                return ResponseEntity.badRequest().body("Sexo é obrigatório");
            }
            if (produtor.getDt_nasc() == null) {
                return ResponseEntity.badRequest().body("Data de nascimento é obrigatória");
            }
            
            produtorRuralDAO.inserir(produtor);
            return ResponseEntity.ok("Produtor rural criado com sucesso");
        } catch (SQLException e) {
            return ResponseEntity.badRequest().body("Erro ao criar produtor: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro interno do servidor: " + e.getMessage());
        }
    }

    @PutMapping("/{cpf}")
    public void atualizar(@PathVariable String cpf, @RequestBody ProdutorRural produtor) throws SQLException, IOException, ClassNotFoundException {
        produtor.setCpf(cpf);
        produtorRuralDAO.atualizar(produtor);
    }

    @PutMapping("/{cpf}/alterar-senha")
    public ResponseEntity<String> alterarSenha(@PathVariable String cpf, @RequestBody AlterarSenhaRequest request) {
        try {
            // Validações básicas
            if (cpf == null || cpf.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("CPF é obrigatório");
            }
            if (request.getSenhaAtual() == null || request.getSenhaAtual().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Senha atual é obrigatória");
            }
            if (request.getNovaSenha() == null || request.getNovaSenha().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Nova senha é obrigatória");
            }
            
            // Simula alteração de senha (não há coluna senha no banco)
            produtorRuralDAO.alterarSenha(cpf, request.getSenhaAtual(), request.getNovaSenha());
            return ResponseEntity.ok("Senha alterada com sucesso (simulado)");
        } catch (SQLException e) {
            return ResponseEntity.badRequest().body("Erro ao alterar senha: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro interno do servidor: " + e.getMessage());
        }
    }

    @DeleteMapping("/{cpf}")
    public void deletar(@PathVariable String cpf) throws SQLException, IOException, ClassNotFoundException {
        produtorRuralDAO.deletar(cpf);
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello, World";
    }

    // Classe interna para request de alteração de senha
    public static class AlterarSenhaRequest {
        private String senhaAtual;
        private String novaSenha;

        public String getSenhaAtual() {
            return senhaAtual;
        }

        public void setSenhaAtual(String senhaAtual) {
            this.senhaAtual = senhaAtual;
        }

        public String getNovaSenha() {
            return novaSenha;
        }

        public void setNovaSenha(String novaSenha) {
            this.novaSenha = novaSenha;
        }
    }
} 