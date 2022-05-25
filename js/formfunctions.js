import {addZeros} from './functions.js'
export function popForm() {
    let countNumber = localStorage.getItem('countNumber');
    if (!countNumber)
        countNumber = 1;
    const popFormHtml = `<section class="pop-up-container">
    <form id='customDateForm' class="pop-up-form">
        <div class="form-header">Set Countdown</div>
        <div class="form-sections">
            <label for="">Title &nbsp;</label>
            <input type="text" placeholder="countdown #${countNumber}" id='countdownText'>
        </div>
        <div class="form-sections">
            <label for="">Date & Time &nbsp;</label>
            <input type="datetime-local" id ="dateInput" min="" required>
        </div>
        <div class="form-sections form-repeat">
            <label for="repeat-cb">
                <input type="checkbox" id="repeat-cb"> Repeat every year 
            </label>
        </div>
        <div class="form-sections">
            <label for=""></label>
            <input type="submit" id ="countdown-submit"value="Submit" formmethod="dialog">
        </div>    
        <div class="close-form"><button>Close</button></div>
    </form>
    </section>`;

    document.body.insertAdjacentHTML("afterbegin", popFormHtml);
    document.body.style.position = "fixed";
    setDateAttributes();
    document.getElementsByClassName("close-form")[0].onclick = (e) => { 
        // console.log('close firing');
        closeFormPopUp();
     }
    
}

export function closeFormPopUp() {
    document.getElementsByClassName("pop-up-container")[0].remove();
    document.body.style.position = "";
}

export function setDateAttributes() {
    const dateInput = document.getElementById("dateInput");
    const today = new Date();
    let dd = today.getDate();//add 1 to the date so date starts from tomorrow
    let mm = today.getMonth() + 1; //January is 0 so need to add 1 to make it 1!
    let yyyy = today.getFullYear();
    let hr = addZeros(today.getHours());
    let min = addZeros(today.getMinutes());
    dd = addZeros(dd);
    mm = addZeros(mm)

    let todayString = yyyy + '-' + mm + '-' + dd + 'T' + hr + ':' + min;
    console.log(todayString);
    dateInput.setAttribute("min", todayString);
    dateInput.value = todayString;
}
