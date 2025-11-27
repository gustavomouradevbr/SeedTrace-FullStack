package com.seedtrace.api.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
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
    public Entrega criar(@RequestBody Entrega entrega) { return repo.save(entrega); }
}
