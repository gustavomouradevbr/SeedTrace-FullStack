const formatoNumero = new Intl.NumberFormat('pt-BR');
const AGRICULTOR_NOME_KEY = 'nomeAgricultor';

function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function normalizarStatus(text = '') {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

async function carregarSementes() {
    const url = 'http://localhost:8080/api/sementes';
    const container = document.getElementById('lista-sementes');
    if (!container) return;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Falha ao carregar sementes');
        const data = await res.json();

        container.innerHTML = '';

        let totalEstoque = 0;
        let totalBaixo = 0;

        data.forEach(s => {
            const quantidade = Number(s.quantidadeKg) || 0;
            totalEstoque += quantidade;

            const statusNormalizado = normalizarStatus(s.status);
            let statusClass = 'disponivel';

            if (statusNormalizado === 'estoque baixo') {
                statusClass = 'baixo';
                totalBaixo += 1;
            } else if (['critico', 'indisponivel'].includes(statusNormalizado)) {
                statusClass = 'critico';
                totalBaixo += 1;
            } else if (statusNormalizado === 'disponivel') {
                statusClass = 'disponivel';
            }

            const row = document.createElement('div');
            row.className = 'table-row';
            row.innerHTML = `
                <div>${escapeHtml(s.nome)}</div>
                <div>${formatoNumero.format(quantidade)}</div>
                <div><span class="status-pill ${statusClass}">${escapeHtml(s.status)}</span></div>
                <div>${escapeHtml(s.numeroLotes)}</div>
                <div>
                    <a href="#" class="action-link">Ver detalhes</a>
                    <button class="btn-delete" type="button" onclick="deletarSemente(${s.id})" title="Excluir">🗑️</button>
                </div>
            `;
            container.appendChild(row);
        });

        const totalEstoqueEl = document.getElementById('total-estoque');
        if (totalEstoqueEl) totalEstoqueEl.textContent = formatoNumero.format(totalEstoque);

        const totalBaixoEl = document.getElementById('total-baixo');
        if (totalBaixoEl) totalBaixoEl.textContent = totalBaixo;
    } catch (err) {
        console.error('Erro ao carregar sementes:', err);
        container.innerHTML = '<div class="table-row"><div colspan="5">Erro ao carregar dados.</div></div>';
    }
}

function formatarDataPrevisao(valor) {
    if (!valor) return '-';
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) {
        return valor;
    }
    return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

function classeStatusEntrega(status = '') {
    const texto = status.trim().toLowerCase();
    if (texto === 'em transporte') return 'transporte';
    if (texto === 'entregue') return 'entregue';
    return 'planejada';
}

async function carregarEntregas() {
    const container = document.getElementById('lista-entregas');
    if (!container) return;

    container.innerHTML = '<div class="table-row"><div colspan="4">Carregando entregas...</div></div>';

    try {
        const resposta = await fetch('http://localhost:8080/api/entregas');
        if (!resposta.ok) throw new Error('Falha ao carregar entregas');

        const entregas = await resposta.json();
        if (!entregas.length) {
            container.innerHTML = '<div class="table-row"><div colspan="4">Nenhuma entrega cadastrada ainda.</div></div>';
            return;
        }

        container.innerHTML = '';
        entregas.forEach((entrega) => {
            const statusClass = classeStatusEntrega(entrega.status || '');
            const destino = entrega.agricultor
                ? `${escapeHtml(entrega.municipio || '-') }<br><small>${escapeHtml(entrega.agricultor)}</small>`
                : escapeHtml(entrega.municipio || '-');
            const row = document.createElement('div');
            row.className = 'table-row';
            row.innerHTML = `
                <div>${destino}</div>
                <div>${formatarDataPrevisao(entrega.dataPrevisao)}</div>
                <div><span class="status-text ${statusClass}">${escapeHtml(entrega.status || '-')}</span></div>
                <div><a href="#" class="action-link">Ver detalhes</a></div>
            `;

            const detalheLink = row.querySelector('.action-link');
            detalheLink.addEventListener('click', (event) => {
                event.preventDefault();
                alert('Em breve você poderá acompanhar o detalhamento desta entrega.');
            });

            container.appendChild(row);
        });
    } catch (erro) {
        console.error('Erro ao carregar entregas:', erro);
        container.innerHTML = '<div class="table-row"><div colspan="4">Erro ao carregar entregas.</div></div>';
    }
}

