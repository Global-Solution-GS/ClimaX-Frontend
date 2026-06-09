document.addEventListener('DOMContentLoaded', function () {
    var barraNavegacao = document.getElementById('barra-navegacao');
    var botaoMenu = document.getElementById('botao-menu');
    var painelMenu = document.getElementById('painel-menu');
    var linksMenu = document.querySelectorAll('.atalho-menu');
    var linksNavegacao = document.querySelectorAll('.atalho-navegacao');

    function fecharMenu() {
        if (botaoMenu === null || painelMenu === null) {
            return;
        }

        botaoMenu.setAttribute('aria-expanded', 'false');
        botaoMenu.classList.remove('ativo');
        painelMenu.classList.remove('ativo');
        document.body.classList.remove('menu-aberto');
    }

    function iniciarMenuMobile() {
        if (botaoMenu === null || painelMenu === null) {
            return;
        }

        botaoMenu.addEventListener('click', function () {
            var menuAberto = botaoMenu.getAttribute('aria-expanded') === 'true';

            if (menuAberto) {
                fecharMenu();
            } else {
                botaoMenu.setAttribute('aria-expanded', 'true');
                botaoMenu.classList.add('ativo');
                painelMenu.classList.add('ativo');
                document.body.classList.add('menu-aberto');
            }
        });

        for (var i = 0; i < linksMenu.length; i++) {
            linksMenu[i].addEventListener('click', fecharMenu);
        }

        document.addEventListener('keydown', function (evento) {
            if (evento.key === 'Escape') {
                fecharMenu();
            }
        });
    }

    function iniciarTemas() {
        var botoesTema = document.querySelectorAll('[data-theme-option]');
        var temaAtual = localStorage.getItem('climax-tema');

        if (temaAtual !== 'climax' && temaAtual !== 'verde' && temaAtual !== 'alerta') {
            temaAtual = 'climax';
        }

        aplicarTema(temaAtual, botoesTema);

        for (var i = 0; i < botoesTema.length; i++) {
            botoesTema[i].addEventListener('click', function () {
                var temaEscolhido = this.getAttribute('data-theme-option');
                aplicarTema(temaEscolhido, botoesTema);
            });
        }
    }

    function aplicarTema(tema, botoesTema) {
        document.body.setAttribute('data-theme', tema);
        localStorage.setItem('climax-tema', tema);

        for (var i = 0; i < botoesTema.length; i++) {
            var botao = botoesTema[i];
            var temaDoBotao = botao.getAttribute('data-theme-option');

            if (temaDoBotao === tema) {
                botao.classList.add('ativo');
                botao.setAttribute('aria-pressed', 'true');
            } else {
                botao.classList.remove('ativo');
                botao.setAttribute('aria-pressed', 'false');
            }
        }
    }

    function atualizarBarraRolada() {
        if (barraNavegacao === null) {
            return;
        }

        if (window.scrollY > 24) {
            barraNavegacao.classList.add('rolada');
        } else {
            barraNavegacao.classList.remove('rolada');
        }
    }

    function iniciarRolagem() {
        var botaoRolar = document.getElementById('botao-rolar');

        atualizarBarraRolada();
        window.addEventListener('scroll', atualizarBarraRolada, { passive: true });

        if (botaoRolar !== null) {
            botaoRolar.addEventListener('click', function () {
                var secaoProblema = document.getElementById('problema');

                if (secaoProblema !== null) {
                    secaoProblema.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    function iniciarCarrosseis() {
        var carrosseis = document.querySelectorAll('[data-carousel]');

        for (var i = 0; i < carrosseis.length; i++) {
            configurarCarrossel(carrosseis[i]);
        }
    }

    function configurarCarrossel(carrossel) {
        var quadros = carrossel.querySelectorAll('.quadro-camada, .quadro-imagem');
        var botaoAnterior = carrossel.querySelector('[data-carousel-prev]');
        var botaoProximo = carrossel.querySelector('[data-carousel-next]');
        var areaPontos = carrossel.querySelector('.pontos-carrossel');
        var visor = carrossel.querySelector('.visor-carrossel');
        var pontos = [];
        var indiceAtivo = 0;
        var temporizador = null;

        if (quadros.length === 0 || areaPontos === null) {
            return;
        }

        for (var i = 0; i < quadros.length; i++) {
            var ponto = document.createElement('button');
            ponto.type = 'button';
            ponto.setAttribute('aria-label', 'Ir para quadro ' + (i + 1));
            ponto.addEventListener('click', criarAcaoDoPonto(i));
            areaPontos.appendChild(ponto);
            pontos.push(ponto);
        }

        function criarAcaoDoPonto(indice) {
            return function () {
                irPara(indice);
            };
        }

        function atualizar() {
            for (var i = 0; i < quadros.length; i++) {
                if (i === indiceAtivo) {
                    quadros[i].classList.add('ativo');
                    quadros[i].setAttribute('aria-hidden', 'false');
                } else {
                    quadros[i].classList.remove('ativo');
                    quadros[i].setAttribute('aria-hidden', 'true');
                }
            }

            for (var j = 0; j < pontos.length; j++) {
                if (j === indiceAtivo) {
                    pontos[j].classList.add('ativo');
                    pontos[j].setAttribute('aria-current', 'true');
                } else {
                    pontos[j].classList.remove('ativo');
                    pontos[j].setAttribute('aria-current', 'false');
                }
            }
        }

        function irPara(indice) {
            if (indice < 0) {
                indiceAtivo = quadros.length - 1;
            } else if (indice >= quadros.length) {
                indiceAtivo = 0;
            } else {
                indiceAtivo = indice;
            }

            atualizar();
        }

        function parar() {
            if (temporizador !== null) {
                window.clearInterval(temporizador);
            }

            temporizador = null;
        }

        function iniciar() {
            parar();

            temporizador = window.setInterval(function () {
                irPara(indiceAtivo + 1);
            }, 5200);
        }

        if (botaoAnterior !== null) {
            botaoAnterior.addEventListener('click', function () {
                irPara(indiceAtivo - 1);
            });
        }

        if (botaoProximo !== null) {
            botaoProximo.addEventListener('click', function () {
                irPara(indiceAtivo + 1);
            });
        }

        carrossel.addEventListener('mouseenter', parar);
        carrossel.addEventListener('mouseleave', iniciar);
        carrossel.addEventListener('focusin', parar);
        carrossel.addEventListener('focusout', iniciar);

        if (visor !== null) {
            visor.addEventListener('keydown', function (evento) {
                if (evento.key === 'ArrowLeft') {
                    evento.preventDefault();
                    irPara(indiceAtivo - 1);
                }

                if (evento.key === 'ArrowRight') {
                    evento.preventDefault();
                    irPara(indiceAtivo + 1);
                }
            });
        }

        atualizar();
        iniciar();
    }

    function iniciarRevelacao() {
        var elementos = document.querySelectorAll('.revelar');

        if (!('IntersectionObserver' in window)) {
            for (var i = 0; i < elementos.length; i++) {
                elementos[i].classList.add('revelado');
            }

            return;
        }

        var observador = new IntersectionObserver(function (entradas) {
            for (var i = 0; i < entradas.length; i++) {
                var entrada = entradas[i];

                if (entrada.isIntersecting) {
                    entrada.target.classList.add('revelado');
                    observador.unobserve(entrada.target);
                }
            }
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        for (var j = 0; j < elementos.length; j++) {
            observador.observe(elementos[j]);
        }
    }

    function iniciarNavegacaoAtiva() {
        var secoes = document.querySelectorAll('main [id]');

        if (secoes.length === 0 || linksNavegacao.length === 0 || !('IntersectionObserver' in window)) {
            return;
        }

        var observador = new IntersectionObserver(function (entradas) {
            for (var i = 0; i < entradas.length; i++) {
                var entrada = entradas[i];

                if (entrada.isIntersecting) {
                    atualizarLinkAtivo(entrada.target.id);
                }
            }
        }, {
            threshold: 0.45
        });

        for (var j = 0; j < secoes.length; j++) {
            observador.observe(secoes[j]);
        }
    }

    function atualizarLinkAtivo(idSecao) {
        for (var i = 0; i < linksNavegacao.length; i++) {
            var link = linksNavegacao[i];
            var destino = link.getAttribute('href');

            if (destino === '#' + idSecao) {
                link.classList.add('ativo');
            } else {
                link.classList.remove('ativo');
            }
        }
    }

    function iniciarFormularioContato() {
        var formulario = document.getElementById('formulario-contato');
        var mensagem = document.getElementById('mensagem-formulario');

        if (formulario === null || mensagem === null) {
            return;
        }

        formulario.addEventListener('submit', function (evento) {
            evento.preventDefault();

            var campos = formulario.querySelectorAll('input, select, textarea');
            var formularioValido = true;

            for (var i = 0; i < campos.length; i++) {
                var campo = campos[i];
                var valor = campo.value.trim();

                campo.classList.remove('campo-invalido');

                if (valor === '') {
                    campo.classList.add('campo-invalido');
                    formularioValido = false;
                }
            }

            if (!formularioValido) {
                mensagem.textContent = 'Preencha todos os campos antes de enviar.';
                mensagem.classList.remove('sucesso');
                return;
            }

            mensagem.textContent = 'Interesse registrado. O ClimaX entraria em contato com novos alertas.';
            mensagem.classList.add('sucesso');
            formulario.reset();
        });
    }

    function iniciarQuiz() {
        var perguntas = [
            {
                texto: 'Qual é o principal problema que o ClimaX quer resolver?',
                opcoes: ['Falta de redes sociais urbanas', 'Dados climáticos dispersos e difíceis de interpretar', 'Ausência de aplicativos de transporte'],
                correta: 1
            },
            {
                texto: 'O que o NDVI ajuda a analisar?',
                opcoes: ['Cobertura e saúde da vegetação', 'Velocidade dos ventos em aeroportos', 'Quantidade de carros por avenida'],
                correta: 0
            },
            {
                texto: 'Qual tecnologia pode complementar dados de satélite com leitura local?',
                opcoes: ['Sensores IoT', 'Cartazes impressos', 'Planilhas sem atualização'],
                correta: 0
            },
            {
                texto: 'O que significa usar um mapa de risco climático urbano?',
                opcoes: ['Escolher áreas por aparência', 'Visualizar regiões vulneráveis para priorizar ações', 'Remover todos os dados ambientais'],
                correta: 1
            },
            {
                texto: 'Qual fator aumenta ilhas de calor nas cidades?',
                opcoes: ['Mais concreto e menos vegetação', 'Mais parques e sombra', 'Mais áreas permeáveis'],
                correta: 0
            },
            {
                texto: 'Para quem o ClimaX pode apoiar decisões preventivas?',
                opcoes: ['Somente lojas privadas', 'Prefeituras, Defesa Civil e população', 'Apenas jogos online'],
                correta: 1
            },
            {
                texto: 'Qual é uma ação possível depois de identificar risco crítico?',
                opcoes: ['Ignorar o bairro', 'Priorizar drenagem, arborização ou alerta', 'Apagar o mapa'],
                correta: 1
            },
            {
                texto: 'Por que alertas simples ajudam a população?',
                opcoes: ['Porque transformam risco em orientação prática', 'Porque escondem o problema', 'Porque substituem qualquer ação pública'],
                correta: 0
            },
            {
                texto: 'O que o dashboard do ClimaX deve mostrar?',
                opcoes: ['Indicadores, mapa e recomendações', 'Somente o logotipo da equipe', 'Apenas textos longos sem dados'],
                correta: 0
            },
            {
                texto: 'Qual é a ideia central do ClimaX?',
                opcoes: ['Transformar dados ambientais em decisões inteligentes', 'Criar uma loja virtual', 'Trocar imagens por textos sem contexto'],
                correta: 0
            }
        ];

        var areaPerguntas = document.getElementById('quiz-perguntas');
        var formularioQuiz = document.getElementById('quiz-form');
        var mensagemQuiz = document.getElementById('mensagem-quiz');
        var resultadoQuiz = document.getElementById('resultado-quiz');
        var botaoReiniciar = document.getElementById('botao-reiniciar-quiz');

        if (areaPerguntas === null || formularioQuiz === null || mensagemQuiz === null || resultadoQuiz === null) {
            return;
        }

        montarQuiz(perguntas, areaPerguntas);

        formularioQuiz.addEventListener('submit', function (evento) {
            evento.preventDefault();
            corrigirQuiz(perguntas, formularioQuiz, mensagemQuiz, resultadoQuiz);
        });

        if (botaoReiniciar !== null) {
            botaoReiniciar.addEventListener('click', function () {
                formularioQuiz.reset();
                mensagemQuiz.textContent = '';
                mensagemQuiz.classList.remove('sucesso');
                resultadoQuiz.textContent = '';

                var blocos = formularioQuiz.querySelectorAll('.pergunta-quiz');

                for (var i = 0; i < blocos.length; i++) {
                    blocos[i].classList.remove('campo-invalido');
                }
            });
        }
    }

    function montarQuiz(perguntas, areaPerguntas) {
        areaPerguntas.innerHTML = '';

        for (var i = 0; i < perguntas.length; i++) {
            var pergunta = perguntas[i];
            var fieldset = document.createElement('fieldset');
            var legenda = document.createElement('legend');

            fieldset.className = 'pergunta-quiz';
            fieldset.setAttribute('data-question-index', String(i));
            legenda.textContent = (i + 1) + '. ' + pergunta.texto;
            fieldset.appendChild(legenda);

            for (var j = 0; j < pergunta.opcoes.length; j++) {
                var label = document.createElement('label');
                var input = document.createElement('input');
                var textoOpcao = document.createElement('span');

                label.className = 'opcao-quiz';
                input.type = 'radio';
                input.name = 'pergunta-' + i;
                input.value = String(j);
                textoOpcao.textContent = pergunta.opcoes[j];

                label.appendChild(input);
                label.appendChild(textoOpcao);
                fieldset.appendChild(label);
            }

            areaPerguntas.appendChild(fieldset);
        }
    }

    function corrigirQuiz(perguntas, formularioQuiz, mensagemQuiz, resultadoQuiz) {
        var pontuacao = 0;
        var respondeuTodas = true;
        var blocos = formularioQuiz.querySelectorAll('.pergunta-quiz');

        for (var i = 0; i < perguntas.length; i++) {
            var resposta = formularioQuiz.querySelector('input[name="pergunta-' + i + '"]:checked');

            blocos[i].classList.remove('campo-invalido');

            if (resposta === null) {
                respondeuTodas = false;
                blocos[i].classList.add('campo-invalido');
            } else if (Number(resposta.value) === perguntas[i].correta) {
                pontuacao++;
            }
        }

        if (!respondeuTodas) {
            mensagemQuiz.textContent = 'Responda todas as perguntas antes de ver o resultado.';
            mensagemQuiz.classList.remove('sucesso');
            resultadoQuiz.textContent = '';
            return;
        }

        mensagemQuiz.textContent = 'Quiz finalizado.';
        mensagemQuiz.classList.add('sucesso');
        resultadoQuiz.textContent = criarMensagemResultado(pontuacao, perguntas.length);
    }

    function criarMensagemResultado(pontuacao, total) {
        var mensagem = 'Você acertou ' + pontuacao + ' de ' + total + ' perguntas. ';

        if (pontuacao >= 8) {
            mensagem += 'Excelente leitura climática para apoiar cidades resilientes.';
        } else if (pontuacao >= 5) {
            mensagem += 'Bom resultado. Ainda dá para revisar alguns conceitos do ClimaX.';
        } else {
            mensagem += 'Vale revisar os conceitos de risco, NDVI, sensores e alertas.';
        }

        return mensagem;
    }

    iniciarMenuMobile();
    iniciarTemas();
    iniciarRolagem();
    iniciarCarrosseis();
    iniciarRevelacao();
    iniciarNavegacaoAtiva();
    iniciarFormularioContato();
    iniciarQuiz();
});
