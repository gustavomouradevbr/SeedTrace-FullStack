package com.seedtrace.api.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "agricultores", uniqueConstraints = @UniqueConstraint(columnNames = "cpf"))
public class Agricultor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String municipio;
    private LocalDate ultimoRecebimento;
    @Column(name = "data_nascimento", nullable = false)

    private LocalDate dataNascimento;
    @Column(nullable = false, unique = true)

    private String cpf;

    public Agricultor() {}

    public Agricultor(String nome, String municipio, LocalDate ultimoRecebimento, String cpf, LocalDate dataNascimento) {
        this.nome = nome;
        this.municipio = municipio;
        this.ultimoRecebimento = ultimoRecebimento;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getMunicipio() { return municipio; }
    public void setMunicipio(String municipio) { this.municipio = municipio; }
    public LocalDate getUltimoRecebimento() { return ultimoRecebimento; }
    public void setUltimoRecebimento(LocalDate ultimoRecebimento) { this.ultimoRecebimento = ultimoRecebimento; }
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }
}
