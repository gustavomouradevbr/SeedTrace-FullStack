package com.seedtrace.api.config;

import org.springframework.stereotype.Component;
import org.springframework.boot.CommandLineRunner;
import java.time.LocalDate;

import com.seedtrace.api.model.Semente;
import com.seedtrace.api.model.Entrega;
import com.seedtrace.api.model.Agricultor;
import com.seedtrace.api.model.Lote;
import com.seedtrace.api.model.Funcionario;

import com.seedtrace.api.repository.SementeRepository;
import com.seedtrace.api.repository.EntregaRepository;
import com.seedtrace.api.repository.AgricultorRepository;
import com.seedtrace.api.repository.LoteRepository;
import com.seedtrace.api.repository.FuncionarioRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SementeRepository sementeRepo;
    private final EntregaRepository entregaRepo;
    private final AgricultorRepository agricultorRepo;
    private final LoteRepository loteRepo;
    private final FuncionarioRepository funcionarioRepo;

    public DataInitializer(SementeRepository sementeRepo,
                           EntregaRepository entregaRepo,
                           AgricultorRepository agricultorRepo,
                           LoteRepository loteRepo,
                           FuncionarioRepository funcionarioRepo) {
        this.sementeRepo = sementeRepo;
        this.entregaRepo = entregaRepo;
        this.agricultorRepo = agricultorRepo;
        this.loteRepo = loteRepo;
        this.funcionarioRepo = funcionarioRepo;
    }

    @Override
    public void run(String... args) {
        if (sementeRepo.count() == 0) {
            sementeRepo.save(new Semente("Milho Híbrido AG 1051", 1200.0, "Disponível", 12));
            sementeRepo.save(new Semente("Sorgo Forrageiro X2", 800.0, "Indisponível", 3));
            sementeRepo.save(new Semente("Feijão Carioca SF-1", 400.0, "Disponível", 5));
        }

        if (entregaRepo.count() == 0) {
            entregaRepo.save(new Entrega(
                "Garanhuns",
                "João Ribeiro",
                "Milho Híbrido",
                120.0,
                LocalDate.now().plusDays(4),
                "Téc. Helena",
                "Em Transporte"));

            entregaRepo.save(new Entrega(
                "Arcoverde",
                "Maria Souza",
                "Feijão Carioca",
                95.0,
                LocalDate.now().minusDays(1),
                "Téc. Marcos",
                "Entregue"));

            entregaRepo.save(new Entrega(
                "Garanhuns",
                "José Almeida",
                "Sorgo Forrageiro",
                110.0,
                LocalDate.now().plusDays(10),
                "Téc. Roberta",
                "Planejada"));

            entregaRepo.save(new Entrega(
                "Arcoverde",
                "Ana Ferreira",
                "Milho Híbrido",
                85.0,
                LocalDate.now().minusDays(3),
                "Téc. Marcos",
                "Entregue"));

            entregaRepo.save(new Entrega(
                "Petrolina",
                "Carlos Lima",
                "Feijão Carioca",
                150.0,
                LocalDate.now().plusDays(12),
                "Téc. Roberta",
                "Planejada"));
        }

        garantirAgricultor(
            "João Ribeiro",
            "Santa Maria",
            LocalDate.now().minusDays(30),
            "(87) 98888-1111",
            "111.111.111-11",
            LocalDate.of(1985, 3, 14));

        garantirAgricultor(
            "Maria Souza",
            "São Pedro",
            LocalDate.now().minusDays(15),
            "(87) 97777-2222",
            "222.222.222-22",
            LocalDate.of(1990, 11, 2));

        garantirAgricultor(
            "José Almeida",
            "Garanhuns",
            LocalDate.now().minusDays(20),
            "(87) 96666-3333",
            "333.333.333-33",
            LocalDate.of(1982, 6, 5));

        garantirAgricultor(
            "Ana Ferreira",
            "Arcoverde",
            LocalDate.now().minusDays(10),
            "(87) 95555-4444",
            "444.444.444-44",
            LocalDate.of(1993, 1, 22));

        garantirAgricultor(
            "Carlos Lima",
            "Petrolina",
            LocalDate.now().minusDays(5),
            "(87) 94444-5555",
            "555.555.555-55",
            LocalDate.of(1988, 9, 18));

        if (loteRepo.count() == 0) {
            loteRepo.save(new Lote(
                "Milho Híbrido AG 1051",
                200.0,
                LocalDate.now().minusDays(10),
                "Fazenda Santa Clara",
                "João Ribeiro",
                "Em Transporte",
                "Semente de alta pureza"));

            loteRepo.save(new Lote(
                "Sorgo Forrageiro X2",
                150.0,
                LocalDate.now().minusDays(5),
                "Fazenda Verde",
                "Maria Souza",
                "Aguardando Envio",
                "Para forragem"));
        }

        if (funcionarioRepo.count() == 0) {
            funcionarioRepo.save(new Funcionario("000.000.000-01", "123456", "Admin IPA"));
        }
    }

    private void garantirAgricultor(String nome,
                                    String municipio,
                                    LocalDate ultimoRecebimento,
                                    String telefone,
                                    String cpf,
                                    LocalDate dataNascimento) {
        agricultorRepo.findByCpf(cpf).orElseGet(() -> {
            Agricultor agricultor = new Agricultor(nome, municipio, ultimoRecebimento, cpf, dataNascimento);
            agricultor.setTelefone(telefone);
            return agricultorRepo.save(agricultor);
        });
    }
}
