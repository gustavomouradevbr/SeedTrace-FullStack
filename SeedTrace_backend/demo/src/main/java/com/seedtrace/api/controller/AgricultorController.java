package com.seedtrace.api.controller;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.seedtrace.api.model.Agricultor;
import com.seedtrace.api.repository.AgricultorRepository;

@RestController
@RequestMapping("/api/agricultores")
@CrossOrigin(origins = "*")
public class AgricultorController {

    private final AgricultorRepository repo;

    public AgricultorController(AgricultorRepository repo) {
        this.repo = repo;
    }

    // 1) Listar todos (GET)
    @GetMapping
    public List<Agricultor> listar() {
        return repo.findAll();
    }

    // 2) Buscar por ID (GET /{id})
    @GetMapping("/{id}")
    public ResponseEntity<Agricultor> buscarPorId(@PathVariable Long id) {
        Optional<Agricultor> opt = repo.findById(id);
        return opt.map(ResponseEntity::ok)
                  .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // 2.1) Buscar por CPF + Data de Nascimento (GET /busca?cpf=...&dataNascimento=YYYY-MM-DD)
    @GetMapping("/busca")
    public ResponseEntity<Agricultor> buscarPorCpfEData(
            @RequestParam String cpf,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataNascimento) {
        return repo.findByCpfAndDataNascimento(cpf, dataNascimento)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // 3) Criar (POST) - retorna 201 Created com Location
    @PostMapping
    public ResponseEntity<Agricultor> criar(@RequestBody Agricultor novo) {
        Agricultor criado = repo.save(novo);
        return ResponseEntity
                .created(URI.create("/api/agricultores/" + criado.getId()))
                .body(criado);
    }

    // 4) Atualizar (PUT /{id}) - 404 se não existir
    @PutMapping("/{id}")
    public ResponseEntity<Agricultor> atualizar(@PathVariable Long id, @RequestBody Agricultor atualizacao) {
        Optional<Agricultor> existente = repo.findById(id);
        if (existente.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        Agricultor a = existente.get();
        // Atualiza campos
        a.setNome(atualizacao.getNome());
        a.setMunicipio(atualizacao.getMunicipio());
        a.setUltimoRecebimento(atualizacao.getUltimoRecebimento());
        a.setCpf(atualizacao.getCpf());
        a.setDataNascimento(atualizacao.getDataNascimento());

        Agricultor salvo = repo.save(a);
        return ResponseEntity.ok(salvo);
    }

    // 5) Deletar (DELETE /{id}) - 204 No Content ou 404
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
