package com.seedtrace.api.repository;

import com.seedtrace.api.model.Entrega;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EntregaRepository extends JpaRepository<Entrega, Long> {
	
	 // 1) Distribuição por município
    @Query("SELECT e.municipio AS municipio, SUM(e.quantidadeKg) AS totalKg " +
           "FROM Entrega e GROUP BY e.municipio")
    List<Object[]> relatorioDistribuicaoPorMunicipio();

    // 2) Entregas por agricultor
    @Query("SELECT e.agricultor AS agricultor, SUM(e.quantidadeKg) AS totalKg, COUNT(e) AS totalEntregas " +
           "FROM Entrega e GROUP BY e.agricultor")
    List<Object[]> relatorioEntregasPorAgricultor();
	
}
