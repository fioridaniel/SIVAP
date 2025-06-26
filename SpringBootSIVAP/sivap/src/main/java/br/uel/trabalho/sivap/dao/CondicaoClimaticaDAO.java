package br.uel.trabalho.sivap.dao;

import br.uel.trabalho.sivap.model.CondicaoClimatica;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public interface CondicaoClimaticaDAO {
    /**
     * Insere uma nova condição climática no banco de dados.
     * @param condicao instância da classe CondicaoClimatica a ser inserida
     * @return objeto CondicaoClimatica inserido (útil quando houverem chaves geradas)
     */
    CondicaoClimatica inserir(CondicaoClimatica condicao) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Busca uma condição climática pelo seu id.
     * @param id da condição climática buscada
     * @return Objeto da classe CondicaoClimatica encontrado, ou null caso não exista
     */
    CondicaoClimatica buscaPorId(int id) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Lista todas as condições climáticas cadastradas.
     * @return Uma lista de todos os objetos CondicaoClimatica.
     */
    List<CondicaoClimatica> listarTodos() throws SQLException, IOException, ClassNotFoundException;

    /**
     * Atualiza os dados de uma condição climática existente no banco.
     * @param condicao uma instância da classe CondicaoClimatica com os dados atualizados.
     */
    void atualizar(CondicaoClimatica condicao) throws SQLException, IOException, ClassNotFoundException;

    /**
     * Remove uma condição climática do banco de dados pelo seu id.
     * @param id da condição climática a ser removida.
     */
    void deletar(int id) throws SQLException, IOException, ClassNotFoundException;
} 