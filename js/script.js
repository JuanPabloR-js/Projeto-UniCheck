document.addEventListener("DOMContentLoaded", () => {
    // =====================================
    // ====== 1. Navbar hide/show (Existente) ======
    // =====================================
    const menu = document.querySelector(".menu");
    let lastScroll = 0;

    if (menu) {
        window.addEventListener("scroll", () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll <= 0) {
                menu.classList.remove("hide");
                return;
            }

            if (currentScroll > lastScroll) {
                menu.classList.add("hide");
            } else {
                menu.classList.remove("hide");
            }

            lastScroll = currentScroll;
        });
    }

    // =================================
    // ====== 2. Carousel (Existente) ======
    // =================================
    const container = document.querySelector(".carousel-grid-container");
    const btnPrev = document.querySelector(".prev-button");
    const btnNext = document.querySelector(".next-button");
    const cards = Array.from(document.querySelectorAll(".carousel-card"));

    if (container && cards.length > 0) {
        let currentIndex = 0;

        function getStep() {
            if (cards.length > 1) {
                const rect1 = cards[0].getBoundingClientRect();
                const rect2 = cards[1].getBoundingClientRect();
                return rect2.left - rect1.left;
            }
            return cards[0].offsetWidth;
        }

        function updateCarousel() {
            const step = getStep();
            // Calcula o índice máximo para que o último card esteja visível (ou quase)
            // Se você quiser que o carrossel pare no último card, ajuste o cálculo do maxIndex
            const maxIndex = cards.length - 1; 

            if (currentIndex < 0) currentIndex = 0;
            if (currentIndex > maxIndex) currentIndex = maxIndex;

            container.style.transition = "transform 0.4s ease";
            container.style.transform = `translateX(-${currentIndex * step}px)`;
        }

        if (btnNext) {
            btnNext.addEventListener("click", () => {
                currentIndex++;
                updateCarousel();
            });
        }
        if (btnPrev) {
            btnPrev.addEventListener("click", () => {
                currentIndex--;
                updateCarousel();
            });
        }

        window.addEventListener("resize", updateCarousel);
        updateCarousel();
    }

    // ===============================================
    // ====== 3. Contador de Crescimento Contínuo (Existente) ======
    // ===============================================
    const counters = document.querySelectorAll(".alunos-contador");
    const INTERVAL_TIME = 1200;

    counters.forEach(counter => {
        const initialTargetText = counter.textContent.replace(/\./g, '');
        let currentCount = parseInt(initialTargetText);
        if (isNaN(currentCount)) return;

        counter.textContent = currentCount.toLocaleString('pt-BR');

        setInterval(() => {
            const randomIncrement = Math.floor(Math.random() * 5) + 1;
            currentCount += randomIncrement;
            counter.textContent = currentCount.toLocaleString('pt-BR');
        }, INTERVAL_TIME);
    });

    // =====================================
    // ====== 4. FAQ Interativo (Existente) ======
    // =====================================
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");

        question.addEventListener("click", () => {
            const isActive = item.classList.contains("active");
            // Fecha todos os outros itens
            faqItems.forEach(i => i.classList.remove("active")); 
            // Abre o item clicado, se não estava ativo
            if (!isActive) item.classList.add("active"); 
        });
    });

    // ==============================================
    // ====== 5. Lógica de Login/Cadastro (Original) ======
    // ==============================================

    // Funções básicas (necessário definir dentro do escopo do DOMContentLoaded)
    window.voltar = function() {
        window.location.href = 'index.html';
    };
    
    const toast = document.getElementById('toast');
    window.showToast = function(msg, type) {
        if (!toast) return; // Garante que a div toast existe
        toast.textContent = msg;
        toast.className = 'toast show ' + type;
        setTimeout(() => toast.classList.remove('show'), 3000);
    };

    const containerCard = document.getElementById('cardContainer');
    let flipped = false;
    window.flipCard = function() {
        if (!containerCard) return; // Garante que o container existe
        flipped = !flipped;
        containerCard.classList.toggle('flipped');
    };

    // Lógica da barra de força da senha
    const senhaInput = document.getElementById('senhaCadastro');
    const strengthBar = document.getElementById('strength');

    if (senhaInput && strengthBar) {
        senhaInput.addEventListener('input', () => {
            const val = senhaInput.value;
            let strength = 0;
            if (val.match(/[a-z]+/)) strength++;
            if (val.match(/[A-Z]+/)) strength++;
            if (val.match(/[0-9]+/)) strength++;
            if (val.match(/[$@#&!]+/)) strength++;
            if (val.length >= 8) strength++;
            const colors = ['#ff4d4d', '#ffa64d', '#ffff4d', '#a6ff4d', '#4dff88'];
            strengthBar.style.width = strength * 20 + '%';
            strengthBar.style.background = colors[strength - 1] || 'transparent';
        });
    }

    // Funções de Ação (Login e Cadastro)
    window.fazerLogin = function() {
        showToast('Login realizado com sucesso!', 'success');
    };
    
    window.registrar = function() {
        const fields = [
            document.getElementById('nomeCadastro'),
            document.getElementById('emailCadastro'),
            document.getElementById('sexoCadastro'),
            document.getElementById('nascimentoCadastro'),
            document.getElementById('senhaCadastro')
        ];
        let valid = true;
        
        fields.forEach(f => {
            if (f) { // Verifica se o campo existe
                if (!f.value) {
                    f.classList.add('error');
                    valid = false;
                } else {
                    f.classList.remove('error');
                }
            }
        });
        
        if (!valid) {
            showToast('Preencha todos os campos corretamente!', 'error');
            return;
        }
        showToast('Cadastro realizado com sucesso!', 'success');
    };

    // ==============================================
    // ====== 6. CINEMATIC PARTICLES EM CANVAS (Original) ======
    // ==============================================

    const canvas = document.getElementById('canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [],
            ghosts = [];
        const particleCount = 120,
            ghostCount = 80;
        const mouse = {
            x: null,
            y: null,
            radius: 120
        };
        let glowOffset = 0,
            rotationAngle = 0;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Inicializar partículas
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                z: Math.random() * 500,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 3 + 1,
                alpha: Math.random() * 0.5 + 0.2
            });
        }
        for (let i = 0; i < ghostCount; i++) {
            ghosts.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vy: Math.random() * 0.15 + 0.03,
                radius: Math.random() * 1.2 + 0.3,
                alpha: Math.random() * 0.08 + 0.03
            });
        }

        canvas.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            rotationAngle += 0.0002;
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(rotationAngle);
            ctx.fillStyle = "rgba(15,32,39,0.2)";
            ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
            ctx.restore();

            // Partículas
            particles.forEach((p, index) => {
                const speedFactor = 1 - p.z / 500;
                p.x += p.vx * speedFactor;
                p.y += p.vy * speedFactor;

                // Hover
                let scale = 1;
                if (mouse.x && mouse.y) {
                    const dx = p.x - mouse.x,
                        dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        p.x += dx / dist * 0.6;
                        p.y += dy / dist * 0.6;
                        scale = 1 + (mouse.radius - dist) / mouse.radius * 0.3;
                    }
                }

                // Reaparecer suavemente
                if (p.x < -50) p.x = canvas.width + 50;
                if (p.x > canvas.width + 50) p.x = -50;
                if (p.y < -50) p.y = canvas.height + 50;
                if (p.y > canvas.height + 50) p.y = -50;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * scale, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,217,245,${p.alpha * scale})`;
                ctx.fill();
                ctx.closePath();
            });

            // Fantasmas
            ghosts.forEach(g => {
                g.y -= g.vy;
                if (g.y < -10) g.y = canvas.height + 10;
                ctx.beginPath();
                ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${g.alpha})`;
                ctx.fill();
                ctx.closePath();
            });

            // Linhas conectando partículas
            glowOffset += 0.02;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dz = particles[i].z - particles[j].z;
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    if (dist < 120) {
                        const glow = (Math.sin(dist / 10 + glowOffset) + 1) / 2;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0,217,245,${0.5 * (1 - dist / 120) + glow * 0.2})`;
                        ctx.lineWidth = 1.5;
                        ctx.shadowBlur = 5;
                        ctx.shadowColor = "#00d9f5";
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
            ctx.shadowBlur = 0;
            requestAnimationFrame(draw);
        }
        draw();
    } // Fim do if (canvas)
});

// ==========================================================
// ====== 7. CORREÇÃO FORÇADA DE OVERFLOW-Y VIA JAVASCRIPT ======
// ==========================================================
// Este código garante que as barras de rolagem verticais não sejam ocultadas por CSS
// que possa estar sendo aplicado incorretamente ou em conflito.

function fixOverflowY() {
    console.log("Forçando overflow-y: auto para correção de rolagem.");

    // 1. Remove overflow-y do BODY e HTML (onde a barra da página inteira se aninha)
    document.body.style.overflowY = 'auto';
    document.documentElement.style.overflowY = 'auto';
    
    // CORREÇÃO ADICIONAL: Remove a regra 'overflow: hidden' do body se estiver presente.
    // (Esta regra pode estar no CSS do Login/Cadastro se você usar o mesmo arquivo.)
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';

    // 2. Garante que o contêiner do carrossel NÃO gere scroll VERTICAL, 
    // mas mantenha o scroll HORIZONTAL oculto.
    const carouselWrapper = document.querySelector(".carousel-wrapper");
    if (carouselWrapper) {
        // Garantimos que o overflow horizontal permaneça oculto
        carouselWrapper.style.overflowX = 'hidden'; 
        // E permitimos qualquer overflow vertical (se houver, o que é raro aqui)
        carouselWrapper.style.overflowY = 'auto'; 
    }
}

// Chama a função assim que o DOM estiver carregado
fixOverflowY(); 
// Opcional: Chama novamente em caso de redimensionamento da tela (pode ajudar com bugs de renderização)
window.addEventListener('resize', fixOverflowY);

// Se você estiver usando o código do login/cadastro, o 'body' também tinha 'overflow: hidden',
// o que pode ser a origem do problema. Este JS resolve isso de forma global.
// ... Seu código JS existente (Navbar, Carousel, FAQ, etc.) ...
    
    // ==========================================================
    // ====== 8. ANIMAÇÕES DE ENTRADA CONFORME SCROLL (Intersection Observer) ======
    // ==========================================================

    // 1. Configuração do Observer
    // Quando o elemento estiver 15% visível na tela, aciona o callback.
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // 15% visível
    };

    /**
     * Callback que é executado quando a visibilidade de um elemento muda.
     * @param {IntersectionObserverEntry[]} entries 
     */
    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Se o elemento entrou na viewport, adiciona a classe 'animated'
                entry.target.classList.add('animated');
                // Para de observar o elemento após a animação
                observer.unobserve(entry.target); 
            }
        });
    }

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    // 2. Seleção dos Elementos para Animar
    
    // Crie um Array de seletores para todos os elementos que você quer animar.
    const selectorsToAnimate = [
        // Seções principais (slide-up)
        '.intro-text-content h2',
        '.intro-text-content p',
        '.intro-content2 h2',
        '.intro-content2 p',
        '.resumo-text-content h2',
        '.resumo-text-content p',
        '.faq-left h2',
        '.faq-right',
        '.main-faculdade',

        // Botões (fade-in)
        '.botao',
        '.botao2',
        

        
        // Imagens (zoom ou fade-in)
        '.intro-img img',
        '.intro-img2 img',
        '.resumo-img img',
        
        // Itens específicos (Universidades e FAQ)
        '.info-box h2',
        '.imagens-li li',
        '.formulario-faq'
    ];
    
    // 3. Aplica a classe inicial e inicia a observação
    selectorsToAnimate.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            // Adiciona a classe base para o JS observar
            element.classList.add('animate-on-scroll'); 
            
            // Adiciona a classe de tipo de animação
            if (selector.includes('img')) {
                 element.classList.add('image-zoom'); // Exemplo de animação para imagem
            } else if (selector.includes('h2') || selector.includes('.faq-right') || selector.includes('.main-faculdade')) {
                element.classList.add('slide-up'); // Para blocos maiores
            } else {
                element.classList.add('fade-in'); // Padrão
            }
            
            // Inicia a observação
            observer.observe(element);
        });
    });

    // ... O restante do seu código JS ...