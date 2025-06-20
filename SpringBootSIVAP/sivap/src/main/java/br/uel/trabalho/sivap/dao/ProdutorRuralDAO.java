package dao;

import model.ProdutorRural;
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
}