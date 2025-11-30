package com.seedtrace.api.controller;

import com.seedtrace.api.dto.LoginRequest;
import com.seedtrace.api.model.Funcionario;
import com.seedtrace.api.repository.FuncionarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final FuncionarioRepository funcionarioRepository;

    public AuthController(FuncionarioRepository funcionarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
    }

    @PostMapping("/login-ipa")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return funcionarioRepository.findByCpf(request.getCpf())
                .filter(func -> func.getSenha().equals(request.getSenha()))
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}
