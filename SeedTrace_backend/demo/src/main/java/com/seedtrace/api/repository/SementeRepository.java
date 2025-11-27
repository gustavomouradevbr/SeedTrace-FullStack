package com.seedtrace.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.seedtrace.api.model.Semente;

public interface SementeRepository extends JpaRepository<Semente, Long> {}