// Garante que o script só rode depois que o HTML carregar
document.addEventListener("DOMContentLoaded", () => {

    atualizarSaudacaoAgricultor();

    // --- LÓGICA DA TELA: index.html ---
    
    const botaoAgricultor = document.getElementById("btnAgricultor");
    const botaoIPA = document.getElementById("btnIPA");

    if (botaoAgricultor) {
        botaoAgricultor.addEventListener("click", () => {
            console.log("Botão Agricultor clicado. Redirecionando...");
            window.location.href = "identificacao-agricultor.html";
        });
    }

    if (botaoIPA) {
        botaoIPA.addEventListener("click", () => {
            console.log("Botão IPA clicado. Redirecionando para login-ipa.html");
            window.location.href = "login-ipa.html";
        });
    }


    // --- LÓGICA DA TELA: identificacao-agricultor.html ---
    
    const btnConsultar = document.getElementById("btnConsultar");

    if (btnConsultar) {
        btnConsultar.addEventListener("click", async (event) => {
            event.preventDefault();
            const cpfInput = document.getElementById("cpf");
            const dataInput = document.getElementById("data-nascimento");
            const cpf = cpfInput ? cpfInput.value.trim() : "";
            const dataNascimento = dataInput ? dataInput.value.trim() : "";

            if (!cpf || !dataNascimento) {
                alert("Informe o CPF e a data de nascimento para continuar.");
                return;
            }

            const dataISO = converterDataNascimentoParaISO(dataNascimento);
            if (!dataISO) {
                alert("Data de nascimento inválida. Use o formato DD/MM/AAAA.");
                return;
            }

            try {
                const params = new URLSearchParams({
                    cpf,
                    dataNascimento: dataISO
                });
                const resp = await fetch(`http://localhost:8080/api/agricultores/busca?${params.toString()}`);
                if (resp.ok) {
                    const agricultor = await resp.json();
                    salvarNomeAgricultor(agricultor.nome || "");
                    window.location.href = "confirmacao-agricultor.html";
                } else if (resp.status === 404) {
                    alert("CPF e data de nascimento não conferem. Verifique os dados informados.");
                } else {
                    throw new Error('Falha ao consultar cadastro');
                }
            } catch (error) {
                console.error('Erro ao consultar agricultor:', error);
                alert('Não foi possível verificar os dados. Tente novamente.');
            }
        });
    }


    // --- LÓGICA DA TELA: confirmacao-agricultor.html ---
    
    const btnConfirmar = document.getElementById("btnConfirmar");
    const btnNegar = document.getElementById("btnNegar");

    if (btnConfirmar) {
        btnConfirmar.addEventListener("click", () => {
            console.log("Botão Confirmar clicado. Redirecionando...");
            window.location.href = "dashboard-agricultor.html";
        });
    }

    if (btnNegar) {
        btnNegar.addEventListener("click", () => {
            console.log("Botão Negar clicado. Voltando...");
            limparNomeAgricultor();
            window.location.href = "identificacao-agricultor.html";
        });
    }

    
    // --- LÓGICA DA TELA: dashboard-agricultor.html ---

    const btnSair = document.getElementById("btnSair");
    const dashboardButtons = document.querySelectorAll(".lote-list .button.small");

    // Botão Sair do Header
    if (btnSair) {
        btnSair.addEventListener("click", (event) => {
            event.preventDefault(); 
            console.log("Botão Sair clicado. Voltando para home...");
            limparNomeAgricultor();
            window.location.href = "index.html";
        });
    }

    // Botões dos Cards (Rastrear / Comprovante)
    if (dashboardButtons.length > 0) {
        dashboardButtons.forEach(button => {
            
            // Lógica para Rastrear
            if (button.textContent.includes("Rastrear")) {
                
                const card = button.closest('.lote-card');
                const cardTitle = card.querySelector('h3').textContent;

                if (cardTitle.includes("Milho")) {
                    button.addEventListener("click", () => {
                        console.log("Botão Rastrear (Milho) clicado.");
                        window.location.href = "rastreamento-lote.html";
                    });
                } else if (cardTitle.includes("Sorgo")) {
                    button.addEventListener("click", () => {
                        console.log("Botão Rastrear (Sorgo) clicado.");
                        window.location.href = "rastreamento-sorgo.html";
                    });
                }
            } 
            // Lógica para Comprovante
            else if (button.textContent.includes("Comprovante")) {
                button.addEventListener("click", () => {
                    console.log("Botão Comprovante clicado. Redirecionando...");
                    window.location.href = "comprovante.html";
                });
            }
        });
    }

    
    // --- LÓGICA DA TELA: rastreamento-lote.html (e outras com header branco) ---

    const btnVoltar = document.getElementById("btnVoltar");
    const btnSairRastreio = document.getElementById("btnSairRastreio");

    // Botão Voltar (Reaproveitado)
    if (btnVoltar) {
        btnVoltar.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("Botão Voltar clicado. Voltando para o dashboard...");
            window.location.href = "dashboard-agricultor.html";
        });
    }

    // Botão Sair (Específico do Rastreio de Milho)
    if (btnSairRastreio) {
        btnSairRastreio.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("Botão Sair (Rastreio) clicado. Voltando para home...");
            limparNomeAgricultor();
            window.location.href = "index.html";
        });
    }

    
    // --- LÓGICA DA TELA: comprovante.html ---

    const btnSairComprovante = document.getElementById("btnSairComprovante");
    const btnBaixarPDF = document.getElementById("btnBaixarPDF");

    // Botão Sair (Específico do Comprovante)
    if (btnSairComprovante) {
        btnSairComprovante.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("Botão Sair (Comprovante) clicado. Voltando para home...");
            limparNomeAgricultor();
            window.location.href = "index.html";
        });
    }

    // Botão Baixar PDF
    if (btnBaixarPDF) {
        btnBaixarPDF.addEventListener("click", () => {
            console.log("Botão Baixar PDF clicado.");
            alert("Simulando download do comprovante em PDF...");
        });
    }


    // --- LÓGICA DA TELA: rastreamento-sorgo.html ---

    const btnSairRastreioSorgo = document.getElementById("btnSairRastreioSorgo");

    // Botão Sair (Específico do Rastreio de Sorgo)
    if (btnSairRastreioSorgo) {
        btnSairRastreioSorgo.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("Botão Sair (Rastreio Sorgo) clicado. Voltando para home...");
            limparNomeAgricultor();
            window.location.href = "index.html";
        });
    }


    // --- LÓGICA DA TELA: login-ipa.html ---
    
    const btnAcessarIPA = document.getElementById("btnAcessarIPA");

    if (btnAcessarIPA) {
        btnAcessarIPA.addEventListener("click", autenticarLoginIPA);
    }


    // --- LÓGICA DA TELA: dashboard-ipa.html ---
    
    const btnSairIPA = document.getElementById("btnSairIPA");
    const btnRegistrarLote = document.getElementById("btnRegistrarLote");
    
    // Botão Sair (Reaproveitado em todo o dashboard IPA)
    if (btnSairIPA) {
        btnSairIPA.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("Botão Sair (IPA) clicado. Voltando para home...");
            window.location.href = "index.html";
        });
    }

    // Botão "Registrar Novo Lote" (só existe em dashboard-ipa.html)
    if (btnRegistrarLote) {
        btnRegistrarLote.addEventListener("click", () => {
            console.log("Botão Registrar Novo Lote clicado. Redirecionando...");
            window.location.href = "registro-lote.html";
        });
    }

    // Carrega listas dinâmicas (se os elementos existirem)
    carregarSementes();
    carregarEntregas();

    // Filtro de busca para dashboard-ipa
    const search = document.getElementById('search-sementes');
    if (search) {
        let timeout;
        search.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const termo = search.value.trim().toLowerCase();
                const linhas = Array.from(document.querySelectorAll('#lista-sementes .table-row'));
                linhas.forEach(l => {
                    const nome = l.querySelector('div')?.textContent?.toLowerCase() || '';
                    l.style.display = nome.includes(termo) ? '' : 'none';
                });
            }, 200);
        });
    }


    // --- LÓGICA DA TELA: registro-lote.html ---
    
    const btnVoltarEstoque = document.getElementById("btnVoltarEstoque");
    const btnCancelarRegistro = document.getElementById("btnCancelarRegistro");
    const btnSalvarRegistro = document.getElementById("btnSalvarRegistro");

    if (btnVoltarEstoque) {
        btnVoltarEstoque.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("Botão Voltar (Registro) clicado. Voltando para dashboard IPA...");
            window.location.href = "dashboard-ipa.html";
        });
    }
    
    if (btnCancelarRegistro) {
        btnCancelarRegistro.addEventListener("click", () => {
            console.log("Botão Cancelar (Registro) clicado. Voltando para dashboard IPA...");
            window.location.href = "dashboard-ipa.html";
        });
    }

    if (btnSalvarRegistro) {
        btnSalvarRegistro.addEventListener("click", async (event) => {
            event.preventDefault();

            const nomeInput = document.getElementById('tipo-semente');
            const quantidadeInput = document.getElementById('quantidade');

            const nome = nomeInput ? nomeInput.value.trim() : '';
            const quantidadeValor = quantidadeInput ? quantidadeInput.value : '';
            const quantidadeKg = parseFloat(quantidadeValor);

            if (!nome || Number.isNaN(quantidadeKg)) {
                alert('Preencha o tipo de semente e a quantidade (em kg).');
                return;
            }

            const payload = {
                nome,
                quantidadeKg,
                status: 'Disponível',
                numeroLotes: 1
            };

            try {
                const response = await fetch('http://localhost:8080/api/sementes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error('Falha ao salvar a semente');

                alert('Lote salvo com sucesso!');
                window.location.href = 'dashboard-ipa.html';
            } catch (error) {
                console.error('Erro ao salvar registro:', error);
                alert('Não foi possível salvar o lote. Tente novamente.');
            }
        });
    }


    // --- LÓGICA DA TELA: entregas-ipa.html ---
    
    const btnPlanejarEntrega = document.getElementById("btnPlanejarEntrega");

    if (btnPlanejarEntrega) {
        btnPlanejarEntrega.addEventListener("click", () => {
            console.log("Botão Planejar Nova Entrega clicado.");
            window.location.href = "planejar-entrega.html";
        });
    }


    // --- LÓGICA DA TELA: planejar-entrega.html ---

    const btnVoltarEntregas = document.getElementById("btnVoltarEntregas");
    const btnCancelarPlanejamento = document.getElementById("btnCancelarPlanejamento");
    const btnSalvarPlanejamento = document.getElementById("btnSalvarPlanejamento");

    if (btnVoltarEntregas) {
        btnVoltarEntregas.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("Botão Voltar (Planejamento) clicado. Voltando...");
            window.location.href = "entregas-ipa.html";
        });
    }
    
    if (btnCancelarPlanejamento) {
        btnCancelarPlanejamento.addEventListener("click", () => {
            console.log("Botão Cancelar (Planejamento) clicado. Voltando...");
            window.location.href = "entregas-ipa.html";
        });
    }

    if (btnSalvarPlanejamento) {
        btnSalvarPlanejamento.addEventListener("click", async (event) => {
            event.preventDefault();

            const municipio = document.getElementById("municipio")?.value.trim();
            const agricultor = document.getElementById("agricultor")?.value.trim();
            const lote = document.getElementById("lote")?.value.trim();
            const quantidadeTexto = document.getElementById("quantidade")?.value.trim();
            const dataPrevisaoTexto = document.getElementById("data-previsao")?.value.trim();
            const tecnico = document.getElementById("tecnico")?.value.trim();

            const quantidadeKg = quantidadeTexto ? parseFloat(quantidadeTexto.replace(',', '.')) : NaN;
            const dataISO = dataPrevisaoTexto ? converterDataNascimentoParaISO(dataPrevisaoTexto) : null;

            if (!municipio || !agricultor || !lote || Number.isNaN(quantidadeKg) || !dataISO || !tecnico) {
                alert("Preencha todos os campos corretamente para salvar a entrega.");
                return;
            }

            const payload = {
                municipio,
                agricultor,
                loteSemente: lote,
                quantidadeKg,
                dataPrevisao: dataISO,
                tecnicoResponsavel: tecnico,
                status: "Planejada"
            };

            try {
                const resposta = await fetch('http://localhost:8080/api/entregas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!resposta.ok) throw new Error('Falha ao salvar entrega');

                alert('Entrega planejada com sucesso!');
                window.location.href = 'entregas-ipa.html';
            } catch (erro) {
                console.error('Erro ao salvar entrega:', erro);
                alert('Não foi possível salvar a entrega. Tente novamente.');
            }
        });
    }

    
    // --- LÓGICA DA TELA: agricultores-ipa.html ---
    
    const btnCadastrarProdutor = document.getElementById("btnCadastrarProdutor");
    const btnsVerHistorico = document.querySelectorAll(".entregas-table .action-link");

    if (btnCadastrarProdutor) {
        btnCadastrarProdutor.addEventListener("click", () => {
            console.log("Botão Cadastrar Produtor clicado.");
            window.location.href = "cadastrar-agricultor.html";
        });
    }

    if (btnsVerHistorico.length > 0) {
        btnsVerHistorico.forEach(link => {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                console.log("Botão Ver Histórico clicado.");
                alert("Tela de Histórico do Agricultor em construção!");
            });
        });
    }
    

    // --- LÓGICA DA TELA: cadastrar-agricultor.html ---
    
    const btnVoltarAgricultores = document.getElementById("btnVoltarAgricultores");
    const btnCancelarCadastro = document.getElementById("btnCancelarCadastro");
    const btnSalvarCadastro = document.getElementById("btnSalvarCadastro");

    if (btnVoltarAgricultores) {
        btnVoltarAgricultores.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("Botão Voltar (Cadastro) clicado. Voltando...");
            window.location.href = "agricultores-ipa.html";
        });
    }
    
    if (btnCancelarCadastro) {
        btnCancelarCadastro.addEventListener("click", () => {
            console.log("Botão Cancelar (Cadastro) clicado. Voltando...");
            window.location.href = "agricultores-ipa.html";
        });
    }

    if (btnSalvarCadastro) {
        btnSalvarCadastro.addEventListener("click", () => {
            console.log("Botão Salvar (Cadastro) clicado.");
            alert("Novo agricultor cadastrado com sucesso! (Simulação)");
            window.location.href = "agricultores-ipa.html";
        });
    }


    // --- LÓGICA DA TELA: relatorios-ipa.html ---
    
    const btnGerarRelatorio = document.getElementById("btnGerarRelatorio");

    if (btnGerarRelatorio) {
        btnGerarRelatorio.addEventListener("click", () => {
            console.log("Botão Gerar Relatório clicado.");
            alert("Gerando seu relatório! (Simulação)");
        });
    }

});

