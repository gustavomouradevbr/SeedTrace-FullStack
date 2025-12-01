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

function classeStatusLote(text = '') {
    const status = normalizarStatus(text);
    if (status.includes('entreg')) return 'entregue';
    if (status.includes('caminho') || status.includes('transito')) return 'a-caminho';
    return 'aguardando';
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

function formatarDataSimples(valor) {
    if (!valor) return '';
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) {
        return valor;
    }
    return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
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

async function carregarAgricultores() {
    const container = document.getElementById('lista-agricultores');
    if (!container) return;

    container.innerHTML = '<div class="table-row"><div colspan="4">Carregando agricultores...</div></div>';

    try {
        const resposta = await fetch('http://localhost:8080/api/agricultores');
        if (!resposta.ok) throw new Error('Falha ao carregar agricultores');

        const agricultores = await resposta.json();
        if (!agricultores.length) {
            container.innerHTML = '<div class="table-row"><div colspan="4">Nenhum agricultor cadastrado ainda.</div></div>';
            return;
        }

        container.innerHTML = '';
        agricultores.forEach((agricultor) => {
            const dataNascimento = formatarDataSimples(agricultor.dataNascimento);
            const ultimoRecebimento = formatarDataSimples(agricultor.ultimoRecebimento);
            const dataExibicao = dataNascimento || ultimoRecebimento || '-';

            const row = document.createElement('div');
            row.className = 'table-row';
            row.innerHTML = `
                <div>${escapeHtml(agricultor.nome || '-')}</div>
                <div>${escapeHtml(agricultor.municipio || '-')}</div>
                <div>${escapeHtml(dataExibicao)}</div>
                <div class="acoes">
                    <a href="#" class="action-link">Ver histórico</a>
                    <button type="button" class="btn-edit">✏️ Editar</button>
                </div>
            `;

            const link = row.querySelector('.action-link');
            link.addEventListener('click', (event) => {
                event.preventDefault();
                alert('Tela de histórico do agricultor em construção!');
            });

            const btnEditar = row.querySelector('.btn-edit');
            btnEditar.addEventListener('click', () => {
                if (!agricultor.id) return;
                window.location.href = `cadastrar-agricultor.html?id=${encodeURIComponent(agricultor.id)}`;
            });

            container.appendChild(row);
        });
    } catch (erro) {
        console.error('Erro ao carregar agricultores:', erro);
        container.innerHTML = '<div class="table-row"><div colspan="4">Erro ao carregar agricultores.</div></div>';
    }
}

async function carregarDashboardAgricultor() {
    const container = document.getElementById('lista-lotes-agricultor');
    if (!container) return;

    const nomeAgricultor = localStorage.getItem(AGRICULTOR_NOME_KEY);
    if (!nomeAgricultor) {
        window.location.href = 'identificacao-agricultor.html';
        return;
    }

    container.innerHTML = `
        <div class="lote-card skeleton">
            <div class="lote-info">
                <h3>Carregando lotes...</h3>
                <span class="status aguardando">⏳ Aguarde</span>
            </div>
        </div>
    `;

    try {
        const resposta = await fetch('http://localhost:8080/api/lotes');
        if (!resposta.ok) throw new Error('Falha ao carregar lotes');

        const lotes = await resposta.json();
        const lotesFiltrados = (Array.isArray(lotes) ? lotes : []).filter((lote) => {
            if (!lote || !lote.agricultor) return true;
            return normalizarStatus(lote.agricultor) === normalizarStatus(nomeAgricultor);
        });

        if (!lotesFiltrados.length) {
            container.innerHTML = `
                <div class="lote-card vazio">
                    <div class="lote-info">
                        <h3>Nenhuma entrega encontrada</h3>
                        <p>Volte mais tarde para acompanhar novos lotes cadastrados pelo IPA.</p>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        lotesFiltrados.forEach((lote) => {
            const statusTexto = obterStatusLote(lote);
            const statusClasse = classeStatusLote(statusTexto);
            const dataRegistro = formatarDataSimples(lote?.dataRegistro);
            const quantidade = Number(lote?.quantidadeKg) || 0;

            const card = document.createElement('div');
            card.className = 'lote-card';
            card.innerHTML = `
                <div class="lote-info">
                    <h3>${escapeHtml(lote?.sementeNome || 'Lote sem identificação')}</h3>
                    <span class="status ${statusClasse}">${escapeHtml(statusTexto)}</span>
                    <p class="lote-meta">Origem: ${escapeHtml(lote?.origem || 'Não informado')}</p>
                    <p class="lote-meta">Registrado em ${escapeHtml(dataRegistro || '-')}</p>
                    <p class="lote-meta">Quantidade: ${escapeHtml(formatoNumero.format(quantidade))} kg</p>
                </div>
                <div class="lote-action">
                    <button class="button primary small" type="button">Acompanhar entrega</button>
                </div>
            `;

            const botao = card.querySelector('button');
            botao.addEventListener('click', () => {
                if (!lote?.id) {
                    alert('Não foi possível identificar o lote selecionado.');
                    return;
                }
                window.location.href = `rastreamento-lote.html?id=${encodeURIComponent(lote.id)}`;
            });

            container.appendChild(card);
        });
    } catch (erro) {
        console.error('Erro ao carregar lotes:', erro);
        container.innerHTML = `
            <div class="lote-card erro">
                <div class="lote-info">
                    <h3>Não foi possível carregar os lotes.</h3>
                    <p>Tente novamente em alguns instantes.</p>
                </div>
            </div>
        `;
    }
}

function obterStatusLote(lote) {
    const texto = (lote?.status || lote?.observacoes || '').trim();
    return texto || 'Em andamento';
}

async function carregarDetalhesRastreamento() {
    if (!window.location.pathname.endsWith('rastreamento-lote.html')) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) {
        alert('Selecione um lote para visualizar o rastreamento.');
        window.location.href = 'dashboard-agricultor.html';
        return;
    }

    const tituloEl = document.getElementById('nome-lote');
    const detalhesEl = document.getElementById('detalhes-lote');
    const previsaoEl = document.getElementById('previsao-entrega');
    const timelineEl = document.getElementById('timeline-status');
    const proxPassoEl = document.getElementById('proximo-passo');
    const etapa1Titulo = document.getElementById('etapa-1-titulo');
    const etapa1Descricao = document.getElementById('etapa-1-descricao');

    try {
        const resp = await fetch(`http://localhost:8080/api/lotes/${encodeURIComponent(id)}`);
        if (!resp.ok) throw new Error('Lote não encontrado');
        const lote = await resp.json();

        if (tituloEl) tituloEl.textContent = lote?.sementeNome || `Lote #${id}`;

        if (detalhesEl) {
            const quantidade = formatoNumero.format(Number(lote?.quantidadeKg) || 0);
            const origem = lote?.origem ? ` | Origem: ${lote.origem}` : '';
            detalhesEl.textContent = `${quantidade} kg${origem}`;
        }

        if (previsaoEl) {
            const dataRegistro = formatarDataSimples(lote?.dataRegistro);
            previsaoEl.textContent = dataRegistro
                ? `Registrado em ${dataRegistro}.`
                : 'Sem previsão registrada para este lote.';
        }

        const statusTexto = obterStatusLote(lote);
        const statusNormalizado = normalizarStatus(statusTexto);

        if (statusNormalizado === 'aguardando envio') {
            if (timelineEl) timelineEl.style.display = 'none';
            if (proxPassoEl) {
                proxPassoEl.textContent = 'Este lote ainda está aguardando separação. Você será avisado assim que o envio iniciar.';
            }
            if (etapa1Titulo) etapa1Titulo.textContent = 'Aguardando Envio';
            if (etapa1Descricao) etapa1Descricao.textContent = 'O IPA ainda não iniciou o transporte deste lote.';
        } else {
            if (timelineEl) timelineEl.style.display = '';
            if (etapa1Titulo) etapa1Titulo.textContent = statusTexto;
            if (etapa1Descricao) etapa1Descricao.textContent = 'O lote está em trânsito para o seu município.';
            if (proxPassoEl) {
                proxPassoEl.textContent = 'Continue acompanhando o progresso do transporte.';
            }
        }
    } catch (erro) {
        console.error('Erro ao carregar detalhes do lote:', erro);
        alert('Não foi possível carregar o rastreamento. Tente novamente.');
        window.location.href = 'dashboard-agricultor.html';
    }
}

// Garante que o script só rode depois que o HTML carregar
document.addEventListener("DOMContentLoaded", () => {

    atualizarSaudacaoAgricultor();
    carregarDashboardAgricultor();
    carregarDetalhesRastreamento();

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

    // Botão Sair do Header
    if (btnSair) {
        btnSair.addEventListener("click", (event) => {
            event.preventDefault(); 
            console.log("Botão Sair clicado. Voltando para home...");
            limparNomeAgricultor();
            window.location.href = "index.html";
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
    carregarAgricultores();

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

    if (btnCadastrarProdutor) {
        btnCadastrarProdutor.addEventListener("click", () => {
            console.log("Botão Cadastrar Produtor clicado.");
            window.location.href = "cadastrar-agricultor.html";
        });
    }

    

    // --- LÓGICA DA TELA: cadastrar-agricultor.html ---
    
    inicializarFormularioAgricultor();

    const btnVoltarAgricultores = document.getElementById("btnVoltarAgricultores");
    const btnCancelarCadastro = document.getElementById("btnCancelarCadastro");

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


    // --- LÓGICA DA TELA: relatorios-ipa.html ---
    
    const btnGerarRelatorio = document.getElementById("btnGerarRelatorio");

    if (btnGerarRelatorio) {
        btnGerarRelatorio.addEventListener("click", async () => {
            const tipo = document.getElementById("tipo-relatorio")?.value;
            const inicio = document.getElementById("data-inicio")?.value.trim();
            const fim = document.getElementById("data-fim")?.value.trim();

            if (!tipo || !inicio || !fim) {
                alert("Preencha o tipo e o período do relatório antes de continuar.");
                return;
            }

            try {
                const params = new URLSearchParams({ tipo, inicio, fim });
                const resposta = await fetch(`http://localhost:8080/api/relatorios?${params.toString()}`);
                if (!resposta.ok) throw new Error('Falha ao gerar relatório');

                const data = await resposta.json();
                alert(data.mensagem || 'Relatório gerado com sucesso!');
            } catch (erro) {
                console.error('Erro ao gerar relatório:', erro);
                alert('Não foi possível gerar o relatório. Tente novamente.');
            }
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

function formatarDataParaInput(valor) {
    if (!valor) return '';
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return '';
    return data.toISOString().split('T')[0];
}

function definirValorSelectMunicipio(valor) {
    const select = document.getElementById('municipio');
    if (!select) return;

    if (!valor) {
        select.value = '';
        return;
    }

    const normalizado = normalizarStatus(valor);
    const opcoes = Array.from(select.options);
    const existente = opcoes.find((opt) => {
        const valorNormalizado = normalizarStatus(opt.value || opt.textContent || '');
        return valorNormalizado === normalizado;
    });

    if (existente) {
        select.value = existente.value;
        return;
    }

    const novaOpcao = document.createElement('option');
    novaOpcao.value = valor;
    novaOpcao.textContent = valor;
    novaOpcao.dataset.custom = 'true';
    select.appendChild(novaOpcao);
    select.value = valor;
}

function preencherFormularioAgricultor(agricultor) {
    if (!agricultor) return;

    const nomeInput = document.getElementById('nome');
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const dataInput = document.getElementById('data-nascimento');

    if (nomeInput) nomeInput.value = agricultor.nome || '';
    if (cpfInput) cpfInput.value = agricultor.cpf || '';
    if (telefoneInput) telefoneInput.value = agricultor.telefone || '';
    if (dataInput) dataInput.value = formatarDataParaInput(agricultor.dataNascimento);
    definirValorSelectMunicipio(agricultor.municipio || '');

    const botaoSalvar = document.getElementById('btnSalvarCadastro');
    if (botaoSalvar) {
        botaoSalvar.dataset.ultimoRecebimento = agricultor.ultimoRecebimento || '';
    }
}

function atualizarElementosFormularioAgricultor(emEdicao) {
    const titulo = document.getElementById('titulo-form-agricultor');
    if (titulo) {
        titulo.textContent = emEdicao ? 'Editar Agricultor' : 'Cadastrar Agricultor';
    }

    const subtitulo = document.getElementById('subtitulo-form-agricultor');
    if (subtitulo) {
        subtitulo.textContent = emEdicao
            ? 'Atualize as informações do produtor selecionado.'
            : 'Preencha os dados abaixo para cadastrar um novo produtor.';
    }

    const botao = document.getElementById('btnSalvarCadastro');
    if (botao) {
        botao.textContent = emEdicao ? 'Atualizar' : 'Salvar';
        if (!emEdicao) {
            botao.dataset.ultimoRecebimento = '';
        }
    }
}

async function carregarAgricultorPorId(id) {
    if (!id) return;

    const botao = document.getElementById('btnSalvarCadastro');
    const textoOriginal = botao ? botao.textContent : '';
    if (botao) {
        botao.disabled = true;
        botao.textContent = 'Carregando...';
    }

    try {
        const resposta = await fetch(`http://localhost:8080/api/agricultores/${encodeURIComponent(id)}`);
        if (!resposta.ok) throw new Error('Agricultor não encontrado');

        const agricultor = await resposta.json();
        preencherFormularioAgricultor(agricultor);
    } catch (erro) {
        console.error('Erro ao carregar agricultor:', erro);
        alert('Não foi possível carregar o agricultor selecionado.');
        window.location.href = 'agricultores-ipa.html';
    } finally {
        if (botao) {
            botao.disabled = false;
            botao.textContent = textoOriginal || 'Atualizar';
        }
    }
}

function coletarDadosFormularioAgricultor(ultimoRecebimento, agricultorId) {
    const nome = document.getElementById('nome')?.value.trim() || '';
    const cpf = document.getElementById('cpf')?.value.trim() || '';
    const telefone = document.getElementById('telefone')?.value.trim() || '';
    const municipio = document.getElementById('municipio')?.value || '';
    const dataNascimento = document.getElementById('data-nascimento')?.value || '';

    if (!nome || !cpf || !telefone || !municipio || !dataNascimento) {
        alert('Preencha todos os campos para salvar o agricultor.');
        return null;
    }

    const payload = {
        nome,
        cpf,
        telefone,
        municipio,
        dataNascimento,
        ultimoRecebimento: ultimoRecebimento || null
    };

    if (agricultorId) {
        payload.id = Number(agricultorId);
    }

    return payload;
}

function configurarEnvioAgricultor(agricultorId) {
    const botao = document.getElementById('btnSalvarCadastro');
    if (!botao) return;

    botao.onclick = async (event) => {
        event.preventDefault();

        const ultimoRecebimento = botao.dataset.ultimoRecebimento || null;
        const payload = coletarDadosFormularioAgricultor(ultimoRecebimento, agricultorId);
        if (!payload) return;

        botao.disabled = true;
        botao.textContent = agricultorId ? 'Atualizando...' : 'Salvando...';

        try {
            const baseUrl = 'http://localhost:8080/api/agricultores';
            const resposta = await fetch(
                agricultorId ? `${baseUrl}/${encodeURIComponent(agricultorId)}` : baseUrl,
                {
                    method: agricultorId ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }
            );

            if (!resposta.ok) throw new Error('Falha ao salvar agricultor');

            alert(agricultorId ? 'Agricultor atualizado com sucesso!' : 'Agricultor cadastrado com sucesso!');
            window.location.href = 'agricultores-ipa.html';
        } catch (erro) {
            console.error('Erro ao salvar agricultor:', erro);
            alert('Não foi possível salvar o agricultor. Tente novamente.');
        } finally {
            botao.disabled = false;
            botao.textContent = agricultorId ? 'Atualizar' : 'Salvar';
        }
    };
}

function inicializarFormularioAgricultor() {
    if (!window.location.pathname.endsWith('cadastrar-agricultor.html')) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const emEdicao = Boolean(id);

    atualizarElementosFormularioAgricultor(emEdicao);
    configurarEnvioAgricultor(id);

    if (emEdicao) {
        carregarAgricultorPorId(id);
    }
}