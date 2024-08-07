const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        const scoreElement = document.getElementById("score");
        const levelElement = document.getElementById("level");
        const abilityElement = document.getElementById("ability");
        const pauseButton = document.getElementById("pauseButton");

        // Ustawienia canvas na pełny ekran
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const player = {
            x: 50,
            y: canvas.height - 50,
            width: 40,
            height: 40,
            speed: 8,
            image: new Image(),
            color: "#3498db" // Kolor statek kosmiczny (backup)
        };

        player.image.src = "https://img.icons8.com/color/96/space-fighter.png"; // Link do ikony statku kosmicznego

        const bullets = [];
        let enemies = [];
        let score = 0;
        let level = 1;
        const baseEnemiesPerLevel = 4; // Bazowa liczba przeciwników na poziomie
        const enemiesIncreasePerLevel = 2; // Ilość przeciwników zwiększana na każdym poziomie
        const levelTransitionTime = 3000; // Czas trwania przerwy po przejściu poziomu (w milisekundach)
        const abilityUnlockLevel = 5; // Poziom, na którym gracz otrzymuje nową umiejętność
        const abilityUnlockLevel2 = 2; // Poziom, na którym gracz otrzymuje bombe
        let paused = false;

        // Gwiazdy
        const stars = [];
        const numStars = 100;

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                color: `rgba(255, 255, 255, ${Math.random()})`
            });
        }

        function drawStars() {
            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = star.color;
                ctx.fill();
            });
        }

        function drawPlayer() {
            ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
        }

        function drawBullet(bullet) {
            ctx.fillStyle = "#00ff00"; // Jaskrawo zielony kolor pocisku
            ctx.fillRect(bullet.x, bullet.y, 5, 10);
        }

        function drawEnemy(enemy) {
            const alienImage = new Image();
            alienImage.src = "https://img.icons8.com/emoji/96/alien-monster-emoji.png"; // Link do ikony przeciwnika
            ctx.drawImage(alienImage, enemy.x, enemy.y, 30, 30);
        }

        function clearCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        function update() {
            if (paused) {
                return;
            }

            clearCanvas();

            // Rysowanie gwiazd
            drawStars();

            drawPlayer();

            // Ruch pocisków
            bullets.forEach(bullet => {
                bullet.y -= 5;
                drawBullet(bullet);
            });

            // Ruch przeciwników
            enemies.forEach(enemy => {
                enemy.y += calculateEnemySpeed(level); // Spowolnienie opadania przeciwników
                drawEnemy(enemy);

                // Sprawdzenie kolizji z graczem
                if (
                    player.x < enemy.x + 30 &&
                    player.x + player.width > enemy.x &&
                    player.y < enemy.y + 30 &&
                    player.y + player.height > enemy.y
                ) {
                    // Kolizja z graczem - przegrana
                    handleGameOver();
                }
            });

            // Sprawdzenie przegranej
            if (enemies.some(enemy => enemy.y >= canvas.height)) {
                // Gracz przegrał - przegrana
                handleGameOver();
            }
        }

        function handleGameOver() {
            // Wyświetlenie alertu i ponowne załadowanie gry
            alert("Przegrałeś, twój wynik to: " + score + ". Kliknij: ok ,aby rozpocząć nową grę");
            location.reload();
        }

        function movePlayer(event) {
            player.x = event.clientX - canvas.getBoundingClientRect().left - player.width / 2;
            player.y = event.clientY - canvas.getBoundingClientRect().top - player.height / 2;
        }

        function shootBullet() {
            bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y });
        }

        function tripleShoot() {
            // Dodanie trzech pocisków
            bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y });
            bullets.push({ x: player.x + player.width / 2 - 2.5 - 20, y: player.y });
            bullets.push({ x: player.x + player.width / 2 - 2.5 + 20, y: player.y });
        }

        const bombs = [];
        function spaceBomb() {
    // Dodaj bombę do gry
    const bomb = {
        x: player.x + player.width / 2 - 5,
        y: player.y + player.height / 2 - 5,
        radius: 0,
        maxRadius: 100,
        explosionTime: 2000, // 2 sekundy
        explosionStartTime: null,
        exploded: false
    };

    // Dodaj bombę do tablicy bomby
    bombs.push(bomb);

    // Ustaw czas rozpoczęcia eksplozji
    bomb.explosionStartTime = Date.now();

    // Uruchom pętlę animacji bomby
    function bombLoop() {
        if (!bomb.exploded) {
            // Rysuj bombę i zwiększaj jej promień
            drawBomb(bomb);
            bomb.radius += (bomb.maxRadius / bomb.explosionTime) * (Date.now() - bomb.explosionStartTime);
        } else {
            // Eksplozja
            explode(bomb);
        }

        // Kontynuuj pętlę animacji
        if (!bomb.exploded) {
            requestAnimationFrame(bombLoop);
        }
    }

    bombLoop();
}

