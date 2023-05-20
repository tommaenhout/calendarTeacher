import {DateTime} from 'https://cdn.jsdelivr.net/npm/luxon@3.3.0/+esm'


let count = 0;
const date = DateTime.local().plus({weeks: count}).toJSDate();
const offset = date.getTimezoneOffset();
const day = date.getDay(); //sunday is 0
const year = date.getFullYear();
const month = date.getMonth();
const dayOfMonth = date.getDate();
// days of the week
const days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let reservations = [];


function Reservation (name, date, time) {
    this.name = name;
    this.date = date;
    this.time = time;
}

document.getElementById('date').innerHTML = `Date today: ${days[day]}, ${months[month]} ${dayOfMonth}, ${year}`
document.getElementById('timezone').innerHTML = `Timezone: GMT${offset < 0 ? "+" : "-"}${Math.abs(offset/60) > 9 ? 1 : 0}${offset/60}`
let week = {}
week = setButtonsPreviousAndNextWeek()
week = setDaysOfWeek(day, count)


function setDaysOfWeek(day, count,date) {
    // calendar logic is set here. Logic all starts with today's date and then it's set to the day of the week
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
    loadReservations(weekTotal)
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
    // every moment on the calender is clickable and will open a modal
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
    const modalBody = document.querySelector('.modal-body')
    const modalTitle = document.querySelector('.modal-title')
    const modalFooter = document.querySelector('.modal-footer')
    modalTitle.innerHTML = `<h5 class="modal-title" id="staticBackdropLabel">Schedule class</h5>`
    let index = days.indexOf(day)
    // sunday as other logic for the index
    index = index === 0 && date.getDay() === 0 ? 7 : index
    let dayOfTheWeekSelected = week[index]
    // show modal with name saved in local storage
    modalBody.innerHTML =`
    <p>${dayOfTheWeekSelected} hour: ${id/2}</p>
    <form>
        <label hidden for="name" class="form-label">name</label>
        <input value=${localStorage.getItem("nameStudent")} class="form-control" id="name" placeholder="name student"></input>
        <label hidden for= "from" class="form-label">from</label>
        <select class="form-control" id="from" placeholder="from" >
            <option value="1">0.5 hour</option>
        </select>
    </form>
    `
    modalFooter.innerHTML = `
    <div class="button-close" data-bs-dismiss="modal">Close</div>
    <div class="button-close" data-bs-dismiss="modal">Schedule lesson</div>`

    activateButton(dayOfTheWeekSelected, id, week)
}

function setButtonsPreviousAndNextWeek () {
    //buttons to navigate the calendar
    week = setButton(".previous", false)
    week = setButton(".next", true) 
    return week
    
}

function setButton (button, next) {
    //button to navigate the calendar
    document.querySelector(button).addEventListener('click', () => {
        next ? count++ : count--;
        const date = DateTime.local().plus({weeks: count}).toJSDate();
        const day = date.getDay();
        let week = setDaysOfWeek(day, count, date)
        loadReservations(week)
        return week
    })
}

function loadReservations (week) {
    getReservations(week)

}

function activateButton (date, time, week) {
    // when user clicks the button schedule lesson, it will create a new reservation
    document.querySelector('.modal-footer > div:nth-child(2)').addEventListener('click', () => {
        const name = document.querySelector('#name').value
        let reservation = new Reservation(name, date, time)
        // localStorage setItem
        localStorage.setItem(`nameStudent`, JSON.stringify(reservation.name))
        postReservation(reservation, week)
    })
}

function daysOfTheweekGenerator (untilNegative,date) {
    // setting the days of the week in the heading part of the calendar
    let negativeNumber = untilNegative;
    let positiveNumber = 1;
    // in case if it's sunday, it will be another logic
    if (untilNegative === 6) {
       negativeNumber = -1
    }
    for (let i = 0; i < 7; i++){
        if(i < untilNegative){
            document.querySelector(`#title${days[day-negativeNumber]}`).innerHTML= `<h3>${date.minus({days: negativeNumber, week: untilNegative === 6 ? 1 : 0}).toJSDate().getDate()}</h3>`
            negativeNumber--
        }
        else if (i === untilNegative){
            document.querySelector(`#title${days[day]}`).innerHTML= `<h3>${date.toJSDate().getDate()}</h3>`
        }
        else {
            if(i !== 6) {
                document.querySelector(`#title${days[day+positiveNumber]}`).innerHTML= `<h3>${date.plus({days: positiveNumber}).toJSDate().getDate()}</h3>`
            }else {
                document.querySelector(`#title${days[day-untilNegative-1]}`).innerHTML= `<h3>${date.plus({days: positiveNumber}).toJSDate().getDate()}</h3>`
            }            
            positiveNumber++
        }
    }
}

