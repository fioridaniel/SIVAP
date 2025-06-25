package br.uel.trabalho.sivap.dao;

import br.uel.trabalho.sivap.model.Propriedade;
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
}