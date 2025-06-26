package br.uel.trabalho.sivap.dao;

import br.uel.trabalho.sivap.model.Cultura;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public interface CulturaDAO {
    /**
     * Insere uma nova cultura no banco de dados
     * @param cultura instância da classe Cultura a ser inserida
     * @return objeto Cultura inserido (útil quando houverem chaves geradas)
     */
    Cultura inserir(Cultura cultura) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Busca uma cultura pelo seu id
     * @param id da cultura buscada
     * @return Objeto da classe Cultura encontrado, ou null caso não exista
     */
    Cultura buscaPorId(int id) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Lista todas as culturas cadastradas.
     * @return Uma lista de todos os objetos Cultura.
     */
    List<Cultura> listarTodos() throws SQLException, IOException, ClassNotFoundException;

    /**
     * Atualiza os dados de uma cultura existente no banco.
     * @param cultura uma instância da classe Cultura com os dados atualizados.
     */
    void atualizar(Cultura cultura) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Remove uma cultura do banco de dados pelo seu id.
     * @param id da cultura a ser removida.
     */
    void deletar(int id) throws SQLException, IOException, ClassNotFoundException;
} 