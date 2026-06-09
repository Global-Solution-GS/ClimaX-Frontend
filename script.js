document.addEventListener('DOMContentLoaded', () => {
    const barraNavegacao = document.getElementById('barra-navegacao');
    const botaoMenu = document.getElementById('botao-menu');
    const painelMenu = document.getElementById('painel-menu');
    const linksMenu = document.querySelectorAll('.atalho-menu');
    const linksNavegacao = document.querySelectorAll('.atalho-navegacao');

    // Menu mobile
    const fecharMenu = () => {
        if (!botaoMenu || !painelMenu) return;
        botaoMenu.setAttribute('aria-expanded', 'false');
        botaoMenu.classList.remove('ativo');
        painelMenu.classList.remove('ativo');
        document.body.classList.remove('menu-aberto');
    };

    if (botaoMenu && painelMenu) {
        botaoMenu.addEventListener('click', () => {
            const menuAberto = botaoMenu.getAttribute('aria-expanded') === 'true';
            botaoMenu.setAttribute('aria-expanded', String(!menuAberto));
            botaoMenu.classList.toggle('ativo');
            painelMenu.classList.toggle('ativo');
            document.body.classList.toggle('menu-aberto', !menuAberto);
        });

        linksMenu.forEach((link) => link.addEventListener('click', fecharMenu));
        document.addEventListener('keydown', (evento) => {
            if (evento.key === 'Escape') fecharMenu();
        });
    }

    // Rolagem da página
    const atualizarBarraRolada = () => {
        if (!barraNavegacao) return;
        barraNavegacao.classList.toggle('rolada', window.scrollY > 24);
    };

    atualizarBarraRolada();
    window.addEventListener('scroll', atualizarBarraRolada, { passive: true });

    const botaoRolar = document.getElementById('botao-rolar');
    if (botaoRolar) {
        botaoRolar.addEventListener('click', () => {
            document.getElementById('problema')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Carrosséis
    function iniciarCarrosseis() {
        const carrosseis = document.querySelectorAll('[data-carousel]');

        carrosseis.forEach((carrossel) => {
            const quadros = Array.from(carrossel.querySelectorAll('.quadro-camada, .quadro-imagem'));
            const anterior = carrossel.querySelector('[data-carousel-prev]');
            const proximo = carrossel.querySelector('[data-carousel-next]');
            const areaPontos = carrossel.querySelector('.pontos-carrossel');
            const visor = carrossel.querySelector('.visor-carrossel');
            let indiceAtivo = 0;
            let temporizador = null;

            if (!quadros.length || !areaPontos) return;

            const pontos = quadros.map((_, indice) => {
                const ponto = document.createElement('button');
                ponto.type = 'button';
                ponto.setAttribute('aria-label', `Ir para quadro ${indice + 1}`);
                ponto.addEventListener('click', () => irPara(indice));
                areaPontos.appendChild(ponto);
                return ponto;
            });

            const atualizar = () => {
                quadros.forEach((quadro, indice) => {
                    quadro.classList.toggle('ativo', indice === indiceAtivo);
                    quadro.setAttribute('aria-hidden', String(indice !== indiceAtivo));
                });
                pontos.forEach((ponto, indice) => {
                    ponto.classList.toggle('ativo', indice === indiceAtivo);
                    ponto.setAttribute('aria-current', indice === indiceAtivo ? 'true' : 'false');
                });
            };

            const irPara = (indice) => {
                indiceAtivo = (indice + quadros.length) % quadros.length;
                atualizar();
            };

            const parar = () => {
                if (temporizador) window.clearInterval(temporizador);
                temporizador = null;
            };

            const iniciar = () => {
                parar();
                temporizador = window.setInterval(() => irPara(indiceAtivo + 1), 5200);
            };

            anterior?.addEventListener('click', () => irPara(indiceAtivo - 1));
            proximo?.addEventListener('click', () => irPara(indiceAtivo + 1));

            carrossel.addEventListener('mouseenter', parar);
            carrossel.addEventListener('mouseleave', iniciar);
            carrossel.addEventListener('focusin', parar);
            carrossel.addEventListener('focusout', iniciar);

            visor?.addEventListener('keydown', (evento) => {
                if (evento.key === 'ArrowLeft') {
                    evento.preventDefault();
                    irPara(indiceAtivo - 1);
                }
                if (evento.key === 'ArrowRight') {
                    evento.preventDefault();
                    irPara(indiceAtivo + 1);
                }
            });

            atualizar();
            iniciar();
        });
    }

    // Entrada visual das seções
    function iniciarRevelacao() {
        const elementos = document.querySelectorAll('.revelar');

        if (!('IntersectionObserver' in window)) {
            elementos.forEach((elemento) => elemento.classList.add('revelado'));
            return;
        }

        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('revelado');
                    observador.unobserve(entrada.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        elementos.forEach((elemento) => observador.observe(elemento));
    }

    function iniciarNavegacaoAtiva() {
        const secoes = Array.from(document.querySelectorAll('main [id]'));
        if (!secoes.length || !linksNavegacao.length || !('IntersectionObserver' in window)) return;

        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach((entrada) => {
                if (!entrada.isIntersecting) return;
                linksNavegacao.forEach((link) => {
                    link.classList.toggle('ativo', link.getAttribute('href') === `#${entrada.target.id}`);
                });
            });
        }, {
            threshold: 0.45
        });

        secoes.forEach((secao) => observador.observe(secao));
    }

    iniciarCarrosseis();
    iniciarRevelacao();
    iniciarNavegacaoAtiva();
});
