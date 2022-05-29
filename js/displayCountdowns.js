import { Clock } from "./clock.js";
import { removeElementSetDisplayNone, setInnerHtmlForNotNull, stopClock } from "./functions.js";
import { updateLocalItem, getCountdownString,  populateList, getCountItemExists, setCountItemExists, setCountItemStatus, fetchArrayOfCountdowns, closeSortMenu, showClockRow, switchContextIconDown, switchContextIconUp, isTargetElementOnCountdownItem, isTargetElementOnContextMenu, isClassOnTargetElement, setMainClockCountdown, hideContextMenus, triggerContextMenu, LISTPAGE_DOM_IDS, updateClockAndText, addSortUI, sortTitleEventHandler, addSortEventListeners, displayCountdowns, getCountdownIndexByDateModified, getArrayIndexByDateModified, removeClockAndText } from "./listFunctions.js";
import { closeFormPopUp, CONSTANT_IDS, displayFormPopUp, saveCountDownList } from "./formfunctions.js";
import { errorHandler } from "./error.js";
// Dom elements
// begin displaycountdown.js
const countdownTextDisplay = document.getElementById(LISTPAGE_DOM_IDS.countdownTextDisplay);

const countdownList = document.getElementById(LISTPAGE_DOM_IDS.countdownList);
let arrayOfCountdowns = fetchArrayOfCountdowns();





/**
 * update countdown status for non elapsed countdowns
 */
async function updateCountdownItems() {
    let activeCountItems = document.querySelectorAll('.countdown-counting')
    const clock = new Clock();
    if (activeCountItems.length) {
        await activeCountItems.forEach((element, _, countItems) => {
            clock.setEndDate(new Date(element.getAttribute('data-date')));
            clock.countDown();
            if (clock.getDistance() > 0) {
                setInnerHtmlForNotNull(element, getCountdownString(clock))
            } else if (element.getAttribute('data-repeat') == 'true') {
                console.log('updating repeat', element);
                // update repeat item set enddate to next year
                let index = arrayOfCountdowns.findIndex((countdown) => countdown.dateModified == element.getAttribute('data-id'));
                let date = element.getAttribute('data-date');
                if (index && date) {
                    updateRepeatCountdown(arrayOfCountdowns, date, index);
                    displayAndStartcount();
                }
                //         arrayOfCountdowns[index].date = new Anniversary(new Date(countdown.date)).endDate.toISOString();
                // arrayOfCountdowns[index].dateModified = new Date().toISOString();

            } else {
                console.log('elapsing', arrayOfCountdowns.find((countdown) => countdown.dateModified == element.getAttribute('data-id')));
                element.classList.remove('countdown-counting')
                setInnerHtmlForNotNull(element, 'Elapsed')
            }

        });
    } else {
        setCountItemExists(false)
    }
}
/**
 * display countdowns and start updating display for countdowns in progress
 */
function displayAndStartcount() {
    displayCountdowns().then(() => {
        if (getCountItemExists()) {
            let interval = setInterval(() => getCountItemExists() ? updateCountdownItems() : clearInterval(interval), 1000)
        }
    }).catch((err) => {
        console.log(err);
        errorHandler('Unable to display your countdowns');
    });
}







/**
 * List Click event listener for the countdowns, context menu and items
 * @param {Event} event 
 */
