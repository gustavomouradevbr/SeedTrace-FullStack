package com.seedtrace.api.controller;

import com.seedtrace.api.dto.DistribuicaoMunicipioDTO;
import com.seedtrace.api.dto.EntregasAgricultorDTO;
import com.seedtrace.api.dto.EstoqueSementeDTO;
import com.seedtrace.api.repository.EntregaRepository;
import com.seedtrace.api.repository.SementeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioController {

    private final EntregaRepository entregaRepository;
    private final SementeRepository sementeRepository;

    public RelatorioController(EntregaRepository entregaRepository,
                               SementeRepository sementeRepository) {
        this.entregaRepository = entregaRepository;
        this.sementeRepository = sementeRepository;
    }

    // 1) Distribuição por município
    @GetMapping("/municipios")
    public List<DistribuicaoMunicipioDTO> relatorioMunicipios() {
        return entregaRepository.relatorioDistribuicaoPorMunicipio()
                .stream()
                .map(row -> new DistribuicaoMunicipioDTO(
                        (String) row[0],
                        (Double) row[1]
                ))
                .collect(Collectors.toList());
    }

    // 2) Entregas por agricultor
    @GetMapping("/agricultores")
    public List<EntregasAgricultorDTO> relatorioAgricultores() {
        return entregaRepository.relatorioEntregasPorAgricultor()
                .stream()
                .map(row -> new EntregasAgricultorDTO(
                        (String) row[0],
                        (Double) row[1],
                        (Long) row[2]
                ))
                .collect(Collectors.toList());
    }

    // 3) Estoque por semente
    @GetMapping("/estoque")
    public List<EstoqueSementeDTO> relatorioEstoque() {
        return sementeRepository.relatorioEstoquePorSemente()
                .stream()
                .map(row -> new EstoqueSementeDTO(
                        (String) row[0],
                        (Double) row[1],
                        (Integer) row[2]
                ))
                .collect(Collectors.toList());
    }
}
