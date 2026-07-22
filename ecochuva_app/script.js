document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa o banco de dados local para contas salvas
    if (!localStorage.getItem('ecoUsers_database')) {
        const defaultDB = { "admin": "admin123" };
        localStorage.setItem('ecoUsers_database', JSON.stringify(defaultDB));
    }

    // Inicializa o banco de dados local para as avaliações por estrelas
    if (!localStorage.getItem('ecoRatings_database')) {
        localStorage.setItem('ecoRatings_database', JSON.stringify([]));
    }

    function getUsersDatabase() {
        return JSON.parse(localStorage.getItem('ecoUsers_database')) || {};
    }

    function saveUsersDatabase(data) {
        localStorage.setItem('ecoUsers_database', JSON.stringify(data));
    }

    function getRatingsDatabase() {
        return JSON.parse(localStorage.getItem('ecoRatings_database')) || [];
    }

    function saveRatingsDatabase(data) {
        localStorage.setItem('ecoRatings_database', JSON.stringify(data));
    }

    // 2. Lógica do Olhinho (Mostrar/Ocultar Senha)
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                button.innerText = '🙈'; // Muda ícone para olho coberto
            } else {
                passwordInput.type = 'password';
                button.innerText = '👁️'; // Volta ícone original
            }
        });
    });

    // 3. Seleção de elementos da página
    const authScreen = document.getElementById('auth-screen');
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');
    const resetBox = document.getElementById('reset-box');

    const goToRegister = document.getElementById('go-to-register');
    const goToLoginFromReg = document.getElementById('go-to-login-from-reg');
    const goToReset = document.getElementById('go-to-reset');
    const goToLoginFromReset = document.getElementById('go-to-login-from-reset');

    const mainScreen = document.getElementById('main-screen');
    const projectScreen = document.getElementById('project-screen');
    const welcomeMessage = document.getElementById('welcome-message');

    // 4. Alternância de Telas
    goToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginBox.classList.add('hidden');
        resetBox.classList.add('hidden');
        registerBox.classList.remove('hidden');
    });

    goToLoginFromReg.addEventListener('click', (e) => {
        e.preventDefault();
        registerBox.classList.add('hidden');
        resetBox.classList.add('hidden');
        loginBox.classList.remove('hidden');
    });

    goToReset.addEventListener('click', (e) => {
        e.preventDefault();
        loginBox.classList.add('hidden');
        registerBox.classList.add('hidden');
        resetBox.classList.remove('hidden');
    });

    goToLoginFromReset.addEventListener('click', (e) => {
        e.preventDefault();
        resetBox.classList.add('hidden');
        registerBox.classList.add('hidden');
        loginBox.classList.remove('hidden');
    });

    // 5. Cadastro de Novo Usuário
    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('reg-username').value.trim();
        const pass = document.getElementById('reg-password').value;

        if (user.length < 3 || pass.length < 4) {
            alert("O usuário precisa ter pelo menos 3 caracteres e a senha pelo menos 4!");
            return;
        }

        const usersDB = getUsersDatabase();

        if (usersDB[user]) {
            alert("Este nome de usuário já está cadastrado! Escolha outro.");
            return;
        }

        usersDB[user] = pass;
        saveUsersDatabase(usersDB);

        alert("Conta criada com sucesso! Faça seu login.");
        document.getElementById('register-form').reset();
        
        registerBox.classList.add('hidden');
        loginBox.classList.remove('hidden');
    });

    // 6. Redefinição / Mudança de Senha
    document.getElementById('reset-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('reset-username').value.trim();
        const newPass = document.getElementById('reset-new-password').value;

        if (newPass.length < 4) {
            alert("A nova senha precisa ter pelo menos 4 caracteres!");
            return;
        }

        const usersDB = getUsersDatabase();

        if (!usersDB[user]) {
            alert("Usuário não encontrado! Verifique se digitou corretamente.");
            return;
        }

        usersDB[user] = newPass;
        saveUsersDatabase(usersDB);

        alert("Senha redefinida com sucesso! Agora faça seu login.");
        document.getElementById('reset-form').reset();

        resetBox.classList.add('hidden');
        loginBox.classList.remove('hidden');
    });

    // 7. Login de Usuário
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('login-username').value.trim();
        const pass = document.getElementById('login-password').value;

        const usersDB = getUsersDatabase();

        if (usersDB[user] && usersDB[user] === pass) {
            welcomeMessage.innerText = `Bem-vindo de volta, ${user}! 🌱`;
            authScreen.classList.add('hidden');
            mainScreen.classList.remove('hidden');
            document.getElementById('login-form').reset();
        } else {
            alert("Usuário ou senha incorretos!");
        }
    });

    // 8. Logout
    document.getElementById('btn-logout').addEventListener('click', () => {
        mainScreen.classList.add('hidden');
        authScreen.classList.remove('hidden');
    });

    // 9. Cálculos do Simulador
    document.getElementById('calc-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const width = parseFloat(document.getElementById('house-width').value);
        const length = parseFloat(document.getElementById('house-length').value);
        const rainIntensity = parseFloat(document.getElementById('rain-intensity').value);
        const rainDuration = parseFloat(document.getElementById('rain-duration').value);
        const tankCapacity = parseFloat(document.getElementById('tank-capacity').value);
        const tankUnit = document.getElementById('tank-unit').value;

        const roofArea = width * length;

        let capacityInLiters = tankCapacity;
        if (tankUnit === 'mL') {
            capacityInLiters = tankCapacity / 1000;
        }

        const litersPerHour = roofArea * rainIntensity;
        const totalCollected = litersPerHour * rainDuration;

        const hoursToFillFull = capacityInLiters / litersPerHour;
        let fillTimeDisplay = "";
        if (hoursToFillFull < 1) {
            fillTimeDisplay = `${Math.round(hoursToFillFull * 60)} minuto(s)`;
        } else {
            const h = Math.floor(hoursToFillFull);
            const m = Math.round((hoursToFillFull - h) * 60);
            fillTimeDisplay = m > 0 ? `${h}h e ${m}min` : `${h} hora(s)`;
        }

        let fillPercentage = (totalCollected / capacityInLiters) * 100;
        if (fillPercentage > 100) fillPercentage = 100;

        const resultTextContainer = document.getElementById('result-text');
        resultTextContainer.innerHTML = `
            <p>📐 <strong>Dados do Telhado:</strong> Projeção de captação de ${width}m (Largura) × ${length}m (Comprimento). Área total útil: <strong>${roofArea.toFixed(1)} m²</strong>.</p>
            <p>🌧️ <strong>Potencial do Sistema:</strong> Coleta de até <strong>${litersPerHour.toFixed(1)} Litros por hora</strong> sob chuva constante de ${rainIntensity} mm/h.</p>
            <p>⏱️ <strong>Período Analisado:</strong> Com uma duração de <strong>${rainDuration}h</strong> de chuva, estima-se captar <strong>${totalCollected.toFixed(1)} Litros</strong> de água limpa.</p>
            <p>📊 <strong>Eficiência:</strong> O seu reservatório atinge <strong>${fillPercentage.toFixed(1)}%</strong> da sua capacidade total. Ele precisaria de um total de <strong>${fillTimeDisplay}</strong> de chuva para ser preenchido de forma integral.</p>
        `;

        mainScreen.classList.add('hidden');
        projectScreen.classList.remove('hidden');

        updateRatingUI();

        const waterLevel = document.getElementById('water-level');
        const waterPercentageLabel = document.getElementById('water-percentage-label');
        
        waterLevel.style.height = '0%';
        waterPercentageLabel.innerText = '0%';

        setTimeout(() => {
            waterLevel.style.height = `${fillPercentage}%`;
            waterPercentageLabel.innerText = `${fillPercentage.toFixed(0)}%`;
        }, 80);
    });

    // 10. Atualização visual e estatísticas das estrelas salvas
    function updateRatingUI() {
        const ratings = getRatingsDatabase();
        const totalCount = ratings.length;
        const avgDisplay = document.getElementById('avg-rating');
        const totalDisplay = document.getElementById('total-ratings');

        if (totalCount === 0) {
            avgDisplay.innerText = "0.0";
            totalDisplay.innerText = "0";
            return;
        }

        const sum = ratings.reduce((acc, curr) => acc + curr, 0);
        const average = (sum / totalCount).toFixed(1);

        avgDisplay.innerText = average;
        totalDisplay.innerText = totalCount;
    }

    // 11. Sistema de Avaliação por Estrelas
    const stars = document.querySelectorAll('#star-rating span');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = parseInt(this.getAttribute('data-value'));
            
            stars.forEach(s => {
                if (parseInt(s.getAttribute('data-value')) <= value) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });

            const ratings = getRatingsDatabase();
            ratings.push(value);
            saveRatingsDatabase(ratings);

            updateRatingUI();

            document.getElementById('rating-message').style.display = 'block';
        });
    });

    // 12. Botão Voltar ao Simulador
    document.getElementById('btn-back').addEventListener('click', () => {
        stars.forEach(s => s.classList.remove('active'));
        document.getElementById('rating-message').style.display = 'none';

        projectScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');
    });
});document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o banco de dados de contas se ele não existir no navegador
    if (!localStorage.getItem('ecoUsers_database')) {
        // Criando uma conta padrão (admin / admin123)
        const defaultDB = { "admin": "admin123" };
        localStorage.setItem('ecoUsers_database', JSON.stringify(defaultDB));
    }

    // Seleção de telas e painéis
    const authScreen = document.getElementById('auth-screen');
    const loginBox = document.getElementById('login-box');
    const registerBox = document.getElementById('register-box');
    const goToRegister = document.getElementById('go-to-register');
    const goToLogin = document.getElementById('go-to-login');

    const mainScreen = document.getElementById('main-screen');
    const projectScreen = document.getElementById('project-screen');
    const welcomeMessage = document.getElementById('welcome-message');

    // Troca de telas dentro da Área de Login/Cadastro
    goToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginBox.classList.add('hidden');
        registerBox.classList.remove('hidden');
    });

    goToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerBox.classList.add('hidden');
        loginBox.classList.remove('hidden');
    });

    // Cadastro de novas contas (Salva de verdade no armazenamento persistente)
    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('reg-username').value.trim();
        const pass = document.getElementById('reg-password').value;

        if (user.length < 3 || pass.length < 4) {
            alert("O Usuário precisa de 3 letras e a senha de no mínimo 4 caracteres!");
            return;
        }

        // Obtém banco de dados atualizado do navegador
        let usersDB = JSON.parse(localStorage.getItem('ecoUsers_database'));

        if (usersDB[user]) {
            alert("Este nome de usuário já está cadastrado! Escolha outro.");
            return;
        }

        // Adiciona e persiste o novo usuário de forma definitiva
        usersDB[user] = pass;
        localStorage.setItem('ecoUsers_database', JSON.stringify(usersDB));

        alert("Conta criada com sucesso! Faça seu login.");
        document.getElementById('register-form').reset();
        registerBox.classList.add('hidden');
        loginBox.classList.remove('hidden');
    });

    // Login com validação no banco persistente
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('login-username').value.trim();
        const pass = document.getElementById('login-password').value;

        let usersDB = JSON.parse(localStorage.getItem('ecoUsers_database'));

        if (usersDB[user] && usersDB[user] === pass) {
            welcomeMessage.innerText = `Bem-vindo de volta, ${user}! 🌱`;
            authScreen.classList.add('hidden');
            mainScreen.classList.remove('hidden');
            document.getElementById('login-form').reset();
        } else {
            alert("Usuário ou senha incorretos!");
        }
    });

    // Logout
    document.getElementById('btn-logout').addEventListener('click', () => {
        mainScreen.classList.add('hidden');
        authScreen.classList.remove('hidden');
    });

    // Cálculos do Simulador (Profundidade Removida)
    document.getElementById('calc-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const width = parseFloat(document.getElementById('house-width').value);
        const length = parseFloat(document.getElementById('house-length').value);
        const rainIntensity = parseFloat(document.getElementById('rain-intensity').value);
        const rainDuration = parseFloat(document.getElementById('rain-duration').value);
        const tankCapacity = parseFloat(document.getElementById('tank-capacity').value);
        const tankUnit = document.getElementById('tank-unit').value;

        // Área plana de projeção do telhado
        const roofArea = width * length;

        let capacityInLiters = tankCapacity;
        if (tankUnit === 'mL') {
            capacityInLiters = tankCapacity / 1000;
        }

        // Volume de captação
        const litersPerHour = roofArea * rainIntensity;
        const totalCollected = litersPerHour * rainDuration;

        // Tempo estimado para enchimento
        const hoursToFillFull = capacityInLiters / litersPerHour;
        let fillTimeDisplay = "";
        if (hoursToFillFull < 1) {
            fillTimeDisplay = `${Math.round(hoursToFillFull * 60)} minuto(s)`;
        } else {
            const h = Math.floor(hoursToFillFull);
            const m = Math.round((hoursToFillFull - h) * 60);
            fillTimeDisplay = m > 0 ? `${h}h e ${m}min` : `${h} hora(s)`;
        }

        // Porcentagem final acumulada
        let fillPercentage = (totalCollected / capacityInLiters) * 100;
        if (fillPercentage > 100) fillPercentage = 100;

        // Renderização dos Resultados
        const resultTextContainer = document.getElementById('result-text');
        resultTextContainer.innerHTML = `
            <p>📐 <strong>Dados do Telhado:</strong> Projeção de captação de ${width}m (Largura) × ${length}m (Comprimento). Área total útil: <strong>${roofArea.toFixed(1)} m²</strong>.</p>
            <p>🌧️ <strong>Potencial do Sistema:</strong> Coleta de até <strong>${litersPerHour.toFixed(1)} Litros por hora</strong> sob chuva constante de ${rainIntensity} mm/h.</p>
            <p>⏱️ <strong>Período Analisado:</strong> Com uma duração de <strong>${rainDuration}h</strong> de chuva, estima-se captar <strong>${totalCollected.toFixed(1)} Litros</strong> de água limpa.</p>
            <p>📊 <strong>Eficiência:</strong> O seu reservatório atinge <strong>${fillPercentage.toFixed(1)}%</strong> da sua capacidade total. Ele precisaria de um total de <strong>${fillTimeDisplay}</strong> de chuva para ser preenchido de forma integral.</p>
        `;

        mainScreen.classList.add('hidden');
        projectScreen.classList.remove('hidden');

        // Animação dinâmica do nível de água
        const waterLevel = document.getElementById('water-level');
        const waterPercentageLabel = document.getElementById('water-percentage-label');
        
        waterLevel.style.height = '0%';
        waterPercentageLabel.innerText = '0%';

        setTimeout(() => {
            waterLevel.style.height = `${fillPercentage}%`;
            waterPercentageLabel.innerText = `${fillPercentage.toFixed(0)}%`;
        }, 80);
    });

    // Avaliação por Estrelas
    const stars = document.querySelectorAll('#star-rating span');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = parseInt(this.getAttribute('data-value'));
            
            stars.forEach(s => {
                if (parseInt(s.getAttribute('data-value')) <= value) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });

            document.getElementById('rating-message').style.display = 'block';
        });
    });

    // Botão Voltar
    document.getElementById('btn-back').addEventListener('click', () => {
        stars.forEach(s => s.classList.remove('active'));
        document.getElementById('rating-message').style.display = 'none';

        projectScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');
    });
});
