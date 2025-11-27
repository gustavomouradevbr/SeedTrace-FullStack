package com.seedtrace.api.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "entregas")
public class Entrega {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String destino;
    private LocalDate dataPrevisao;
    private String status;

    public Entrega() {}

    public Entrega(String destino, LocalDate dataPrevisao, String status) {
        this.destino = destino;
        this.dataPrevisao = dataPrevisao;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDestino() { return destino; }
    public void setDestino(String destino) { this.destino = destino; }
    public LocalDate getDataPrevisao() { return dataPrevisao; }
    public void setDataPrevisao(LocalDate dataPrevisao) { this.dataPrevisao = dataPrevisao; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
