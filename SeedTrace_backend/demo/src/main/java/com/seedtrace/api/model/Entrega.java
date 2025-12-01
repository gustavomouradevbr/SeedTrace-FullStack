package com.seedtrace.api.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "entregas")
public class Entrega {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String municipio;
    private String agricultor;
    private String loteSemente;
    private Double quantidadeKg;
    private LocalDate dataPrevisao;
    private String tecnicoResponsavel;
    private String status;

    public Entrega() {}

    public Entrega(String municipio,
                   String agricultor,
                   String loteSemente,
                   Double quantidadeKg,
                   LocalDate dataPrevisao,
                   String tecnicoResponsavel,
                   String status) {
        this.municipio = municipio;
        this.agricultor = agricultor;
        this.loteSemente = loteSemente;
        this.quantidadeKg = quantidadeKg;
        this.dataPrevisao = dataPrevisao;
        this.tecnicoResponsavel = tecnicoResponsavel;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMunicipio() { return municipio; }
    public void setMunicipio(String municipio) { this.municipio = municipio; }

    public String getAgricultor() { return agricultor; }
    public void setAgricultor(String agricultor) { this.agricultor = agricultor; }

    public String getLoteSemente() { return loteSemente; }
    public void setLoteSemente(String loteSemente) { this.loteSemente = loteSemente; }

    public Double getQuantidadeKg() { return quantidadeKg; }
    public void setQuantidadeKg(Double quantidadeKg) { this.quantidadeKg = quantidadeKg; }

    public LocalDate getDataPrevisao() { return dataPrevisao; }
    public void setDataPrevisao(LocalDate dataPrevisao) { this.dataPrevisao = dataPrevisao; }

    public String getTecnicoResponsavel() { return tecnicoResponsavel; }
    public void setTecnicoResponsavel(String tecnicoResponsavel) { this.tecnicoResponsavel = tecnicoResponsavel; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
