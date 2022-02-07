import { stopClock, waitForAnimation } from "./app.js";
import Clock from "./clock.js";

const dayNumber = document.getElementById('day-num');
const hourNumber = document.getElementById("hour-num");
const minNumber = document.getElementById("min-num");
const secNumber = document.getElementById("sec-num");
// todo: sort by modified time
function displayCountdowns() {
    let countdownList = document.getElementById('countdown-list');
    let JsonListOfCountdowns = localStorage.getItem('countdown');
    if (JsonListOfCountdowns) {
        let arrayOfCountdowns = JSON.parse(JsonListOfCountdowns).reverse();
        let listItems = '';
        arrayOfCountdowns.forEach(countdown => {
            let date = new Date(countdown.date);
            let dateModified = new Date(countdown.dateModified)
            listItems += `<div class="list-item" style ="border-bottom: 0.1em solid blue; padding: 0.6em;">
        <div class="list-text">
         <span>Text: </span> ${countdown.text} </div>
        <div>
        <span>Date: </span>${date.getDate() + ' ' + date.toLocaleString('default', { month: 'long' }) + ', ' + date.getFullYear()}
        </div>
        <div>
        <span>Date Modified: </span>${dateModified.getDate() + ' ' + dateModified.toLocaleString('default', { month: 'long' }) + ', ' + dateModified.getFullYear()}
        </div>
        </div>`
        });
        countdownList.innerHTML = listItems;
        let clock = new Clock(new Date(arrayOfCountdowns[0].date));
        // waitForAnimation(new Clock(new Date(arrayOfCountdowns[0].date)));
        // myclock.endDate = new Date(arrayOfCountdowns[0].date)
        stopClock();
        waitForAnimation(clock, { dayNumber, hourNumber, minNumber, secNumber })
    } else {
        countdownList.innerHTML = 'Found no countdowns to display';
    }
    // console.log(myClock);
}

displayCountdowns();