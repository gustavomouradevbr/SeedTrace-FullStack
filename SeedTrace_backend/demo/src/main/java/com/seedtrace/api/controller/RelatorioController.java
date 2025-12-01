package com.seedtrace.api.controller;

import com.seedtrace.api.dto.DistribuicaoMunicipioDTO;
import com.seedtrace.api.dto.EntregasAgricultorDTO;
import com.seedtrace.api.dto.EstoqueSementeDTO;
import com.seedtrace.api.repository.EntregaRepository;
import com.seedtrace.api.repository.SementeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", allowedHeaders = "*")  // Add this annotation to enable CORS for all origins
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

        @GetMapping
        public Map<String, String> gerar(
                        @RequestParam String tipo,
                        @RequestParam String inicio,
                        @RequestParam String fim) {
                String mensagem = String.format(
                                "Relatório de %s gerado com sucesso para o período %s a %s.",
                                tipo,
                                inicio,
                                fim
                );
                return Map.of("mensagem", mensagem);
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
