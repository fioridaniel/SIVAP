package br.uel.trabalho.sivap.dao;

import br.uel.trabalho.sivap.model.Propriedade;
import br.uel.trabalho.sivap.model.ProdutorRural;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PgPropriedadeDAO implements PropriedadeDAO {

    @Autowired
    private DataSource dataSource;

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
        try (Connection conn = dataSource.getConnection();
             // A opção Statement.RETURN_GENERATED_KEYS é usada para recuperar o ID gerado pelo banco.
             PreparedStatement pst = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            pst.setString(1, propriedade.getNome());
            pst.setBigDecimal(2, propriedade.getLatitude());
            pst.setBigDecimal(3, propriedade.getLongitude());
            pst.setBigDecimal(4, propriedade.getArea());

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

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setInt(1, id);

            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                    String nome = rs.getString("nome");
                    BigDecimal latitude = rs.getBigDecimal("latitude");
                    BigDecimal longitude = rs.getBigDecimal("longitude");
                    BigDecimal area = rs.getBigDecimal("area");

                    // Cria um novo objeto Propriedade com os dados do banco
                    propriedade = new Propriedade(id, nome, latitude, longitude, area);
                    
                    // Carrega os produtores associados
                    List<ProdutorRural> produtores = buscarProdutoresDaPropriedade(id);
                    propriedade.setProdutores(produtores);
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

        try (Connection conn = dataSource.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            while (rs.next()) {
                int id = rs.getInt("id");
                String nome = rs.getString("nome");
                BigDecimal latitude = rs.getBigDecimal("latitude");
                BigDecimal longitude = rs.getBigDecimal("longitude");
                BigDecimal area = rs.getBigDecimal("area");

                // Cria um novo objeto Propriedade para cada registro
                Propriedade propriedade = new Propriedade(id, nome, latitude, longitude, area);
                
                // Carrega os produtores associados
                List<ProdutorRural> produtores = buscarProdutoresDaPropriedade(id);
                propriedade.setProdutores(produtores);
                
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

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setString(1, propriedade.getNome());
            pst.setBigDecimal(2, propriedade.getLatitude());
            pst.setBigDecimal(3, propriedade.getLongitude());
            pst.setBigDecimal(4, propriedade.getArea());
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

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setInt(1, id);
            pst.executeUpdate();
        }
    }

    @Override
    public void associarProdutor(int idPropriedade, String cpfProdutor) throws SQLException, IOException, ClassNotFoundException {
        String sql = "INSERT INTO produtor_propriedade (id_propriedade, cpf_produtor_rural) VALUES (?, ?);";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setInt(1, idPropriedade);
            pst.setString(2, cpfProdutor);

            pst.executeUpdate();
        }
    }

    @Override
    public void desassociarProdutor(int idPropriedade, String cpfProdutor) throws SQLException, IOException, ClassNotFoundException {
        String sql = "DELETE FROM produtor_propriedade WHERE id_propriedade = ? AND cpf_produtor_rural = ?;";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setInt(1, idPropriedade);
            pst.setString(2, cpfProdutor);

            pst.executeUpdate();
        }
    }

    @Override
    public List<ProdutorRural> buscarProdutoresDaPropriedade(int idPropriedade) throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT pr.cpf, pr.nome, pr.sexo, pr.dt_nasc " +
                    "FROM produtor_rural pr " +
                    "INNER JOIN produtor_propriedade pp ON pr.cpf = pp.cpf_produtor_rural " +
                    "WHERE pp.id_propriedade = ?;";
        
        List<ProdutorRural> produtores = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setInt(1, idPropriedade);

            try (ResultSet rs = pst.executeQuery()) {
                while (rs.next()) {
                    String cpf = rs.getString("cpf");
                    String nome = rs.getString("nome");
                    char sexo = rs.getString("sexo").charAt(0);
                    java.util.Date dtNasc = rs.getDate("dt_nasc");

                    ProdutorRural produtor = new ProdutorRural(cpf, nome, sexo, dtNasc);
                    produtores.add(produtor);
                }
            }
        }
        return produtores;
    }

    @Override
    public List<Propriedade> buscarPropriedadesDoProdutor(String cpfProdutor) throws SQLException, IOException, ClassNotFoundException {
        String sql = "SELECT p.id, p.nome, p.latitude, p.longitude, p.area " +
                    "FROM propriedade p " +
                    "INNER JOIN produtor_propriedade pp ON p.id = pp.id_propriedade " +
                    "WHERE pp.cpf_produtor_rural = ? " +
                    "ORDER BY p.nome;";
        
        List<Propriedade> propriedades = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setString(1, cpfProdutor);

            try (ResultSet rs = pst.executeQuery()) {
                while (rs.next()) {
                    int id = rs.getInt("id");
                    String nome = rs.getString("nome");
                    BigDecimal latitude = rs.getBigDecimal("latitude");
                    BigDecimal longitude = rs.getBigDecimal("longitude");
                    BigDecimal area = rs.getBigDecimal("area");

                    Propriedade propriedade = new Propriedade(id, nome, latitude, longitude, area);
                    
                    // Carrega os produtores associados
                    List<ProdutorRural> produtores = buscarProdutoresDaPropriedade(id);
                    propriedade.setProdutores(produtores);
                    
                    propriedades.add(propriedade);
                }
            }
        }
        return propriedades;
    }
}