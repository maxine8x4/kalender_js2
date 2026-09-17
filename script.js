const datum = new Date();

document.title = "Kalenderblatt vom " + datum.toLocaleDateString("de-DE", {
});

const datumText = datum.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "long",
        year: "numeric"
});

let monatsName = datum.toLocaleDateString("de-DE", {
        month: "long"
});

let wochentagsname = datum.toLocaleDateString("de-DE", {
        weekday: "long"
});


const wochentage = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const monate = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const nummern = ['', 'erste', 'zweite', 'dritte', 'vierte', 'fünfte'];

const day = datum.getDate();
const month = datum.getMonth() + 1;
const year = datum.getFullYear();


//  0   1   2   3   4   5   6   7   8   9  10   11         
const tageImMonat = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let anzahlTageImMonat = tageImMonat[datum.getMonth()];
if (datum.getMonth() === 1 && istSchaltjahr(year)) {
        anzahlTageImMonat++;
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

// schaltjahr:
// jahr % 400 == 0 oder jahr % 4 == 0 und jahr % 100 !=0 -> schaltjahr

// 31 + 28 + (wenn schaltjahr, dann noch +1) + tag im märz

const tagImJahr = berechneTageSeitJahresbeginn(datum);

// Berechnung wievielter Wochentag
const wievielterWochentag = Math.ceil(day / 7);         // Berechnung, welcher Wochentag im Monat es ist (1. bis 7.)


// Berechnung der verbleibenden Tage bis zum Jahresende
const jahresende = new Date(year, 11, 31);
const unterschiedEnde = jahresende - datum;     // Berechnung der Differenz zwischen dem aktuellen Datum und dem Jahresende in Millisekunden
const verbleibendeTage = Math.ceil(unterschiedEnde / (1000 * 60 * 60 * 24));     // Berechnung der verbleibenden Tage bis zum Jahresende


const text = "Es ist der " + nummern[wievielterWochentag] + " " + wochentagsname + " im Monat.";       // Erstellung des Textes, der den Wochentag im Monat beschreibt

feiertage(datum);


function button(neuesDatum) {

        const vor = document.getElementById("button1")
        const zurück = document.getElementById("button2")
        
        vor.forEach(function () {
        monat.addEventListener("click", function() {
                const clickButton = new month(
                        month+2
                )
                button(clickButton);
        })
})
        
}


function clearGrid(tabellenFelder) {
        for (let j = 0; j < tabellenFelder.length; j++) {
                tabellenFelder[j] = '';     
        }
}


function generateCalendarGrid(neuesDatum) {
        
        const year = neuesDatum.getFullYear()
        const month = neuesDatum.getMonth() + 1;
        const ersterTagImMonat = new Date(year, month - 1, 1);                  
        const wochentagErsterTag = ersterTagImMonat.getDay();
        const kalendertabelle = document.getElementById("kalendertabelle");
        const tabellenFelder = kalendertabelle.querySelectorAll("td");
        console.log(tabellenFelder)        
        let startPosition;
        
        if (wochentagErsterTag === 0) {
                startPosition = 6;
        } else {
                startPosition = wochentagErsterTag - 1;
        }
        
        let tag = 1;
        
        clearGrid(tabellenFelder);
        
        for (let i = startPosition; i < tabellenFelder.length && tag <= anzahlTageImMonat; i++) {
                tabellenFelder[i].textContent = tag;
                
                //  [zelle,zelle,zelle]
                
                
                if (tag === 15 && month === 9) {
                        tabellenFelder[i].classList.add("Geburtstag");
                }
                
                tag++;
        }
        
        
        const tage = document.querySelectorAll("tbody td");
        tage.forEach(function (tag) {
                tag.addEventListener("click", function() {
                        const clickDatum = new Date(
                                year,
                                month -1,
                                tag.textContent
                        )
                        neuerTitel(clickDatum);
                        neueInfo(clickDatum);
                        neueEreignisse(clickDatum);
                        feiertage(clickDatum);
                        console.log(clickDatum);
                        generateCalendarGrid(clickDatum);
                        
                        // dieseZelle = liste[woWirGeklicktHaben]
                        // neuesDatum = new Date(year, month, dieseZelle)               
                        
                        
                });
                
                if (tag.textContent == neuesDatum.getDate()) {
                        tag.classList.add("heute");
                }
                
        });

        
}       

generateCalendarGrid(new Date());


function neuerTitel(clickDatum) {
        const titel = document.getElementById("titel")
        titel.textContent = "Kalenderblatt vom " +
        clickDatum.getDate() +
        ". " + 
        clickDatum.toLocaleDateString("de-DE", {month: "long"}) +
        " " +
        clickDatum.getFullYear();
        
        document.title = "Kalenderblatt vom " +
        clickDatum.getDate() + "." +
        clickDatum.getMonth() + "." +
        clickDatum.getFullYear()
}

function neueInfo(clickDatum){
        
        const tagImJahr = berechneTageSeitJahresbeginn(clickDatum);
        
        const jahresende = new Date(clickDatum.getFullYear(), 11, 31);
        const unterschiedEnde = jahresende - clickDatum; 
        const verbleibendeTage = Math.ceil(unterschiedEnde / (1000 * 60 * 60 * 24));
        
        let anzahlTageImMonat = tageImMonat[clickDatum.getMonth()];
        if (clickDatum.getMonth() === 1 && istSchaltjahr(clickDatum.getFullYear())) {
                anzahlTageImMonat++;
        }
        
        
        const info1 = document.getElementById("info1")
        info1.textContent = "Der " +
        clickDatum.getDate() +
        ". " +
        clickDatum.toLocaleDateString("de-DE", {month: "long"}) +
        " ist der " +
        Math.ceil(clickDatum.getDate()/ 7) +
        ". " +
        clickDatum.toLocaleDateString("de-DE", {weekday: "long"}) +
        " im Monat ";
        
        const info2 = document.getElementById("info2")
        info2.textContent = "Es handelt sich um den " +
        tagImJahr +
        ". Tag des Jahres " +
        clickDatum.getFullYear() +
        ", was bedeutet, dass es noch " +
        verbleibendeTage +
        " Tage bis zum Jahresende sind.";
        
        const info4 = document.getElementById("info4")
        info4.textContent = "Der Monat " +
        clickDatum.toLocaleDateString("de-DE", {month: "long"}) +
        " hat insgesamt " +
        anzahlTageImMonat +
        " Tage";
        console.log(anzahlTageImMonat);
        
        const aktuellerMonat = document.getElementById("aktuellerMonat")
        aktuellerMonat.textContent = clickDatum.toLocaleDateString("de-DE", {month: "long"})
        
        const h3 = document.getElementById("h3")
        h3.textContent = "Historische Ereignisse am " +
        clickDatum.getDate() + "." +
        clickDatum.toLocaleString("de-DE", {month: "long"})
}

async function neueEreignisse(clickDatum){
        
        try {
                const neuerMonat = clickDatum.getMonth()+1
                const neuerTag = clickDatum.getDate()
                const response = await fetch(`https://history.muffinlabs.com/date/${neuerMonat}/${neuerTag}`);
                
                
                if (!response.ok) {
                        throw new Error("HTTP error!");
                }
                
                const data = await response.json();
                
                console.log(data.data.Events);
                const events = data.data.Events;
                
                document.getElementById("ereignis1").textContent = events[1].year + ": " + events[1].text;
                document.getElementById("ereignis2").textContent = events[2].year + ": " + events[2].text;
                document.getElementById("ereignis3").textContent = events[3].year + ": " + events[3].text;
                document.getElementById("ereignis4").textContent = events[4].year + ": " + events[4].text;
                document.getElementById("ereignis5").textContent = events[5].year + ": " + events[5].text;
                
                return data;
        }
        catch (error) {
                console.error(error);
        }
}



//Geburtstage
const Beispielgeburtstag = new Date(year, 8, 15);
console.log(Beispielgeburtstag)
if (datum.getTime() === Beispielgeburtstag.getTime()) {
        tabellenFelder[i].classList.add("Beispielgeburtstag");
}


function feiertage(clickDatum) {

        const neuerTag = clickDatum.getDate()
        const neuerMonat = clickDatum.getMonth()+1


// Gesetzliche Feiertage in Deutschland
const neujahr = neuerTag === 1 && neuerMonat === 1;
const tagDerDeutschenEinheit = neuerTag === 3 && neuerMonat === 10;
const ersterWeihnachtsfeiertag = neuerTag === 25 &&neuerMonath === 12;
const zweiterWeihnachtsfeiertag = neuerTag === 26 &&neuerMonath === 12;
const septemberTag = neuerTag === 17 && neuerMonat === 9;

// Gesetzliche Feiertage ja/nein- Block
if (neujahr) {
        document.getElementById("info5").textContent = "Heute ist 'Neujahr', was in Deutschland ein gesetzlicher Feiertag ist.";
}
else if (septemberTag) {
        document.getElementById("info5").textContent = "Heute ist Septembertag";
}
else if (tagDerDeutschenEinheit) {
        document.getElementById("info5").textContent = "Heute ist 'der Tag der Deutschen Einheit', was in Deutschland ein gesetzlicher Feiertag ist.";
}
else if (ersterWeihnachtsfeiertag) {
        document.getElementById("info5").textContent = "Heute ist 'der erste Weihnachtsfeiertag', was in Deutschland ein gesetzlicher Feiertag ist.";
}
else if (zweiterWeihnachtsfeiertag) {
        document.getElementById("info5").textContent = "Heute ist 'der zweite Weihnachtsfeiertag', was in Deutschland ein gesetzlicher Feiertag ist.";
}
else {
        document.getElementById("info5").textContent = "Heute ist kein gesetzlicher Feiertag in Deutschland.";
}
//feiertage(clickDatum);
}

// Histroische Ereignisse am heutigen Tag
async function fetchData() {
        
        try {
                const today = new Date();
                const month = today.getMonth() + 1;
                const day = today.getDate();
                const response = await fetch(`https://history.muffinlabs.com/date/${month}/${day}`);
                
                if (!response.ok) {
                        throw new Error("HTTP error!");
                }
                
                const data = await response.json();
                
                console.log(data.data.Events);
                return data;
        }
        catch (error) {
                console.error(error);
        }
        
}

async function main() {
        const data = await fetchData();
        const events = data.data.Events;

        document.getElementById("ereignis1").textContent = events[1].year + ": " + events[1].text;
        document.getElementById("ereignis2").textContent = events[2].year + ": " + events[2].text;
        document.getElementById("ereignis3").textContent = events[3].year + ": " + events[3].text;
        document.getElementById("ereignis4").textContent = events[4].year + ": " + events[4].text;
        document.getElementById("ereignis5").textContent = events[5].year + ": " + events[5].text;
}
main();


// Text im Rand-Block
document.getElementById("titel").textContent = "Kalenderblatt vom " + datumText;
document.getElementById("info1").textContent = "Der " + day + ". " + monatsName + " ist der " + nummern[wievielterWochentag] + " " + wochentagsname + " im Monat ";
document.getElementById("info2").textContent = "Es handelt sich um den " + tagImJahr + ". Tag des Jahres " + year + ", was bedeutet, dass es noch " + verbleibendeTage + " Tage bis zum Jahresende sind.";
document.getElementById("info4").textContent = "Der Monat " + monatsName + " hat insgesamt " + anzahlTageImMonat + " Tage";
document.getElementById("aktuellerMonat").textContent = monatsName;
document.getElementById("h3").textContent = "Historische Ereignisse am " + day + "." + monatsName;




// Todo
// Geburtstage und Feiertage mit Icon in Kalenderblatt markieren
// Historische Ereignisse auf Deutsch