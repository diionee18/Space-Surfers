// import { addEvent } from "./Events.js";
import { toggleSearchInput } from "./searchdate.js";
import { idGenerator } from "./searchdate.js";
import { updateIds } from "./searchdate.js";
import { calenderInput } from "./searchdate.js";
import { dateObject } from "./searchdate.js";

// Lista med månader
const monthNames = [
    "januari",
    "februari",
    "mars",
    "april",
    "maj",
    "juni",
    "juli",
    "augusti",
    "september",
    "oktober",
    "november",
    "december",
];

//hämta element från DOM
const days = document.querySelectorAll(".current-month-cell");
const body = document.querySelector("body");
const dateContainer = document.querySelector(".date-container");
const date = document.querySelector(".date");
const dateYear = document.querySelector(".date-year");
const prevNextBtn = document.querySelectorAll(".Kalender-container .month-btn");
const main = document.querySelector("main");

generateDates();

prevNextBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
        dateObject.currentMonth =
            btn.id === "prev"
                ? dateObject.currentMonth - 1
                : dateObject.currentMonth + 1;
        // om aktuell månad är mindre än 0 eller större än 11
        if (dateObject.currentMonth < 0 || dateObject.currentMonth > 11) {
            dateObject.currentDate = new Date(
                dateObject.currentYear,
                dateObject.currentMonth
            );
            dateObject.currentYear = dateObject.currentDate.getFullYear(); // Uppdaterar år
            dateObject.currentMonth = dateObject.currentDate.getMonth(); // Uppdaterar månad
        } else {
            dateObject.currentDate = new Date();
        }
        generateDates();
        updateIds();
        idGenerator();
        toggleSearchInput();
    });
});

