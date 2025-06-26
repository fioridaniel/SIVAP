package br.uel.trabalho.sivap.dao;

import br.uel.trabalho.sivap.model.VariedadeCultura;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public interface VariedadeCulturaDAO {
    /**
     * Insere uma nova variedade de cultura no banco de dados.
     * @param variedade instância da classe VariedadeCultura a ser inserida
     * @return objeto VariedadeCultura inserido (útil quando houverem chaves geradas)
     */
    VariedadeCultura inserir(VariedadeCultura variedade) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Busca uma variedade de cultura pelo seu id.
     * @param id da variedade de cultura buscada
     * @return Objeto da classe VariedadeCultura encontrado, ou null caso não exista
     */
    VariedadeCultura buscaPorId(int id) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Lista todas as variedades de cultura cadastradas.
     * @return Uma lista de todos os objetos VariedadeCultura.
     */
    List<VariedadeCultura> listarTodos() throws SQLException, IOException, ClassNotFoundException;

    /**
     * Atualiza os dados de uma variedade de cultura existente no banco.
     * @param variedade uma instância da classe VariedadeCultura com os dados atualizados.
     */
    void atualizar(VariedadeCultura variedade) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Remove uma variedade de cultura do banco de dados pelo seu id.
     * @param id da variedade de cultura a ser removida.
     */
    void deletar(int id) throws SQLException, IOException, ClassNotFoundException;
} 