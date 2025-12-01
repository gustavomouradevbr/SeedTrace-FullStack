package com.seedtrace.api.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.seedtrace.api.model.Entrega;
import com.seedtrace.api.repository.EntregaRepository;

@RestController
@RequestMapping("/api/entregas")
@CrossOrigin(origins = "*")
public class EntregaController {
    private final EntregaRepository repo;
    public EntregaController(EntregaRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Entrega> listar() { return repo.findAll(); }

    @PostMapping
    public ResponseEntity<Entrega> criar(@RequestBody Entrega entrega) {
        Entrega criada = repo.save(entrega);
        return ResponseEntity
                .created(URI.create("/api/entregas/" + criada.getId()))
                .body(criada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Entrega> atualizar(@PathVariable Long id, @RequestBody Entrega dados) {
        return repo.findById(id)
                .map(existente -> {
                    existente.setMunicipio(dados.getMunicipio());
                    existente.setAgricultor(dados.getAgricultor());
                    existente.setLoteSemente(dados.getLoteSemente());
                    existente.setQuantidadeKg(dados.getQuantidadeKg());
                    existente.setDataPrevisao(dados.getDataPrevisao());
                    existente.setTecnicoResponsavel(dados.getTecnicoResponsavel());
                    existente.setStatus(dados.getStatus());
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
