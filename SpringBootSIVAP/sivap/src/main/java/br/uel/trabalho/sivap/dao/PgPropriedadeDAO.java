package br.uel.trabalho.sivap.dao;

import br.uel.trabalho.sivap.jdbc.ConnectionFactory;
import br.uel.trabalho.sivap.model.Propriedade;

import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PgPropriedadeDAO implements PropriedadeDAO {

    /**
     * Insere uma nova propriedade no banco de dados e atualiza o objeto
     * com o ID gerado pelo banco.
     * @param propriedade instância da classe Propriedade a ser inserida
     * @return objeto Propriedade inserido com o ID atualizado.
     */
    @Override
    public Propriedade inserir(Propriedade propriedade) throws SQLException, IOException, ClassNotFoundException {
        String sql = "INSERT INTO propriedade (nome, latitude, longitude, area) VALUES (?, ?, ?, ?);";

        // Usando try-with-resources para garantir que a conexão e o statement sejam fechados.
        try (Connection conn = ConnectionFactory.getInstance().getConnection();
             // A opção Statement.RETURN_GENERATED_KEYS é usada para recuperar o ID gerado pelo banco.
             PreparedStatement pst = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            pst.setString(1, propriedade.getNome());
            pst.setDouble(2, propriedade.getLatitude());
            pst.setDouble(3, propriedade.getLongitude());
            pst.setDouble(4, propriedade.getArea());

            pst.executeUpdate();

            // Recupera o ID gerado para a propriedade (coluna SERIAL 'id')
            try (ResultSet rs = pst.getGeneratedKeys()) {
                if (rs.next()) {
                    propriedade.setId(rs.getInt(1));
                }
            }
        }
        return propriedade;
    }

    /**
     * Busca uma propriedade pelo seu id.
     * @param id da propriedade buscada
     * @return Objeto da classe Propriedade encontrado, ou null caso não exista.
     */
    @Override
    public Propriedade buscaPorId(int id) throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT id, nome, latitude, longitude, area FROM propriedade WHERE id = ?;";
        Propriedade propriedade = null;

        try (Connection conn = ConnectionFactory.getInstance().getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setInt(1, id);

            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                    String nome = rs.getString("nome");
                    double latitude = rs.getDouble("latitude");
                    double longitude = rs.getDouble("longitude");
                    double area = rs.getDouble("area");

                    // Cria um novo objeto Propriedade com os dados do banco
                    propriedade = new Propriedade(id, nome, latitude, longitude, area);
                }
            }
        }
        return propriedade;
    }

    /**
     * Lista todos as propriedades cadastradas.
     * @return Uma lista de todos os objetos Propriedade.
     */
    @Override
    public List<Propriedade> listarTodos() throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT id, nome, latitude, longitude, area FROM propriedade ORDER BY nome;";
        List<Propriedade> propriedades = new ArrayList<>();

        try (Connection conn = ConnectionFactory.getInstance().getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            while (rs.next()) {
                int id = rs.getInt("id");
                String nome = rs.getString("nome");
                double latitude = rs.getDouble("latitude");
                double longitude = rs.getDouble("longitude");
                double area = rs.getDouble("area");

                // Cria um novo objeto Propriedade para cada registro
                Propriedade propriedade = new Propriedade(id, nome, latitude, longitude, area);
                propriedades.add(propriedade);
            }
        }
        return propriedades;
    }

    /**
     * Atualiza os dados de uma propriedade existente no banco.
     * @param propriedade uma instância da classe Propriedade com os dados atualizados.
     */
    @Override
    public void atualizar(Propriedade propriedade) throws SQLException, IOException, ClassNotFoundException {
        String sql = "UPDATE propriedade SET nome = ?, latitude = ?, longitude = ?, area = ? WHERE id = ?;";

        try (Connection conn = ConnectionFactory.getInstance().getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setString(1, propriedade.getNome());
            pst.setDouble(2, propriedade.getLatitude());
            pst.setDouble(3, propriedade.getLongitude());
            pst.setDouble(4, propriedade.getArea());
            pst.setInt(5, propriedade.getId());

            pst.executeUpdate();
        }
    }

    /**
     * Remove uma propriedade do banco de dados pelo seu id.
     * @param id da propriedade a ser removida.
     */
    @Override
    public void deletar(int id) throws SQLException, IOException, ClassNotFoundException {
        String sql = "DELETE FROM propriedade WHERE id = ?;";

        try (Connection conn = ConnectionFactory.getInstance().getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setInt(1, id);
            pst.executeUpdate();
        }
    }
}