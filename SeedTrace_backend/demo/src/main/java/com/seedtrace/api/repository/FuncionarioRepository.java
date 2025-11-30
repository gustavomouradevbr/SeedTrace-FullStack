package com.seedtrace.api.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.seedtrace.api.model.Funcionario;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    Optional<Funcionario> findByCpf(String cpf);
}