async function autenticarLoginIPA(event) {
    event.preventDefault();

    const button = event.currentTarget;
    const cpfInput = document.getElementById('cpf-ipa');
    const senhaInput = document.getElementById('senha-ipa');

    const cpf = cpfInput ? cpfInput.value.trim() : '';
    const senha = senhaInput ? senhaInput.value : '';

    if (!cpf || !senha) {
        alert('Preencha o CPF e a senha.');
        return;
    }

    button.disabled = true;
    button.classList.add('loading');

    try {
        const response = await fetch('http://localhost:8080/api/auth/login-ipa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cpf, senha })
        });

        if (!response.ok) {
            throw new Error('Credenciais inválidas');
        }

        window.location.href = 'dashboard-ipa.html';
    } catch (error) {
        console.error('Erro no login:', error);
        alert('CPF ou senha inválidos.');
    } finally {
        button.disabled = false;
        button.classList.remove('loading');
    }
}

async function deletarSemente(id) {
    if (!id) return;
    const confirmar = confirm('Tem certeza que deseja excluir esta semente?');
    if (!confirmar) return;

    try {
        const resposta = await fetch(`http://localhost:8080/api/sementes/${id}`, { method: 'DELETE' });
        if (!resposta.ok && resposta.status !== 204) {
            throw new Error('Falha ao excluir');
        }
        alert('Semente excluída com sucesso!');
        carregarSementes();
    } catch (erro) {
        console.error('Erro ao excluir semente:', erro);
        alert('Não foi possível excluir a semente. Tente novamente.');
    }
}

