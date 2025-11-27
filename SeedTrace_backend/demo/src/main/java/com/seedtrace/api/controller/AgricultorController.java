package com.seedtrace.api.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.seedtrace.api.model.Agricultor;
import com.seedtrace.api.repository.AgricultorRepository;

@RestController
@RequestMapping("/api/agricultores")
@CrossOrigin(origins = "*")
public class AgricultorController {
    private final AgricultorRepository repo;
    public AgricultorController(AgricultorRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Agricultor> listar() { return repo.findAll(); }

    @PostMapping
    public Agricultor criar(@RequestBody Agricultor agricultor) { return repo.save(agricultor); }
}
