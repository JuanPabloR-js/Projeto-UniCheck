const toast = document.getElementById('toast');
/**
 * Exibe uma mensagem de notificação (toast) na tela.
 * @param {string} msg - A mensagem a ser exibida.
 * @param {('success'|'error')} type - O tipo de mensagem (para definir a cor).
 */
function showToast(msg, type) {
    toast.textContent = msg;
    toast.className = 'toast show ' + type;
    // Remove a notificação após 3 segundos
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Lógica de virar o cartão (flip)
const container = document.getElementById('cardContainer');
let flipped = false;

/**
 * Alterna a classe 'flipped' no container para animar a rotação 3D dos cartões.
 */
function flipCard() {
    flipped = !flipped;
    container.classList.toggle('flipped');
}

// Lógica da barra de força da senha
const senhaInput = document.getElementById('senhaCadastro');
const strengthBar = document.getElementById('strength');

senhaInput.addEventListener('input', () => {
    const val = senhaInput.value;
    let strength = 0; // 5 níveis de força
    
    // Critérios de força:
    if (val.match(/[a-z]+/)) strength++;        // Letras minúsculas
    if (val.match(/[A-Z]+/)) strength++;        // Letras maiúsculas
    if (val.match(/[0-9]+/)) strength++;        // Números
    if (val.match(/[$@#&!]+/)) strength++;      // Caracteres especiais
    if (val.length >= 8) strength++;            // Mínimo de 8 caracteres

    const colors = ['#ff4d4d', '#ffa64d', '#ffff4d', '#a6ff4d', '#4dff88'];
    
    // Atualiza a largura e a cor da barra de força
    strengthBar.style.width = strength * 20 + '%';
    strengthBar.style.background = colors[strength - 1] || 'transparent';
});

// Funções de Ação (Login e Cadastro)
function fazerLogin() {
    // Simulação: Aqui você faria a chamada real à API de login
    showToast('Login realizado com sucesso!', 'success');
}

function registrar() {
    // Pega todos os campos de cadastro para validação
    const fields = [
        document.getElementById('nomeCadastro'),
        document.getElementById('emailCadastro'),
        document.getElementById('matriculaCadastro'),
        document.getElementById('nascimentoCadastro'),
        document.getElementById('senhaCadastro')
    ];

    let valid = true;
    
    // Itera sobre os campos para verificar se estão vazios
    fields.forEach(f => {
        if (!f.value) {
            f.classList.add('error'); // Adiciona borda vermelha
            valid = false;
        } else {
            f.classList.remove('error');
        }
    });

    if (!valid) {
        showToast('Preencha todos os campos corretamente!', 'error');
        return; // Para a função se houver campos vazios
    }
    
    // Simulação: Aqui você faria a chamada real à API de cadastro
    showToast('Cadastro realizado com sucesso!', 'success');
}


// --- CINEMATIC PARTICLES EM CANVAS ---

const canvas = document.getElementById('canvas');
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
        z: Math.random() * 500, // Profundidade para efeito 3D
        vx: (Math.random() - 0.5) * 0.3, // Velocidade X
        vy: (Math.random() - 0.5) * 0.3, // Velocidade Y
        radius: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.2
    });
}

// Inicializar 'fantasmas' (partículas de fundo mais suaves e lentas)
for (let i = 0; i < ghostCount; i++) {
    ghosts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vy: Math.random() * 0.15 + 0.03, // Velocidade de subida
        radius: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.08 + 0.03 // Baixa opacidade
    });
}

// Rastreamento do mouse para interatividade
canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

function draw() {
    // Efeito de "rastro" sutil (limpar com baixa opacidade)
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    
    // Efeito de rotação sutil no fundo para o movimento de nebulosa
    rotationAngle += 0.0002;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotationAngle);
    // Cria um rastro de cor escura sobre o fundo
    ctx.fillStyle = "rgba(15,32,39,0.2)"; 
    ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.restore();

    // 1. Desenho e Atualização das Partículas Principais
    particles.forEach((p, index) => {
        const speedFactor = 1 - p.z / 500; // Partículas mais distantes (maior Z) se movem mais devagar
        p.x += p.vx * speedFactor;
        p.y += p.vy * speedFactor;

        // Interação ao passar o mouse (Hover)
        let scale = 1;
        if (mouse.x && mouse.y) {
            const dx = p.x - mouse.x,
                dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
                // Afasta a partícula do mouse e aumenta seu tamanho (scale)
                p.x += dx / dist * 0.6;
                p.y += dy / dist * 0.6;
                scale = 1 + (mouse.radius - dist) / mouse.radius * 0.3;
            }
        }

        // Reposicionamento ao sair da tela (looping infinito)
        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;
        if (p.y < -50) p.y = canvas.height + 50;
        if (p.y > canvas.height + 50) p.y = -50;

        // Desenhar a partícula
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,217,245,${p.alpha * scale})`;
        ctx.fill();
        ctx.closePath();
    });

    // 2. Desenho e Atualização dos 'Fantasmas'
    ghosts.forEach(g => {
        g.y -= g.vy; // Move-se para cima
        if (g.y < -10) g.y = canvas.height + 10; // Reposiciona se sair da tela

        // Desenhar o fantasma
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${g.alpha})`;
        ctx.fill();
        ctx.closePath();
    });

    // 3. Linhas conectando partículas (efeito de rede/malha)
    glowOffset += 0.02;
    ctx.shadowBlur = 5; // Adiciona brilho (glow) às linhas
    ctx.shadowColor = "#3ad3c4ff";

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dz = particles[i].z - particles[j].z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz); // Distância 3D

            if (dist < 120) { // Conecta apenas se a distância for menor que 120px
                // Efeito de pulsação de brilho
                const glow = (Math.sin(dist / 10 + glowOffset) + 1) / 2; 

                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                // Opacidade baseada na distância (mais longe, menos visível) + pulsação
                const opacity = 0.5 * (1 - dist / 120) + glow * 0.2;
                ctx.strokeStyle = `rgba(0,217,245,${opacity})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
    
    ctx.shadowBlur = 0; // Desliga o brilho para os próximos desenhos
    requestAnimationFrame(draw); // Loop principal da animação
}

draw();