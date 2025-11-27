package com.seedtrace.api.controller;

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

    @PostMapping
    public Lote criar(@RequestBody Lote lote) { return repo.save(lote); }
}