function salvarNomeAgricultor(nome) {
    if (!nome) return;
    localStorage.setItem(AGRICULTOR_NOME_KEY, nome);
}

function limparNomeAgricultor() {
    localStorage.removeItem(AGRICULTOR_NOME_KEY);
}

function atualizarSaudacaoAgricultor() {
    const nome = localStorage.getItem(AGRICULTOR_NOME_KEY);
    if (!nome) return;

    if (window.location.pathname.endsWith('confirmacao-agricultor.html')) {
        const titulo = document.querySelector('.welcome-card h1');
        if (titulo) titulo.textContent = `Olá, ${nome}!`;
    }

    if (window.location.pathname.endsWith('dashboard-agricultor.html')) {
        const saudacao = document.querySelector('.greeting');
        if (saudacao) saudacao.textContent = `Olá, ${nome}!`;
    }
}

function converterDataNascimentoParaISO(valor) {
    if (!valor) return null;
    const match = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return null;

    const dia = parseInt(match[1], 10);
    const mes = parseInt(match[2], 10);
    const ano = parseInt(match[3], 10);

    if (!dia || !mes || !ano) return null;

    const data = new Date(Date.UTC(ano, mes - 1, dia));
    const diaValido = data.getUTCDate() === dia;
    const mesValido = data.getUTCMonth() + 1 === mes;
    const anoValido = data.getUTCFullYear() === ano;

    if (!diaValido || !mesValido || !anoValido) return null;

    const diaStr = String(dia).padStart(2, '0');
    const mesStr = String(mes).padStart(2, '0');
    return `${ano}-${mesStr}-${diaStr}`;
}