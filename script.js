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

    iniciarMenuMobile();
    iniciarTemas();
    iniciarRolagem();
    iniciarCarrosseis();
    iniciarRevelacao();
    iniciarNavegacaoAtiva();
});
