package com.seedtrace.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.seedtrace.api.model.Semente;
import com.seedtrace.api.repository.SementeRepository;

@RestController
@RequestMapping("/api/sementes")
@CrossOrigin(origins = "*")
public class SementeController {
    private final SementeRepository repo;
    public SementeController(SementeRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Semente> listar() { return repo.findAll(); }

    @PostMapping
    public Semente criar(@RequestBody Semente semente) { return repo.save(semente); }

    @PutMapping("/{id}")
    public ResponseEntity<Semente> atualizar(@PathVariable Long id, @RequestBody Semente dados) {
        return repo.findById(id)
                .map(existente -> {
                    existente.setNome(dados.getNome());
                    existente.setQuantidadeKg(dados.getQuantidadeKg());
                    existente.setStatus(dados.getStatus());
                    existente.setNumeroLotes(dados.getNumeroLotes());
                    return ResponseEntity.ok(repo.save(existente));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
