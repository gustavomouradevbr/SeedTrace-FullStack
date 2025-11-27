README.md completo e atualizado. Ele inclui tudo o que discutimos: como rodar o front, como rodar o back (no VS Code e no Eclipse), como configurar o banco de dados e o fluxo de trabalho do Git para a sua equipa.

Copie o código abaixo e cole no arquivo `README.md` na raiz do seu repositório.

# 🌱 SeedTrace - Full Stack

Bem-vindo ao repositório oficial do **SeedTrace**, uma solução web para rastreabilidade e gestão de distribuição de sementes, desenvolvida para apoiar o IPA e os Agricultores de Pernambuco.

O projeto está estruturado como um **Monorepo** dividido em duas partes principais:
- 📂 **SeedTrace_frontend**: Interface do utilizador (HTML5, CSS3, JavaScript).
- 📂 **SeedTrace_backend**: API REST e Regras de Negócio (Java 17, Spring Boot, MySQL).

---

## 🛠️ Pré-requisitos Gerais

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:
- **Git**: Para versionamento de código.
- **Java JDK 17 (ou superior)**: Necessário para o Backend.
- **MySQL**: Banco de dados relacional.
- **IDE de sua preferência**: VS Code (Recomendado), Eclipse ou IntelliJ.

---

## 🎨 Como rodar o FRONT-END

Se for trabalhar apenas nas telas ou integração visual:

1. **Clone o repositório**:
2. 
   ```bash
   git clone [https://github.com/gustavomouradevbr/SeedTrace-FullStack.git](https://github.com/gustavomouradevbr/SeedTrace-FullStack.git)
```


2.  Abra a pasta raiz `SeedTrace-FullStack` no **VS Code**.
3.  Navegue até a pasta `SeedTrace_frontend`.
4.  **Para visualizar**:
      - Instale a extensão **Live Server** no VS Code.
      - Clique com o botão direito em qualquer arquivo HTML (ex: `dashboard-ipa.html`) e escolha **"Open with Live Server"**.

> **⚠️ Nota:** O Front-end consome dados do Back-end. Se a API Java não estiver a rodar, as tabelas aparecerão vazias.

-----

## ⚙️ Como rodar o BACK-END

O Back-end é um projeto **Maven**. Você pode rodá-lo em qualquer IDE compatível.

### 1\. Configuração do Banco de Dados (Obrigatório)

Antes de rodar pela primeira vez, abra o seu gerenciador de banco (MySQL Workbench, DBeaver, etc.) e execute:

```sql
CREATE DATABASE seedtrace;
```

### 2\. Configurar a Senha do Banco

1.  Navegue até: `SeedTrace_backend/demo/src/main/resources/application.properties`.
2.  Encontre a linha: `spring.datasource.password`.
3.  **Insira a SUA senha** local do MySQL.
    *(Cuidado para não "commitar" senhas pessoais sensíveis).*

### 3\. Rodando no VS Code

1.  Certifique-se de ter o **"Extension Pack for Java"** e **"Spring Boot Tools"** instalados.
2.  Abra o arquivo principal: `src/main/java/com/seedtrace/api/DemoApplication.java`.
3.  Clique no botão **Play (▶️)** no canto superior direito ou no link "Run" acima do método `main`.

### 4\. Rodando no Eclipse (Para quem prefere)

1.  Abra o Eclipse.
2.  Vá em **File \> Import...**
3.  Selecione **Maven \> Existing Maven Projects** e clique em Next.
4.  Clique em **Browse** e selecione a pasta `SeedTrace_backend/demo` (onde está o arquivo `pom.xml`).
5.  Clique em **Finish** e aguarde o download das dependências.
6.  Para rodar: Clique com o botão direito em `DemoApplication.java` \> **Run As** \> **Java Application**.

-----

## 🔌 Endpoints da API

Quando o servidor estiver rodando (porta 8080), você pode testar os dados nestes links:

  - **Sementes (Estoque):** `http://localhost:8080/api/sementes`
  - **Entregas:** `http://localhost:8080/api/entregas`
  - **Agricultores:** `http://localhost:8080/api/agricultores`

-----

## 🤝 Fluxo de Trabalho (Git Workflow)

Para evitar conflitos entre a equipa, sigam este processo:

1.  **Antes de começar a codar (Sempre\!):**
    Baixe as atualizações dos colegas.

    ```bash
    git pull origin main
    ```

2.  **Faça as suas alterações** no código.

3.  **Subindo as alterações:**

    ```bash
    git add .
    git commit -m "Descreva o que você fez (ex: Cria tela de login / Ajusta controller de sementes)"
    git push origin main
    ```

-----

## 🆘 Resolução de Problemas Comuns

| Problema | Solução |
| :--- | :--- |
| **Erro de CORS no Navegador** | Verifique se o Controller Java tem a anotação `@CrossOrigin(origins = "*")`. |
| **Erro "Public Key Retrieval"** | No `application.properties`, adicione `&allowPublicKeyRetrieval=true` ao final da URL do banco. |
| **Porta 8080 ocupada** | Verifique se não há outro processo Java rodando. Feche terminais antigos. |
| **Erro 404 no GitHub Pages** | Verifique se o arquivo principal foi renomeado para `index.html`. |

-----

Desenvolvido pela equipe **SeedTrace**. 🚀
