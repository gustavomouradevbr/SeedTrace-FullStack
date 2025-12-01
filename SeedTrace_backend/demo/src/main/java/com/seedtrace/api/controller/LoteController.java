package com.seedtrace.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.seedtrace.api.model.Lote;
import com.seedtrace.api.repository.LoteRepository;

@RestController
@RequestMapping("/api/lotes")
@CrossOrigin(origins = "*")
public class LoteController {
    private final LoteRepository repo;
    public LoteController(LoteRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Lote> listar() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Lote> buscarPorId(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Lote criar(@RequestBody Lote lote) { return repo.save(lote); }

    @PutMapping("/{id}")
    public ResponseEntity<Lote> atualizar(@PathVariable Long id, @RequestBody Lote dados) {
        return repo.findById(id)
                .map(existente -> {
                    existente.setSementeNome(dados.getSementeNome());
                    existente.setQuantidadeKg(dados.getQuantidadeKg());
                    existente.setDataRegistro(dados.getDataRegistro());
                    existente.setOrigem(dados.getOrigem());
                    existente.setAgricultor(dados.getAgricultor());
                    existente.setStatus(dados.getStatus());
                    existente.setObservacoes(dados.getObservacoes());
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
