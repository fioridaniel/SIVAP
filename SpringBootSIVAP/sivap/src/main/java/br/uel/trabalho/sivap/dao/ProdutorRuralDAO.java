package br.uel.trabalho.sivap.dao;

import br.uel.trabalho.sivap.model.ProdutorRural;
import br.uel.trabalho.sivap.model.Propriedade;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public interface ProdutorRuralDAO {

    /**
     * Insere um novo produtor rural no banco de dados.
     * @param produtor O objeto ProdutorRural a ser inserido.
     * @return O objeto ProdutorRural inserido (pode ser útil se houver chaves geradas).
     */
    ProdutorRural inserir(ProdutorRural produtor) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Busca um produtor rural pelo seu CPF.
     * @param cpf O CPF do produtor a ser buscado.
     * @return O objeto ProdutorRural encontrado, ou null se não existir.
     */
    ProdutorRural buscarPorCpf(String cpf) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Lista todos os produtores rurais cadastrados.
     * @return Uma lista de todos os objetos ProdutorRural.
     */
    List<ProdutorRural> listarTodos() throws SQLException, IOException, ClassNotFoundException;

    /**
     * Atualiza os dados de um produtor rural existente no banco.
     * @param produtor O objeto ProdutorRural com os dados atualizados.
     */
    void atualizar(ProdutorRural produtor) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Remove um produtor rural do banco de dados pelo seu CPF.
     * @param cpf O CPF do produtor a ser removido.
     */
    void deletar(String cpf) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Associa uma propriedade a um produtor rural.
     * @param cpfProdutor O CPF do produtor.
     * @param idPropriedade O ID da propriedade.
     */
    void associarPropriedade(String cpfProdutor, int idPropriedade) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Remove a associação entre um produtor rural e uma propriedade.
     * @param cpfProdutor O CPF do produtor.
     * @param idPropriedade O ID da propriedade.
     */
    void desassociarPropriedade(String cpfProdutor, int idPropriedade) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Busca todas as propriedades associadas a um produtor rural.
     * @param cpfProdutor O CPF do produtor.
     * @return Lista de propriedades associadas ao produtor.
     */
    List<Propriedade> buscarPropriedadesDoProdutor(String cpfProdutor) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Altera a senha de um produtor rural.
     * @param cpf O CPF do produtor.
     * @param senhaAtual A senha atual do produtor.
     * @param novaSenha A nova senha do produtor.
     */
    void alterarSenha(String cpf, String senhaAtual, String novaSenha) throws SQLException, IOException, ClassNotFoundException;
}