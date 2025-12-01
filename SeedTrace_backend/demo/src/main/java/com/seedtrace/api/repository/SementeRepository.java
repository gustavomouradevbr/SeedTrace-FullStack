package com.seedtrace.api.repository;

import com.seedtrace.api.model.Semente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SementeRepository extends JpaRepository<Semente, Long> {

    // 3) Estoque por semente
    @Query("SELECT s.nome AS nome, s.quantidadeKg AS quantidadeKg, s.numeroLotes AS lotes " +
           "FROM Semente s")
    List<Object[]> relatorioEstoquePorSemente();
}
