package br.uel.trabalho.sivap.dao;

import br.uel.trabalho.sivap.model.Talhao;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public interface TalhaoDAO {
    /**
     * Insere um novo talhão no banco de dados.
     * @param talhao instância da classe Talhao a ser inserida
     * @return objeto Talhao inserido (útil quando houverem chaves geradas)
     */
    Talhao inserir(Talhao talhao) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Busca um talhão pelo id da propriedade e id do talhão.
     * @param idPropriedade id da propriedade
     * @param idTalhao id do talhão
     * @return Objeto da classe Talhao encontrado, ou null caso não exista
     */
    Talhao buscaPorId(int idPropriedade, int idTalhao) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Lista todos os talhões cadastrados.
     * @return Uma lista de todos os objetos Talhao.
     */
    List<Talhao> listarTodos() throws SQLException, IOException, ClassNotFoundException;

    /**
     * Lista todos os talhões de uma propriedade específica.
     * @param idPropriedade id da propriedade
     * @return Uma lista de todos os objetos Talhao da propriedade.
     */
    List<Talhao> listarPorPropriedade(int idPropriedade) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Atualiza os dados de um talhão existente no banco.
     * @param talhao uma instância da classe Talhao com os dados atualizados.
     */
    void atualizar(Talhao talhao) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Remove um talhão do banco de dados pelo id da propriedade e id do talhão.
     * @param idPropriedade id da propriedade
     * @param idTalhao id do talhão
     */
    void deletar(int idPropriedade, int idTalhao) throws SQLException, IOException, ClassNotFoundException;
} 