const listEventListener = event => {
    const targetElement = event.target;

    // if event is fired on text or date
    if (isTargetElementOnCountdownItem(targetElement)) {
        console.log(targetElement,'parent', targetElement.parentElement);
        
        // let targetIndex = targetElement.parentElement.getAttribute('data-index');
        let targetIndex = getArrayIndexByDateModified(arrayOfCountdowns,targetElement.parentElement.getAttribute('data-id'))
        // todo: find a better way of accessing element in countdown array
        console.log(targetIndex)
        showClockRow();
        updateClockAndText(arrayOfCountdowns[targetIndex].date, arrayOfCountdowns[targetIndex].text)
    }
    //if the area for context menu is clicked
    else if (isTargetElementOnContextMenu(targetElement)) {
        //get the countdown list item and pass to function, search for list class .menu
        //in case of directly clicking on icon, parent element is .countdown-list-options div
        triggerContextMenu(targetElement.parentElement);

    } else if (isClassOnTargetElement(targetElement,'menu-opts')) {
        let count_modified = targetElement.parentElement.getAttribute('data-id');
        if ( isClassOnTargetElement(targetElement,'main')) {
            // set as main clicked
            // find the element convert to JSON and place it as the main clock
            const countdown = arrayOfCountdowns.find((countdown) => countdown.dateModified == count_modified);
            setMainClockCountdown(countdown);
            
        
        } else if (isClassOnTargetElement(targetElement,'del') ) {
            arrayOfCountdowns = arrayOfCountdowns.filter((countdown, index) => countdown.dateModified != count_modified);
            saveCountDownList(arrayOfCountdowns);
            setInnerHtmlForNotNull(countdownList, populateList(arrayOfCountdowns));
            // console.log('delete clicked', targetElement.parentElement, arrayOfCountdowns[targetElement.parentElement.getAttribute('data-index')]);
        } else if (isClassOnTargetElement(targetElement,'edit')) {
            let editItem = arrayOfCountdowns.find((countdown, index) => countdown.dateModified == count_modified);
            // todo: custom error messages for components on fail
            try {
                if (editItem) {
                    console.log('Edit clicked', editItem);
                    let repeat = false;
                    if (editItem.hasOwnProperty('repeat')) {
                        repeat = editItem.repeat;
                    }
                    displayFormPopUp(editItem.text, /\d+-\d+-\d+T\d+:\d+/.exec(editItem.date), count_modified, repeat);
                    handleFormUpdate();
                } else {
                    console.log( 'something went wrong with the editing');
                    errorHandler('Unable to edit countdown');
                    console.log(editItem);
                }
            } catch (err) {
                console.log(err, 'Error in form display');
                errorHandler('Error in form display');
            }


        }
    }
}
function addListEventListener() {
    const countList = document.querySelector('.countdown-list')
    countList.removeEventListener('click', listEventListener)
    countList.addEventListener('click', listEventListener)
}







// todo: move this function to form update.js
export function handleFormUpdate() {
    // todo: update list with custom fired events
    const submitbutton = document.getElementById(CONSTANT_IDS.form_submitButton);


    submitbutton.addEventListener('click', (e) => {
        e.preventDefault();
        submitbutton.disabled = true;
        // get text field values, with auto values
        let userText = document.getElementById(CONSTANT_IDS.form_TextInput).value;
        const modifiedTime = document.getElementById(CONSTANT_IDS.form_modifiedTime).value;
        let userDate = document.getElementById(CONSTANT_IDS.form_dateInput).value;
        let repeatCheck = document.getElementById(CONSTANT_IDS.form_repeatCheckBox);
        if (!userText) {
            userText = userTextField.placeholder;
            countNumber++;
            localStorage.setItem('countNumber', countNumber)
        }

        userDate = new Date(userDate);
        let countItem = { text: userText, date: userDate, dateModified: new Date() };
        if (repeatCheck) {
            countItem.repeat = repeatCheck.checked;
        }

        updateLocalItem(arrayOfCountdowns, countItem, modifiedTime);
        displayCountdowns();
        closeFormPopUp();
        removeClockAndText();
        
    })
}



function addEventHandlers() {
    addListEventListener();
    // add context menu event listener
    document.querySelector('.container').addEventListener("click", hideContextMenus);
}

export async function displayAndAddListeners() {
    await displayAndStartcount()
    // sortUI();
    addEventHandlers();
}
try {
    displayAndAddListeners();
} catch (err) {
    console.log(err, 'err in display countdown initialisation');
    errorHandler("Unable to fetch your countdowns");
}

