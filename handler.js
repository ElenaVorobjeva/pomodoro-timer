let playButton    = document.querySelector(".play");
let pauseButton   = document.querySelector(".pause");
let clearButton   = document.querySelector(".clear");
let settingButton = document.querySelector(".setting-btn");
let mainBlock     = document.querySelector("main");
let settingBlock  = document.querySelector(".setting");
let minutesBlock  = document.querySelector(".minutes");
let secondsBlock  = document.querySelector(".seconds");
let timeBlock = document.querySelector(".time-block");
let currentIntervalBlock = document.querySelector(".current-interval");
let allIntervalsBlock = document.querySelector(".all-intervals");
let taskBlock = document.querySelector(".task");
let closeButton   = document.querySelector(".close");

settingButton.onclick = function() {
    settingBlock.style.display='block';
    mainBlock.style.display='none';
}

closeButton.onclick = function() {
    mainBlock.style.display='flex';
    settingBlock.style.display='none';
}

function initialState() {
    minutesBlock.innerHTML = leadZero(document.querySelector("#work-time").value);
    secondsBlock.innerHTML = "00";
    currentIntervalBlock.innerHTML = "1";
    allIntervalsBlock.innerHTML = document.querySelector("#work-at-the-day").value;
    taskBlock.innerHTML = "Время поработать!";

}

initialState();

let now_seconds = 0; // сколько секунд прошло
let now_times = 0;
let interval_type = 'work'; // режим работы таймера
let intervalVariable; // id таймера
let seconds_1 = 0; // количество секунд в таймере
let timer_minutes = 0; // начальные значения счетчиков минут
let timer_seconds = 0; // --//-- секунд

function secondsToTime(seconds) {
    let m = Math.floor(seconds / 60 % 60);
    let s = seconds % 60;

    return {
        'minutes': leadZero(m), 
        'seconds': leadZero(s)
    };
}

function leadZero(num) {
    return ("0" + num).slice(-2);
}

function renderTimerNums(seconds) {
    let timer_nums = secondsToTime(seconds);
    minutesBlock.innerHTML = timer_nums.minutes;
    secondsBlock.innerHTML = timer_nums.seconds;
    document.title = timer_nums.minutes + ":" + timer_nums.seconds + " - MyTimer";
}

function timerTick(timer_params) {
    console.log("now_seconds = " + now_seconds);
    if(interval_type == 'work') {
        console.log("if interval type is work");
        if(timer_params.time_work - now_seconds > 0) {
            console.log('time to work is not end yet');
            console.log("timer_params.time_work - now_seconds = " + (timer_params.time_work - now_seconds));
            timeBlock.style.color = '#F6FB00'; //yellow
            taskBlock.innerHTML = "Время поработать!";
            renderTimerNums(timer_params.time_work - now_seconds);
            now_seconds++;
        }
        else {
            console.log('time to work is end');
            renderTimerNums(0);
            now_seconds = 0;
            interval_type = 'short_rest';
        }
    }
    else if(interval_type == 'short_rest') {
        console.log("if interval type is short rest");
        if(timer_params.time_short_rest - now_seconds > 0) {
            console.log('time to rest is not end yet');
            console.log("timer_params.time_short_rest - now_seconds = " + (timer_params.time_short_rest - now_seconds));
            timeBlock.style.color = '#00FB19'; //green
            taskBlock.innerHTML = "Время отходнуть!";
            renderTimerNums(timer_params.time_short_rest - now_seconds);
            now_seconds++;
        }
        else {
            console.log('time to rest is end');
            renderTimerNums(0);
            now_seconds = 0;
            now_times++;
            console.log("now_times = " + now_times);
            if(now_times > timer_params.interval_count) {
                console.log("all round is end");
                currentIntervalBlock.innerHTML = timer_params.interval_count;
                let event = new Event("click");
                pauseButton.dispatchEvent(event);
                now_seconds = 0;
                timeBlock.style.color = '#FFFFFF';
            }
            else {
                console.log("all round is not end");
                currentIntervalBlock.innerHTML = now_times;
            }
            interval_type = 'work';
        }
    }
}

playButton.onclick = function() {
    playButton.style.display='none';
    pauseButton.style.display='block';

    timer_minutes = minutesBlock.innerHTML;
    timer_seconds = secondsBlock.innerHTML;
    now_times = +currentIntervalBlock.innerHTML;
    console.log("timer_minutes = " + timer_minutes);
    console.log("timer_seconds = " + timer_seconds);
    console.log("now_times = " + now_times);

    let timer_params = {};
    timer_params.time_work = document.querySelector("#work-time").value * 60;
    timer_params.time_short_rest = document.querySelector("#short-break-time").value * 60;
    timer_params.interval_count = +document.querySelector("#work-at-the-day").value;

    console.log("timer_params.time_work = " + timer_params.time_work);
    console.log("timer_params.time_short_rest = " + timer_params.time_short_rest);
    console.log("timer_params.interval_count = " + timer_params.interval_count);

    

    if(now_times >= timer_params.interval_count) {
        console.log("if all of rounds are end");
        now_times = 1;
        currentIntervalBlock.innerHTML = now_times;
    }

    if(interval_type == 'work') {
        console.log("if interval type is work");
        timeBlock.style.color = '#F6FB00'; //yellow
        seconds_1 = timer_params.time_work;
        console.log("seconds_1 = " + seconds_1);
    }
    else if(interval_type == 'short_rest') {
        console.log("if interval type is short rest");
        timeBlock.style.color = '#00FB19'; //green
        seconds_1 = timer_params.time_short_rest;
        console.log("seconds_1 = " + seconds_1);
    }

    intervalVariable = setInterval(timerTick, 1000, timer_params);

    return false;
}

pauseButton.onclick = function(event, params) {
    pauseButton.style.display='none';
    playButton.style.display='block';

    clearInterval(intervalVariable);

    return false;
}

clearButton.onclick = function() {
    let event = new Event("click");
    pauseButton.dispatchEvent(event);

    interval_type = 'work';
    timeBlock.style.color = '#FFFFFF';
    now_seconds = 0;
    now_times = 0;

    initialState();

    return false;
}