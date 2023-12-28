const plansza = document.getElementById("plansza");
let planszaSzerokosc = 20;
let planszaWysokosc = 20;
let waz = [{ x: 10, y: 10 }];
let kierunek = "right";
let jedzenie = { x: Math.floor(Math.random() * planszaSzerokosc), y: Math.floor(Math.random() * planszaWysokosc) };
let czyGraTrwa = true;

function rysujPlansze() {
    plansza.innerHTML = "";
    for (let i = 0; i < planszaSzerokosc; i++) {
        for (let j = 0; j < planszaWysokosc; j++) {
            const komorka = document.createElement("div");
            komorka.classList.add("komorka");
            plansza.appendChild(komorka);
        }
    }
}

function rysujWeza() {
    plansza.querySelectorAll(".waz").forEach(segment => segment.classList.remove("waz"));

    waz.forEach(segment => {
        const index = segment.x + segment.y * planszaSzerokosc;
        const komorka = plansza.children[index];
        komorka.classList.add("waz");
    });
}

function rysujJedzenie() {
    const index = jedzenie.x + jedzenie.y * planszaSzerokosc;
    const komorka = plansza.children[index];
    komorka.classList.add("jedzenie");
}

function aktualizujGre() {
    if (!czyGraTrwa) return;

    const nowaGlowa = {...waz[0]};

    switch (kierunek) {
        case "up":
            nowaGlowa.y--;
            break;
        case "down":
            nowaGlowa.y++;
            break;
        case "left":
            nowaGlowa.x--;
            break;
        case "right":
            nowaGlowa.x++;
            break;
    }

    // Sprawdź kolizję z krawędziami planszy
    if (nowaGlowa.x < 0 || nowaGlowa.x >= planszaSzerokosc || nowaGlowa.y < 0 || nowaGlowa.y >= planszaWysokosc) {
        koniecGry();
        return;
    }

    // Sprawdź kolizję z samym sobą
    if (waz.some(segment => segment.x === nowaGlowa.x && segment.y === nowaGlowa.y)) {
        koniecGry();
        return;
    }

    // Sprawdź, czy wąż zjadł jedzenie
    if (nowaGlowa.x === jedzenie.x && nowaGlowa.y === jedzenie.y) {
        waz.unshift(nowaGlowa); // Dodaj nową głowę do węża
        jedzenie = { x: Math.floor(Math.random() * planszaSzerokosc), y: Math.floor(Math.random() * planszaWysokosc) };
    } else {
        waz.pop(); // Usuń ostatni segment węża
        waz.unshift(nowaGlowa); // Dodaj nową głowę do węża
    }

    rysujPlansze();
    rysujWeza();
    rysujJedzenie();
}

function koniecGry() {
    czyGraTrwa = false;
    alert("Koniec gry! Twój wynik: " + waz.length);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "W" || event.key === "w" && kierunek !== "down") {
        kierunek = "up";
    } else if (event.key === "S" || event.key === "s" && kierunek !== "up") {
        kierunek = "down";
    } else if (event.key === "A" || event.key === "a" && kierunek !== "right") {
        kierunek = "left";
    } else if (event.key === "D" || event.key === "d" && kierunek !== "left") {
        kierunek = "right";
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && kierunek !== "down") {
        kierunek = "up";
    } else if (event.key === "ArrowDown" && kierunek !== "up") {
        kierunek = "down";
    } else if (event.key === "ArrowLeft" && kierunek !== "right") {
        kierunek = "left";
    } else if (event.key === "ArrowRight" && kierunek !== "left") {
        kierunek = "right";
    }
});

window.onload = function () {
    rysujPlansze();
    rysujWeza();
    rysujJedzenie();
    setInterval(aktualizujGre, 100);
};