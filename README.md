# SeedTrace-FullStack

Projeto voltado à rastreabilidade e gestão da distribuição de sementes do Instituto Agronômico de Pernambuco (IPA). O sistema oferece transparência e facilidade tanto para agricultores quanto para técnicos do IPA.

## Funcionalidades

- **Painel do Agricultor**: Acompanhe seus lotes de sementes, status de entrega, previsão e rastreio detalhado.
- **Painel do IPA**: Gestão dos registros, planejamento de entregas, geração de relatórios por período e tipo, cadastro de agricultores.
- **Rastreamento de Lote**: Visualização dos passos da entrega, próximos estágios e timeline de status.
- **Planejamento de Entrega**: Seleção de lote, quantidade, agendamento e atribuição de técnico responsável.
- **Login Diferenciado**: Agricultores acessam com nome, equipe IPA via tela própria de autenticação.
- **Responsividade**: Interface adaptada para dispositivos móveis e desktop.
- **Personalização Visual**: Tema leve, cores do IPA e fonte 'Inter' do Google Fonts para melhor legibilidade.

## Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
  - Estrutura em múltiplas páginas: `index.html`, `dashboard-agricultor.html`, `planejar-entrega.html`, etc.
  - `style.css` otimizado para mobile e desktop.
  - Scripts de interação dinâmica em `script.js`, comunicação com backend via `fetch` (API REST).
- **Backend:** Espera-se integração por API REST na porta padrão (`http://localhost:8080`), exemplo:
  - `GET /api/lotes/:id` para rastreamento
  - `POST /api/relatorios` para geração de relatórios
  - `DELETE /api/sementes/:id` para remoção

## Como Executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/gustavomouradevbr/SeedTrace-FullStack
   ```
2. Navegue para a pasta `SeedTrace_frontend` e abra o arquivo `index.html` em seu navegador.
3. Certifique-se de executar o backend/API (não incluso no projeto).

## Estrutura de Pastas

```
SeedTrace_frontend/
│
├── index.html (Página inicial)
├── dashboard-agricultor.html (Painel do Agricultor)
├── rastreamento-lote.html (Rastreamento de lote)
├── rastreamento-sorgo.html (Rastreamento de sorgo)
├── planejar-entrega.html (Planejamento de entregas)
├── confirmacao-agricultor.html (Confirmação de identidade)
├── style.css (Estilos)
└── script.js (Javascript de funcionalidades)
```

## Créditos e Licença

Uma iniciativa do [Instituto Agronômico de Pernambuco (IPA)](https://ipa.br).  
© 2025 - Governo de Pernambuco

---

> Para dúvidas, sugestões ou colaboração abra uma issue neste repositório!
