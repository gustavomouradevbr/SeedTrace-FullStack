package com.seedtrace.api.controller;

import com.seedtrace.api.model.Funcionario;
import com.seedtrace.api.repository.FuncionarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
@CrossOrigin(origins = "*")
public class FuncionarioController {

    private final FuncionarioRepository repo;

    public FuncionarioController(FuncionarioRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Funcionario> listar() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> buscarPorId(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<Funcionario> criar(@RequestBody Funcionario funcionario) {
        Funcionario salvo = repo.save(funcionario);
        return ResponseEntity.created(URI.create("/api/funcionarios/" + salvo.getId())).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Funcionario> atualizar(@PathVariable Long id, @RequestBody Funcionario dados) {
        return repo.findById(id)
                .map(existente -> {
                    existente.setNome(dados.getNome());
                    existente.setCpf(dados.getCpf());
                    existente.setSenha(dados.getSenha());
                    return ResponseEntity.ok(repo.save(existente));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
