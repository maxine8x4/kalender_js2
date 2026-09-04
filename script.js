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


/*// Berechnung passender Wochentage
const ersterTag = newDate(year, month - 1, 1);     // Erster Tag des Monats
/*
const letzterTag = new Date(year, month, 0);        // Letzter Tag des Monats
*/


// Berechnung passender Tag(Zahl) zu Wochentag(Mo, Di..)
const ersterTagImMonat = new Date(year, month - 1, 1);                 // Erstellt den 1. Tag des Monats
const wochentagErsterTag = ersterTagImMonat.getDay();                   // Welcher Wochentag ist der erste Tag im Monat
const kalendertabelle = document.getElementById("kalendertabelle");
const tabellenFelder = kalendertabelle.querySelectorAll("td");          // = sucht in der Tabelle td


// Berechnung dazu Sonntag
let startPosition;

        if (wochentagErsterTag === 0) {
                startPosition = 6;
        }               else {
        startPosition = wochentagErsterTag - 1;
}

let tag = 1;

        for (let i = startPosition; i < tabellenFelder.length && tag <= anzahlTageImMonat; i++) {
                tabellenFelder[i].textContent = tag;

                
        if (tag === 15 && month === 9){
                tabellenFelder[i].classList.add("Geburtstag");
        }
        
                tag++;
}

const tage = document.querySelectorAll("tbody td");
tage.forEach(function (tag) {
        if (tag.textContent == datum.getDate()) {
                tag.classList.add("heute");
        }

});




// Gesetzliche Feiertage in Deutschland
const neujahr = day === 1 && month === 1;
const tagDerDeutschenEinheit = day === 3 && month === 10;
const ersterWeihnachtsfeiertag = day === 25 && month === 12;
const zweiterWeihnachtsfeiertag = day === 26 && month === 12;



// Histroische Ereignisse am heutigen Tag
async function fetchData() {

        try {
                const today = new Date();
                const month = today.getMonth() + 1;
                const day = today.getDate() ;
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

        document.getElementById("ereignis1").textContent = events[51].text;
        document.getElementById("ereignis2").textContent = events[50].text;
        document.getElementById("ereignis3").textContent = events[49].text;
        document.getElementById("ereignis4").textContent = events[48].text;
        document.getElementById("ereignis5").textContent = events[47].text;
}
main ();




// Gesetzliche Feiertage ja/nein- Block

if (neujahr) {
        document.getElementById("info5").textContent = "Heute ist 'Neujahr', was in Deutschland ein gesetzlicher Feiertag ist.";
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


// Text im Rand-Block
document.getElementById("titel").textContent = "Kalenderblatt vom " + datumText;
document.getElementById("info1").textContent = "Der " + day + ". " + monatsName + " ist der " + nummern[wievielterWochentag] + " " + wochentagsname + " im Monat ";
document.getElementById("info2").textContent = "Es handelt sich um den " + tagImJahr + ". Tag des Jahres " + year + ", was bedeutet, dass es noch " + verbleibendeTage + " Tage bis zum Jahresende sind.";
document.getElementById("info4").textContent = "Der Monat " + monatsName + " hat insgesamt " + anzahlTageImMonat + " Tage";
document.getElementById("aktuellerMonat").textContent = monatsName;
document.getElementById("h3").textContent = "Historische Ereignisse am " + day + "." + monatsName;
 



// Todo 
// Geburtstage und Feiertage mit Icon in Kalenderblatt markieren
// Neues Hintergrundbild erstellen
// Historische Ereignisse auf Deutsch


//Geburtstage
const Beispielgeburtstag = new Date(year, 8, 15);
console.log(Beispielgeburtstag)
        if (datum.getTime() === Beispielgeburtstag.getTime()){
                tabellenFelder[i].classList.add("Beispielgeburtstag");
        }