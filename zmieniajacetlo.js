var ostatniIndex = -1;

function zmienTlo() {
    // Przykładowe kolory w formacie #RRGGBB
    var przykladoweKolory = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#34495e'];

    // Losowy indeks z tablicy kolorów (niech różni się od ostatnio użytego indeksu)
    var losowyIndex = Math.floor(Math.random() * (przykladoweKolory.length - 1));
    
    // Jeśli losowyIndex jest większy lub równy ostatniIndex, inkrementuj go
    if (losowyIndex >= ostatniIndex) {
        losowyIndex++;
    }

    // Zapisanie ostatnio użytego indeksu
    ostatniIndex = losowyIndex;

    // Wybrany kolor
    var wybranyKolor = przykladoweKolory[losowyIndex];

    // Ustawienie nowego koloru tła
    document.body.style.backgroundColor = wybranyKolor;
}