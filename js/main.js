
import {DateTime} from 'https://cdn.jsdelivr.net/npm/luxon@3.3.0/+esm'

let count = 0;
const date = DateTime.local().plus({weeks: count}).toJSDate();
const offset = date.getTimezoneOffset();
const day = date.getDay();
const year = date.getFullYear();
const month = date.getMonth();
const dayOfMonth = date.getDate();
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function Appointment (name, date, time) {
    this.name = name;
    this.date = date;
    this.time = time;
}

document.getElementById('date').innerHTML = `Date today: ${days[day]}, ${months[month]} ${dayOfMonth}, ${year}`
document.getElementById('timezone').innerHTML = `Timezone: GMT${offset < 0 ? "+" : "-"}${Math.abs(offset/60) > 9 ? 1 : 0}${offset/60}`
let week = null
week = setButtonsPreviousAndNextWeek()
week = setDaysOfWeek(day, count)
activateCalenderHours(week)
loadAppointments()


function setDaysOfWeek(day, count,date) {
    date = DateTime.local().plus({weeks: count});
    setToday(count, day);
    setMonth(date);
    let weekTotal = [];
    switch (days[day]) {
        case 'Monday':
            weekTotal = generateWeekArray(date,0)
            daysOfTheweekGenerator(0,date)
            break;
        case 'Tuesday':
            weekTotal = generateWeekArray(date,1)
            daysOfTheweekGenerator(1,date)
            break;
        case 'Wednesday':
            weekTotal = generateWeekArray(date,2)
            daysOfTheweekGenerator(2,date)
            break;
        case 'Thursday':
            weekTotal = generateWeekArray(date,3)
            daysOfTheweekGenerator(3,date)
            break;
        case 'Friday':
            weekTotal = generateWeekArray(date,4)
            daysOfTheweekGenerator(4,date)
            break;
        case 'Saturday':
            weekTotal = generateWeekArray(date,5)
            daysOfTheweekGenerator(5,date)
            break;
        case 'Sunday':
            weekTotal = generateWeekArray(date,6)         
            daysOfTheweekGenerator(6,date)
            break;  
    }
    activateCalenderHours(weekTotal)
    return weekTotal;
}

function setToday( count, day){
    if (count === 0) {
        document.getElementById(days[day]).className = "today";
    } else {
        document.getElementById(days[day]).className = "";
    }
}

function setMonth (date) {
    const monthCalendar = date.toJSDate().getMonth();
    document.getElementById('month').innerHTML = `Month: ${months[monthCalendar]}`
}

function activateCalenderHours (week) {
    days.forEach(day => {
        const children = document.querySelectorAll(`#${day} > div`)
    children.forEach(child => {
        child.addEventListener('click', () => {
            openModal(parseInt(child.id), day, week)
        })
    })
}
)}

function openModal (id,day,week) {
    console.log(id, day)
    const modalBody = document.querySelector('.modal-body')
    const modalTitle = document.querySelector('.modal-title')
    const modalFooter = document.querySelector('.modal-footer')
    modalTitle.innerHTML = `<h5 class="modal-title" id="staticBackdropLabel">Schedule class</h5>`
    let index = days.indexOf(day)
    console.log(index)
    console.log(week)
    let dayOfTheWeekSelected = week[index]
    modalBody.innerHTML =`
    <p>${dayOfTheWeekSelected} hour: ${id/2}</p>
    <form>
        <label hidden for="name" class="form-label">name</label>
        <input class="form-control" id="name" placeholder="name student"></input>
        <label hidden for= "from" class="form-label">from</label>
        <select class="form-control" id="from" placeholder="from" >
            <option value="1">1 hour</option>
            <option value="2">2 hours</option>
            <option value="3">3 hours</option>
        </select>
    </form>
    `
    modalFooter.innerHTML = `
    <div data-bs-dismiss="modal">Close</div>
    <div data-bs-dismiss="modal">Schedule lesson</div>`

    activateButton(dayOfTheWeekSelected, id)
}

function setButtonsPreviousAndNextWeek () {
    week = setButton(".previous", false)
    week = setButton(".next", true)
    return week
    
}

function setButton (button, next) {
    document.querySelector(button).addEventListener('click', () => {
        next ? count++ : count--;
        const date = DateTime.local().plus({weeks: count}).toJSDate();
        const day = date.getDay();
        let week = setDaysOfWeek(day, count, date) 
        console.log(week)
        return week
    })
}

function loadAppointments () {
    console.log("fetching appointments...")

}

function activateButton (date, time) {
    document.querySelector('.modal-footer > div:nth-child(2)').addEventListener('click', () => {
        const name = document.querySelector('#name').value
        let appointment = new Appointment(name, date, time)
        console.log(appointment)
    })
}

function daysOfTheweekGenerator (untilNegative,date) {
    let negativeNumber = untilNegative;
    let positiveNumber = 1;
    for (let i = 0; i < 7; i++){
        if(i < untilNegative){
            document.querySelector(`#title${days[day-negativeNumber]}`).innerHTML= `<h3>${date.minus({days: negativeNumber}).toJSDate().getDate()}</h3>`
            negativeNumber--
        }
        else if (i === untilNegative){
            console.log("equal" + i)
            document.querySelector(`#title${days[day]}`).innerHTML= `<h3>${date.toJSDate().getDate()}</h3>`
        }
        else {
            if(i !== 6) {
                console.log("positive" + i + positiveNumber)
                document.querySelector(`#title${days[day+positiveNumber]}`).innerHTML= `<h3>${date.plus({days: positiveNumber}).toJSDate().getDate()}</h3>`
            }else {
                console.log("positive" + i + positiveNumber)
                document.querySelector(`#title${days[day-untilNegative-1]}`).innerHTML= `<h3>${date.plus({days: positiveNumber}).toJSDate().getDate()}</h3>`
            }            
            positiveNumber++
        }
    }
}


function generateWeekArray (date, untilNegative) {
        let positiveNumber = 1;
        let negativeNumber = untilNegative;
        let monday = null
        let tuesday = null
        let wednesday = null
        let thursday = null
        let friday = null
        let saturday = null
        let sunday = null
        let week = [sunday, monday, tuesday, wednesday, thursday, friday, saturday]
        for (let i = 0; i < 7; i++){
            if(i < untilNegative){
                week[i+1] = date.minus({days: negativeNumber})
                negativeNumber--
            }
            else if (i === untilNegative){
               week[i+1] = date
            }
            else {
                if(i !== 6) {
                    week[i+1] = date.plus({days: positiveNumber})
                }else {
                    week[0] = date.plus({days: positiveNumber})
                }
                positiveNumber++
            }
        }
    return week
}

