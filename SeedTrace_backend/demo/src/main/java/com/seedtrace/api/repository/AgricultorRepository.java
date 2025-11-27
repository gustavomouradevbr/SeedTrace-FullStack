package com.seedtrace.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.seedtrace.api.model.Agricultor;

public interface AgricultorRepository extends JpaRepository<Agricultor, Long> {}