function drawBomb(bomb) {
    ctx.beginPath();
    ctx.arc(bomb.x, bomb.y, bomb.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
}

function explode(bomb) {
    // Sprawdź, czy czas eksplozji minął
    if (Date.now() - bomb.explosionStartTime >= bomb.explosionTime) {
        bomb.exploded = true;
    }

    // Rysuj eksplozję
    drawExplosion(bomb);
}

function drawExplosion(bomb) {
    const explosionRadius = bomb.radius;
    const numRays = 36;

    for (let i = 0; i < numRays; i++) {
        const angle = (Math.PI * 2 * i) / numRays;
        const endX = bomb.x + explosionRadius * Math.cos(angle);
        const endY = bomb.y + explosionRadius * Math.sin(angle);

        drawRay(bomb.x, bomb.y, endX, endY);
    }
}

function drawRay(startX, startY, endX, endY) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = "yellow";
    ctx.stroke();
}
        

        function calculateEnemySpeed(level) {
            // Obliczanie szybkości przeciwników
            const baseSpeed = 1;
            const speedIncrement = 0.2; // Inkrementacja szybkości co poziom

            return baseSpeed + (level - 5) * speedIncrement;
        }

        function spawnEnemies() {
            enemies = [];
            const totalEnemies = baseEnemiesPerLevel + (level - 1) * enemiesIncreasePerLevel;

            for (let i = 0; i < totalEnemies; i++) {
                const x = Math.random() * (canvas.width - 30);
                const y = -30 * i; // Rozłożenie przeciwników na różnych wysokościach
                enemies.push({ x, y });
            }
        }

        function startNextLevel() {
            level++;
            levelElement.textContent = "Poziom: " + level;

            // Sprawdzenie, czy osiągnięto poziom odblokowania umiejętności
            if (level === abilityUnlockLevel) {
                abilityElement.style.display = "block";
                setTimeout(() => {
                    abilityElement.style.display = "none";
                }, levelTransitionTime);
            }
            if (level === abilityUnlockLevel2) {
                abilityElement.style.display = "block";
                setTimeout(() => {
                    abilityElement.style.display = "none";
                }, levelTransitionTime);
            }

            setTimeout(() => {
                spawnEnemies();
            }, levelTransitionTime);
        }

        function togglePause() {
            paused = !paused;

            if (paused) {
                pauseButton.textContent = "Wznów";
            } else {
                pauseButton.textContent = "Pauza";
            }
        }

        function gameLoop() {
            update();

            // Sprawdzenie kolizji z przeciwnikami
            bullets.forEach(bullet => {
                enemies.forEach(enemy => {
                    if (
                        bullet.x < enemy.x + 30 &&
                        bullet.x + 5 > enemy.x &&
                        bullet.y < enemy.y + 30 &&
                        bullet.y + 10 > enemy.y
                    ) {
                        // Kolizja - usunięcie przeciwnika i pocisku
                        enemies.splice(enemies.indexOf(enemy), 1);
                        bullets.splice(bullets.indexOf(bullet), 1);

                        // Zwiększenie punktów po zestrzeleniu przeciwnika
                        score += 10;
                        scoreElement.textContent = "Punkty: " + score;

                        // Sprawdzenie, czy wszystkie przeciwniki zniszczone
                        if (enemies.length === 0) {
                            startNextLevel();
                        }
                    }
                });
            });

            // Dodawanie nowych przeciwników
            if (enemies.length === 0) {
                setTimeout(() => {
                    spawnEnemies();
                }, levelTransitionTime);
            }

            requestAnimationFrame(gameLoop);
        }

        // Nasłuchiwanie na ruch myszki
        window.addEventListener("mousemove", movePlayer);
        // Nasłuchiwanie na lewy przycisk myszki
        window.addEventListener("mousedown", shootBullet);
        // Nasłuchiwanie na przycisk spacji (umiejętność od 5 poziomu)
        window.addEventListener("keydown", function (event) {
            if (event.code === "Space" && level >= abilityUnlockLevel) {
                tripleShoot();
            }
        });
        window.addEventListener("keydown", function (event) {
    // Sprawdź, czy klawisz Ctrl jest wciśnięty
    if (event.code === "ControlLeft" || event.code === "ControlRight") {
        // Zatrzymaj domyślne zachowanie przeglądarki
        event.preventDefault();
        
        spaceBomb();
    }
});
        // Dodaj obsługę klawisza Esc dla pauzy
        window.addEventListener("keydown", function (event) {
            if (event.code === "Escape") {
                togglePause();
            }
        });

        // Rozpocznij pętlę gry
        spawnEnemies();
        gameLoop();