function generateWeekArray (date, untilNegative) {
    // we generate the week visibile in the calendar
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


async function postReservation (reservation, week) {
    // please don't forget to npm install axios before running this code


    await axios.post('https://calendarback-production-4a4b.up.railway.app/reservations', {
        nameStudent: reservation.name,
        date: reservation.date,
        time: reservation.time
    })
        .then(function (response) {
             Swal.fire(
                'Appointment added!',
                'You succesfully added an appointment!',
                'success'
              ) 
            loadReservations(week)
          })
        .catch(function (error) {     
    })
}

async function getReservations (week) {
    // please don't forget to npm install axios before running this code
    let reservations = []
    await axios.get('https://calendarback-production-4a4b.up.railway.app/reservations')
        .then(function (response) {
             reservations = response.data
           
            showReservations(week, reservations) 
        })
        .catch(function (error) {
        console.log(error);        
    })
}

function showReservations (week, reservations) {
    let i = 0;
    let arrayTrueMomentsForThisWeek = []
   
    // empty calendar before showing the reservations
    emptyWeek()
    reservations.forEach(reservation => {
        const dateReservation = DateTime.fromISO(reservation.date)
        let dayIndexReservaton = dateReservation.toJSDate().getDay()
        const hourReservation = reservation.time
        const nameStudent = reservation.nameStudent
        const dayNameReservation = days[dayIndexReservaton]

        // sunday as other logic for the index
        let index =  dayIndexReservaton === 0 && day === 0 ? 7  :  dayIndexReservaton
        let currentDateOnCalendar = week[index]

        // make variables to compare the day of the week visible on the calendar with the day of the week provided by the reservation
        let compareCurrent = currentDateOnCalendar.c
        let compareReservation = dateReservation.c

        //compare the variables / if true show the name of the student on the calendar

       
        if (compareCurrent.year === compareReservation.year && compareCurrent.month === compareReservation.month  && compareCurrent.day === compareReservation.day) {
            //set name student in calendar
        document.querySelector(`#${dayNameReservation} > div:nth-child(${hourReservation+1})`).innerText = `${nameStudent}`
            arrayTrueMomentsForThisWeek.push(hourReservation+1, dayNameReservation, compareCurrent.day)
         
        } else {
            // if there is no match we set this moment to empty when it's not in the true moments array
            let isNotInArray = !arrayTrueMomentsForThisWeek.includes(hourReservation+1, dayNameReservation)
            if (isNotInArray) {
                document.querySelector(`#${dayNameReservation} > div:nth-child(${hourReservation+1})`).innerText = ''
            }
        }
    })
}


function emptyWeek () {
    // function to clear the calendar of reservations  (we need to do this before showing the reservations)
    var mondayDivs = document.querySelectorAll('#Monday div[id]');
    var tuesdayDivs = document.querySelectorAll('#Tuesday div[id]');
    var wednesdayDivs = document.querySelectorAll('#Wednesday div[id]');
    var thursdayDivs = document.querySelectorAll('#Thursday div[id]');
    var fridayDivs = document.querySelectorAll('#Friday div[id]');
    var saturdayDivs = document.querySelectorAll('#Saturday div[id]');
    var sundayDivs = document.querySelectorAll('#Sunday div[id]');
    let divs = [sundayDivs, mondayDivs, tuesdayDivs, wednesdayDivs, thursdayDivs, fridayDivs, saturdayDivs]
    divs.forEach(div => {
        div.forEach(div => {
            div.innerHTML = ''
        })
    })
}
















 