//skapar en kalender för en given månad och år
function generateDates() {
    //  calenderInput.addEventListener("change", function(){

    //     let selectedDate = new Date(this.value);
    //    let year = selectedDate.getFullYear();
    //    let month = selectedDate.getMonth();

    //     changeDates(year, month)

    // })

    //tömmer kalender
    dateContainer.innerHTML = "";

    //anger månad och år
    date.textContent = `${monthNames[dateObject.currentMonth]} ${
        dateObject.currentYear
    }`;

    //hämtar start och slutdatum för den givna månaden
    const startDate = new Date(
        dateObject.currentYear,
        dateObject.currentMonth,
        1
    );
    const endDate = new Date(
        dateObject.currentYear,
        dateObject.currentMonth + 1,
        0
    );
    //Ändrar så att måndag är första dag i veckan
    const startDay = (startDate.getDay() - 1 + 7) % 7;

    //lägger till tomma celler innan månaden
    for (let i = 0; i < startDay; i++) {
        const previousMonthDateCell = document.createElement("div");
        previousMonthDateCell.classList.add("date-cell", "blank-cell");
        dateContainer.appendChild(previousMonthDateCell);
    }

    let currentDate = new Date(startDate);
    //lägger till alla celler för respektive datum och eventuella tomma celler i slutet
    while (currentDate <= endDate) {
        const dateCell = document.createElement("div");
        dateCell.textContent = currentDate.getDate();
        dateCell.classList.add("date-cell", "current-month-cell");
        const plusBtn = document.createElement("button");
        plusBtn.innerHTML = "<i> &#10010; </i>";

        plusBtn.classList.add("event-btn");
        plusBtn.classList.toggle("hide-toggle", true);
        dateCell.appendChild(plusBtn);
        dateContainer.appendChild(dateCell);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    let allDateCells = document.querySelectorAll(".date-cell");
    for (let i = 0; i < allDateCells.length; i++) {
        let dateCell = allDateCells[i];
        dateCell.addEventListener("click", () => {
            let plusBtn = dateCell.lastChild;
            plusBtn.classList.toggle("hide-toggle");
        });
    }

    //--------------------- kod för event funktionen börjar här ---------------------------------
    let allPlusBtn = document.querySelectorAll(".event-btn");
    for (let i = 0; i < allPlusBtn.length; i++) {
        let plusBtn = allPlusBtn[i];
        plusBtn.addEventListener("click", (event) => {
            let eventPopUp = document.createElement("section");
            eventPopUp.classList.add("popup-event");
            eventPopUp.innerHTML = `
        <textarea class="event-text-area" rows="5" cols="50"></textarea>
        <button class="event-done-btn">Klar</button>
        `;

            let textArea = eventPopUp.querySelector(".event-text-area");
            event.stopPropagation();

            textArea.value = "";

            main.append(eventPopUp);

            let eventDoneBtn = document.querySelector(".event-done-btn");
            eventDoneBtn.addEventListener("click", () => {
                eventDoneBtn.style.background = "red";
                //let textArea = document.querySelector(".event-text-area") det är extra?

                let eventContentBox = document.createElement("div");
                eventContentBox.classList.add("event-content-box");

                let eventContentBoxClose = document.createElement("button");
                eventContentBoxClose.innerHTML = `
            <i> &#10006;</i>
            `;
                eventContentBoxClose.classList.add("close-contentbox-btn");
                eventPopUp.classList.toggle("hide-toggle");

                let eventContent = document.createElement("p");
                eventContent.classList.add("event-content");

                eventContent.innerText = ` ${textArea.value}`;
                let eventIcon = document.createElement("button");
                eventIcon.innerHTML = `
            <i>&#9734;</i>
            `;
                eventContentBox.append(eventContentBoxClose);
                eventContentBox.append(eventContent);
                main.append(eventContentBox);

                eventPopUp.remove();

                plusBtn.parentElement.append(eventIcon);
                plusBtn.classList.toggle("hide-toggle");

                eventContentBoxClose.addEventListener("click", () => {
                    eventContentBox.classList.toggle("hide-toggle");
                    eventContentBox.scrollIntoView(true);
                });

                eventIcon.addEventListener("click", (event) => {
                    event.stopPropagation();
                    eventContentBox.classList.toggle("hide-toggle");
                    eventContentBox.scrollIntoView(true);
                });
            });
            main.addEventListener("click", () => {
                eventPopUp.remove();
            });
            eventPopUp.addEventListener("click", (event) => {
                event.stopPropagation();
            });
        });
    }
    // -----------------------------------------------------

    //itererar över månaden och väljer ut "idag" och ger klassen current-date
    const today = new Date();
    const dateCells = document.querySelectorAll(".date-cell");
    const dayOfMonth = document.querySelectorAll(".current-month-cell");
    dateCells.forEach((cell) => {
        const cellDate = new Date(
            dateObject.currentYear,
            dateObject.currentMonth,
            parseInt(cell.textContent)
        );
        if (cellDate.toDateString() === today.toDateString()) {
            cell.classList.add("current-date");
        } else {
            cell.classList.remove("current-date");
        }
    });
    // vår börjar här
    if (date.textContent === `mars ${dateObject.currentYear}`) {
        main.classList.add("vår");
        main.classList.remove("vinter");
        main.classList.remove("sommar");
        main.classList.remove("höst");
    }
    if (date.textContent === `april ${dateObject.currentYear}`) {
        main.classList.add("vår");
        main.classList.remove("vinter");
        main.classList.remove("sommar");
        main.classList.remove("höst");
    }
    if (date.textContent === `maj ${dateObject.currentYear}`) {
        main.classList.add("vår");
        main.classList.remove("vinter");
        main.classList.remove("sommar");
        main.classList.remove("höst");
    }
    // vår slutar här

    // Sommar börjar här
    if (date.innerHTML === `juni ${dateObject.currentYear}`) {
        main.classList.add("sommar");
        main.classList.remove("vår");
        main.classList.remove("vinter");
        main.classList.remove("höst");
    }
    if (date.innerHTML === `juli ${dateObject.currentYear}`) {
        main.classList.add("sommar");
        main.classList.remove("vår");
        main.classList.remove("vinter");
        main.classList.remove("höst");
    }
    if (date.innerHTML === `augusti ${dateObject.currentYear}`) {
        main.classList.add("sommar");
        main.classList.remove("vår");
        main.classList.remove("vinter");
        main.classList.remove("höst");
    }
    // Sommar slutar här

    // hösten börjar här
    if (date.innerHTML === `september ${dateObject.currentYear}`) {
        main.classList.add("höst");
        main.classList.remove("sommar");
        main.classList.remove("vår");
        main.classList.remove("vinter");
    }
    if (date.innerHTML === `oktober ${dateObject.currentYear}`) {
        main.classList.add("höst");
        main.classList.remove("sommar");
        main.classList.remove("vår");
        main.classList.remove("vinter");
    }
    if (date.innerHTML === `november ${dateObject.currentYear}`) {
        main.classList.add("höst");
        main.classList.remove("sommar");
        main.classList.remove("vår");
        main.classList.remove("vinter");
    }
    // hösten slutar här

    // Vintern börjar här
    if (date.innerHTML === `december ${dateObject.currentYear}`) {
        main.classList.add("vinter");
        main.classList.remove("höst");
        main.classList.remove("vår");
        main.classList.remove("sommar");
    }
    if (date.innerHTML === `januari ${dateObject.currentYear}`) {
        main.classList.add("vinter");
        main.classList.remove("höst");
        main.classList.remove("vår");
        main.classList.remove("sommar");
    }
    if (date.innerHTML === `februari ${dateObject.currentYear}`) {
        main.classList.add("vinter");
        main.classList.remove("höst");
        main.classList.remove("vår");
        main.classList.remove("sommar");
    }
    // Vintern slutar här

    function isLeapYear(year) {
        return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }
    //räknar ut midsommardagen
    const june20th = new Date(dateObject.currentYear, 5, 20);
    const daysUntilSaturday = (6 - june20th.getDay()) % 7;

    //räknar ut Alla helgons dag
    const oct31st = new Date(dateObject.currentYear, 9, 31);
    const daysUntilSaturdayNovember = (6 - oct31st.getDay()) % 7;

    //Uträkningen bygger på "Meeus/Jones/Butcher" - Algoritmen

    //G is the "Golden Number" for the year (i.e., the year modulo 19).
    //C is the "Century" (i.e., the year divided by 100, rounded down).
    //H is related to the "Epact" (i.e., the age of the moon on January 1st of the year).
    //I is the number of days between March 21 and the Paschal full moon.
    //J is the weekday of the Paschal full moon (0=Sunday, 1=Monday, etc.).
    //L is the number of days between March 21 and the Sunday on or before the Paschal full moon.
    //month and day are the month and day of Easter, respectively.

    const Easter = getEaster(isLeapYear(dateObject.currentYear));
    function getEaster(year) {
        let f = Math.floor,
            // Golden Number - 1
            G = year % 19,
            C = f(year / 100),
            // related to Epact
            H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
            // number of days from 21 March to the Paschal full moon
            I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
            // weekday for the Paschal full moon
            J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
            // number of days from 21 March to the Sunday on or before the Paschal full moon
            L = I - J,
            month = 3 + f((L + 40) / 44),
            day = L + 28 - 31 * f(month / 4);

        return [month, day];
    }

    const redDays = [
        new Date(dateObject.currentYear, 0, 1), // Nyårsdagen
        new Date(dateObject.currentYear, 0, 6), // trettondagen
        new Date(dateObject.currentYear, 4, 1), // Första maj
        new Date(dateObject.currentYear, 5, 6), // Nationaldagen
        new Date(dateObject.currentYear, 11, 25), // Juldagen
        new Date(dateObject.currentYear, 11, 26), // Annandag jul
        new Date(dateObject.currentYear, 5, 20 + daysUntilSaturday), // Midsommardagen
        new Date(dateObject.currentYear, 9, 31 + daysUntilSaturdayNovember), // Alla helgons dag

        //långfredagen
        new Date(
            dateObject.currentYear,
            getEaster(dateObject.currentYear)[0] - 1,
            getEaster(dateObject.currentYear)[1] - 2
        ),
        //Påskdagen
        new Date(
            dateObject.currentYear,
            getEaster(dateObject.currentYear)[0] - 1,
            getEaster(dateObject.currentYear)[1] - 0
        ),
        //Annandag påsk
        new Date(
            dateObject.currentYear,
            getEaster(dateObject.currentYear)[0] - 1,
            getEaster(dateObject.currentYear)[1] + 1
        ),
        // Kristi himmelsfärdsdag
        new Date(
            dateObject.currentYear,
            getEaster(dateObject.currentYear)[0] - 1,
            getEaster(dateObject.currentYear)[1] + 39
        ),
        //Pingst
        new Date(
            dateObject.currentYear,
            getEaster(dateObject.currentYear)[0] - 1,
            getEaster(dateObject.currentYear)[1] + 49
        ),
    ];

    // Loopar över varje datumcell
    dayOfMonth.forEach((cell) => {
        // Hämtar datumet för den aktuella cellen
        const cellDate = new Date(
            dateObject.currentYear,
            dateObject.currentMonth,
            parseInt(cell.textContent)
        );
        // Kollar om cellens datum finns i listan med röda dagar
        if (
            redDays.some(
                (redDay) => redDay.toDateString() === cellDate.toDateString()
            )
        ) {
            cell.classList.add("red-day");
        } else {
            cell.classList.remove("red-day");
        }
    });
    idGenerator();
    updateIds();
    toggleSearchInput();
}

export { dateContainer };
export { monthNames };
