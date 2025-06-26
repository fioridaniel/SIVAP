package br.uel.trabalho.sivap.dao;

import br.uel.trabalho.sivap.model.Safra;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public interface SafraDAO {
    /**
     * Insere uma nova safra no banco de dados.
     * @param safra instância da classe Safra a ser inserida
     * @return objeto Safra inserido (útil quando houverem chaves geradas)
     */
    Safra inserir(Safra safra) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Busca uma safra pelo seu id.
     * @param id da safra buscada
     * @return Objeto da classe Safra encontrado, ou null caso não exista
     */
    Safra buscaPorId(int id) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Lista todas as safras cadastradas.
     * @return Uma lista de todos os objetos Safra.
     */
    List<Safra> listarTodos() throws SQLException, IOException, ClassNotFoundException;

    /**
     * Atualiza os dados de uma safra existente no banco.
     * @param safra uma instância da classe Safra com os dados atualizados.
     */
    void atualizar(Safra safra) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Remove uma safra do banco de dados pelo seu id.
     * @param id da safra a ser removida.
     */
    void deletar(int id) throws SQLException, IOException, ClassNotFoundException;
} 