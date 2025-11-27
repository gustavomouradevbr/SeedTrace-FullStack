package com.seedtrace.api.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "agricultores")
public class Agricultor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String municipio;
    private LocalDate ultimoRecebimento;

    public Agricultor() {}

    public Agricultor(String nome, String municipio, LocalDate ultimoRecebimento) {
        this.nome = nome;
        this.municipio = municipio;
        this.ultimoRecebimento = ultimoRecebimento;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getMunicipio() { return municipio; }
    public void setMunicipio(String municipio) { this.municipio = municipio; }
    public LocalDate getUltimoRecebimento() { return ultimoRecebimento; }
    public void setUltimoRecebimento(LocalDate ultimoRecebimento) { this.ultimoRecebimento = ultimoRecebimento; }
}
