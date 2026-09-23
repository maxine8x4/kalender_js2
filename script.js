// on datum änderung: titelupdate, infotexte, oncalendargrid, api, feiertage
// updatepage: bekommt neues datum

let aktuellesDatum = new Date();

//  0   1   2   3   4   5   6   7   8   9  10   11         
const tageImMonat = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const nummern = ['', 'erste', 'zweite', 'dritte', 'vierte', 'fünfte'];

function updateCalendar(neuesDatum) {
        aktuellesDatum = neuesDatum;

        neuerTitel(aktuellesDatum)
        neueInfo(aktuellesDatum)
        generateCalendarGrid(aktuellesDatum)
        feiertage(aktuellesDatum)
        neueEreignisse(aktuellesDatum)
}

function berechneTageImMonat(datum) {

        let anzahlTageImMonat = tageImMonat[datum.getMonth()];
        if (datum.getMonth() === 1 && istSchaltjahr(year)) {
                anzahlTageImMonat++;
        }
        return anzahlTageImMonat
}

function berechneTageSeitJahresbeginn(date) {
        let days = 0;
        for (let monthNo = 0; monthNo < date.getMonth(); monthNo++) {
                days += tageImMonat[monthNo];
        }
        days += date.getDate(); // days = days + date.date;
        // days += istSchaltjahr(date.year) ? 1 : 0
        if (istSchaltjahr(date.getFullYear()) && date.getMonth() > 1) {
                days++;
        }
        return days;
}
function berechneVerbleibendeTage(datum) {
        let tageImJahr = 365
        if (istSchaltjahr(datum.getFullYear())) {
                tageImJahr = 366
        }
        let verbleibendeTage = tageImJahr - berechneTageSeitJahresbeginn(datum)
        return verbleibendeTage
}


// Berechnung Schaltjahr
function istSchaltjahr(jahr) {
        if (jahr % 400 == 0) {
                return true;
        }
        if (jahr % 4 == 0 && jahr % 100 != 0) {
                return true;
        }
        return false;
}

// const verbleibendeTage = Math.ceil(unterschiedEnde / (1000 * 60 * 60 * 24));     // Berechnung der verbleibenden Tage bis zum Jahresende
function neuerTitel(datum) {

        const datumText = datum.toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "long",
                year: "numeric"
        });

        const titel = document.getElementById("titel")
        titel.textContent = "Kalenderblatt vom " + datumText
        document.title = "Kalenderblatt vom " + datumText
}
function neueInfo(datum) {
        const day = datum.getDate()
        const jahr = datum.getFullYear()

        const monatsName = datum.toLocaleDateString("de-DE", { month: "long" });

        const wochentagsName = datum.toLocaleDateString("de-DE", { weekday: "long" });

        const wievielterWochentag = Math.ceil(day / 7);
        const tagImJahr = berechneTageSeitJahresbeginn(datum);
        const verbleibendeTage = berechneVerbleibendeTage(datum);
        const anzahlTageImMonat = berechneTageImMonat(datum)

        const info1 = document.getElementById("info1")
        info1.textContent = "Der " +
                day +
                ". " +
                monatsName +
                " ist der " +
                nummern[wievielterWochentag] +
                ". " +
                wochentagsName +
                " im Monat ";

        const info2 = document.getElementById("info2")
        info2.textContent = "Es handelt sich um den " +
                tagImJahr +
                ". Tag des Jahres " +
                jahr +
                ", was bedeutet, dass es noch " +
                verbleibendeTage +
                " Tage bis zum Jahresende sind.";

        const info4 = document.getElementById("info4") // TODO: MACH INFO 3 !!!!!!
        info4.textContent = "Der Monat " +
                monatsName +
                " hat insgesamt " +
                anzahlTageImMonat +
                " Tage";

        const aktuellerMonat = document.getElementById("aktuellerMonat")
        aktuellerMonat.textContent = monatsName

        const h3 = document.getElementById("h3")
        h3.textContent = "Historische Ereignisse am " +
                day + ". " +
                monatsName
}




function clearGrid(tabellenFelder) {
        for (let i = 0; i < tabellenFelder.length; i++) {
                tabellenFelder[i].textContent = "";

                tabellenFelder[i].classList = null;
                tabellenFelder[i].classList = null;
        }
}

function istBeispielGeburtstag(datum) {
        return datum.getDate() === 15 && datum.getMonth() === 8;
}

