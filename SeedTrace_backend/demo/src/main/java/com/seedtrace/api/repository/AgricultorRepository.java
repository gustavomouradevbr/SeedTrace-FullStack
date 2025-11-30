package com.seedtrace.api.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.seedtrace.api.model.Agricultor;

public interface AgricultorRepository extends JpaRepository<Agricultor, Long> {
	Optional<Agricultor> findByCpf(String cpf);
	Optional<Agricultor> findByCpfAndDataNascimento(String cpf, LocalDate dataNascimento);
}
