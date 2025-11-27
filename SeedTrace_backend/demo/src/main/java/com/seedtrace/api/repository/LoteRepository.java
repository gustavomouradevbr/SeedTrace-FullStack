package com.seedtrace.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.seedtrace.api.model.Lote;

public interface LoteRepository extends JpaRepository<Lote, Long> {}
