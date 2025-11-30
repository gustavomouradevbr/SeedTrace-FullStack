package com.seedtrace.api.config;

import org.springframework.stereotype.Component;
import org.springframework.boot.CommandLineRunner;
import java.time.LocalDate;

import com.seedtrace.api.model.Semente;
import com.seedtrace.api.model.Entrega;
import com.seedtrace.api.model.Agricultor;
import com.seedtrace.api.model.Lote;

import com.seedtrace.api.repository.SementeRepository;
import com.seedtrace.api.repository.EntregaRepository;
import com.seedtrace.api.repository.AgricultorRepository;
import com.seedtrace.api.repository.LoteRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SementeRepository sementeRepo;
    private final EntregaRepository entregaRepo;
    private final AgricultorRepository agricultorRepo;
    private final LoteRepository loteRepo;

    public DataInitializer(SementeRepository sementeRepo,
                           EntregaRepository entregaRepo,
                           AgricultorRepository agricultorRepo,
                           LoteRepository loteRepo) {
        this.sementeRepo = sementeRepo;
        this.entregaRepo = entregaRepo;
        this.agricultorRepo = agricultorRepo;
        this.loteRepo = loteRepo;
    }

    @Override
    public void run(String... args) {
        if (sementeRepo.count() == 0) {
            sementeRepo.save(new Semente("Milho Híbrido AG 1051", 1200.0, "Disponível", 12));
            sementeRepo.save(new Semente("Sorgo Forrageiro X2", 800.0, "Indisponível", 3));
            sementeRepo.save(new Semente("Feijão Carioca SF-1", 400.0, "Disponível", 5));
        }

        if (entregaRepo.count() == 0) {
            entregaRepo.save(new Entrega("Cooperativa Central", LocalDate.now().plusDays(7), "Pendente"));
            entregaRepo.save(new Entrega("Armazém Regional", LocalDate.now().plusDays(2), "Em trânsito"));
        }

        if (agricultorRepo.count() == 0) {
            agricultorRepo.save(new Agricultor("João Ribeiro", "Santa Maria", LocalDate.now().minusDays(30)));
            agricultorRepo.save(new Agricultor("Maria Souza", "São Pedro", LocalDate.now().minusDays(15)));
        }

        if (loteRepo.count() == 0) {
            loteRepo.save(new Lote("Milho Híbrido AG 1051", 200.0, LocalDate.now().minusDays(10), "Fazenda Santa Clara", "João Ribeiro", "Semente de alta pureza"));
            loteRepo.save(new Lote("Sorgo Forrageiro X2", 150.0, LocalDate.now().minusDays(5), "Fazenda Verde", "Maria Souza", "Para forragem"));
        }
    }
}
