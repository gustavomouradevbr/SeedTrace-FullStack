package com.seedtrace.api.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "lotes")
public class Lote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sementeNome;
    private Double quantidadeKg;
    private LocalDate dataRegistro;
    private String origem;
    private String agricultor;
    private String observacoes;

    public Lote() {}

    public Lote(String sementeNome, Double quantidadeKg, LocalDate dataRegistro, String origem, String agricultor, String observacoes) {
        this.sementeNome = sementeNome;
        this.quantidadeKg = quantidadeKg;
        this.dataRegistro = dataRegistro;
        this.origem = origem;
        this.agricultor = agricultor;
        this.observacoes = observacoes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSementeNome() { return sementeNome; }
    public void setSementeNome(String sementeNome) { this.sementeNome = sementeNome; }
    public Double getQuantidadeKg() { return quantidadeKg; }
    public void setQuantidadeKg(Double quantidadeKg) { this.quantidadeKg = quantidadeKg; }
    public LocalDate getDataRegistro() { return dataRegistro; }
    public void setDataRegistro(LocalDate dataRegistro) { this.dataRegistro = dataRegistro; }
    public String getOrigem() { return origem; }
    public void setOrigem(String origem) { this.origem = origem; }
    public String getAgricultor() { return agricultor; }
    public void setAgricultor(String agricultor) { this.agricultor = agricultor; }
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
}
