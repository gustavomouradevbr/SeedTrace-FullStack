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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
