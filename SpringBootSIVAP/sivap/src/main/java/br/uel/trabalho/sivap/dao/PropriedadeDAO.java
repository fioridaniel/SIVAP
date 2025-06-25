package br.uel.trabalho.sivap.dao;

import br.uel.trabalho.sivap.model.Propriedade;
import br.uel.trabalho.sivap.model.ProdutorRural;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public interface PropriedadeDAO {
    /**
     * Insere uma nova propriedade no banco de dados
     * @param instância da classe Propriedade a ser inserida
     * @return objeto Propriedade inserido (útil quando houverem chaves geradas)
     */
    Propriedade inserir(Propriedade propriedade) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Busca uma propriedade pelo seu id
     * @param id da propriedade buscada
     * @return Objeto da classe Propriedade encontrado, ou null caso não exista
     */
    Propriedade buscaPorId(int id) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Lista todos as propriedades cadastradas.
     * @return Uma lista de todos os objetos Propriedade.
     */
    List<Propriedade> listarTodos() throws SQLException, IOException, ClassNotFoundException;

    /**
     * Atualiza os dados de uma propriedade existente no banco.
     * @param propriedade uma instância da classe Propriedade com os dados atualizados.
     */
    void atualizar(Propriedade propriedade) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Remove uma propriedade do banco de dados pelo seu id.
     * @param id da propriedade a ser removida.
     */
    void deletar(int id) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Associa um produtor rural a uma propriedade.
     * @param idPropriedade O ID da propriedade.
     * @param cpfProdutor O CPF do produtor.
     */
    void associarProdutor(int idPropriedade, String cpfProdutor) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Remove a associação entre uma propriedade e um produtor rural.
     * @param idPropriedade O ID da propriedade.
     * @param cpfProdutor O CPF do produtor.
     */
    void desassociarProdutor(int idPropriedade, String cpfProdutor) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Busca todos os produtores rurais associados a uma propriedade.
     * @param idPropriedade O ID da propriedade.
     * @return Lista de produtores associados à propriedade.
     */
    List<ProdutorRural> buscarProdutoresDaPropriedade(int idPropriedade) throws SQLException, IOException, ClassNotFoundException;
}