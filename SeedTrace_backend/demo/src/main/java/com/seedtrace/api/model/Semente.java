package com.seedtrace.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "sementes")
public class Semente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private Double quantidadeKg;
    private String status;
    private Integer numeroLotes;

    public Semente() {}

    public Semente(String nome, Double quantidadeKg, String status, Integer numeroLotes) {
        this.nome = nome;
        this.quantidadeKg = quantidadeKg;
        this.status = status;
        this.numeroLotes = numeroLotes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Double getQuantidadeKg() { return quantidadeKg; }
    public void setQuantidadeKg(Double quantidadeKg) { this.quantidadeKg = quantidadeKg; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getNumeroLotes() { return numeroLotes; }
    public void setNumeroLotes(Integer numeroLotes) { this.numeroLotes = numeroLotes; }
}
