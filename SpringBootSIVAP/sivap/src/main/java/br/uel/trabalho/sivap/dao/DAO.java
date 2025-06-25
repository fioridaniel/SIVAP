/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package br.uel.trabalho.sivap.dao;

import java.sql.SQLException;
import java.util.List;

/**
 * @param <ENTITY>
 */
public interface DAO<ENTITY> {

    public void create(ENTITY t)
            throws SQLException;
    public ENTITY read(Integer id)
            throws SQLException;
    public void update(ENTITY t)
            throws SQLException;
    public void delete(Integer id)
            throws SQLException;
    public List<ENTITY> all()
            throws SQLException;

}