function generateCalendarGrid(datum) {

        const year = datum.getFullYear()
        const month = datum.getMonth();
        const ersterTagImMonat = new Date(year, month, 1);
        const anzahlTageImMonat = berechneTageImMonat(datum);
        const wochentagErsterTag = ersterTagImMonat.getDay();
        const kalendertabelle = document.getElementById("kalendertabelle");
        const tabellenFelder = kalendertabelle.querySelectorAll("td");
        clearGrid(tabellenFelder);

        let startPosition;

        if (wochentagErsterTag === 0) {
                startPosition = 6;
        } else {
                startPosition = wochentagErsterTag - 1;
        }

        let tag = 1;



        for (let i = startPosition; i < tabellenFelder.length && tag <= anzahlTageImMonat; i++) {
                tabellenFelder[i].textContent = tag;
                const zellenDatum = new Date(year, month, tag)
                //  [zelle,zelle,zelle]


                if (istBeispielGeburtstag(zellenDatum)) {
                        tabellenFelder[i].classList.add("Beispielgeburtstag")
                }

                tag++;
        }

        tabellenFelder.forEach(function (zelle) {
                zelle.onclick = function () {

                        if (zelle.textContent === "") {
                                return;
                        }

                        const clickDatum = new Date(
                                datum.getFullYear(),
                                datum.getMonth(),
                                Number(zelle.textContent)
                        )
                        updateCalendar(clickDatum);

                }
                if (Number(zelle.textContent) === datum.getDate()) {
                        zelle.classList.add("ausgewaehltesDatum")
                }
        }
        )
}

function button() {
        const next = document.getElementById("buttonWeiter")
        const back = document.getElementById("buttonZurueck")

        if (next) {
                next.onclick = function () {
                        const neuesDatum = new Date(
                                aktuellesDatum.getFullYear(),
                                aktuellesDatum.getMonth() + 1,
                                1
                        )
                        updateCalendar(neuesDatum);
                }
        }

        if (back) {
                back.onclick = function () {
                        const neuesDatum = new Date(
                                aktuellesDatum.getFullYear(),
                                aktuellesDatum.getMonth() - 1,
                                1
                        )
                        updateCalendar(neuesDatum);
                }
        }

}

function feiertage(datum) {

        const neuerTag = datum.getDate()
        const neuerMonat = datum.getMonth() + 1



        // Gesetzliche Feiertage in Deutschland
        const neujahr = neuerTag === 1 && neuerMonat === 1;
        const tagDerDeutschenEinheit = neuerTag === 3 && neuerMonat === 10;
        const ersterWeihnachtsfeiertag = neuerTag === 25 && neuerMonat === 12;
        const zweiterWeihnachtsfeiertag = neuerTag === 26 && neuerMonat === 12;

        const info5 = document.getElementById("info5");


        // Gesetzliche Feiertage ja/nein- Block
        if (neujahr) {
                info5.textContent = "Heute ist 'Neujahr', was in Deutschland ein gesetzlicher Feiertag ist.";
        }
        else if (tagDerDeutschenEinheit) {
                info5.textContent = "Heute ist 'der Tag der Deutschen Einheit', was in Deutschland ein gesetzlicher Feiertag ist.";
        }
        else if (ersterWeihnachtsfeiertag) {
                info5.textContent = "Heute ist 'der erste Weihnachtsfeiertag', was in Deutschland ein gesetzlicher Feiertag ist.";
        }
        else if (zweiterWeihnachtsfeiertag) {
                info5.textContent = "Heute ist 'der zweite Weihnachtsfeiertag', was in Deutschland ein gesetzlicher Feiertag ist.";
        }
        else {
                info5.textContent = "Heute ist kein gesetzlicher Feiertag in Deutschland.";
        }

}

async function neueEreignisse(datum) {

        for (let i = 1; i < 5; i++) {
                document.getElementById("ereignis" + i).textContent =
                        "Ereignisse werden geladen...";
        }

        try {
                const neuerMonat = datum.getMonth() + 1
                const neuerTag = datum.getDate()

                const response = await fetch(`https://history.muffinlabs.com/date/${neuerMonat}/${neuerTag}`);


                if (!response.ok) {
                        throw new Error("HTTP error:" + response.status);
                }

                const data = await response.json();

                if (datum !== aktuellesDatum) {
                        return;
                }

                const events = data.data.Events;

                for (let i = 0; i < 5; i++) {
                        const feld = document.getElementById("ereignis" + (i + 1));

                        if (events[i]) {
                                feld.textContent = events[i].year + ": " + events[i].text;
                        } else {
                                feld.textContent = "Kein weiteres Ereignis vorhanden.";
                        }
                }
        } catch (error) {
                console.error(error);

                if (datum !== aktuellesDatum) {
                        return;
                }

                for (let i = 1; i < 5; i++) {
                        document.getElelemtById("ereignis" + i).textContent =
                                "Ereignisse konnten nicht geladen werden.";
                }
        }
}

function main() {
        button();
        updateCalendar(aktuellesDatum)
}
main();

