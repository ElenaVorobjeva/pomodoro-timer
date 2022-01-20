let playButton = document.querySelector(".play");
let pauseButton = document.querySelector(".pause");
let clearButton = document.querySelector(".clear");
let settingButton = document.querySelector(".setting-btn");
let mainBlock = document.querySelector("main");
let settingBlock = document.querySelector(".setting");
let minutesBlock = document.querySelector(".minutes");
let secondsBlock = document.querySelector(".seconds");
let timeBlock = document.querySelector(".time-block");
let currentIntervalBlock = document.querySelector(".current-interval");
let allIntervalsBlock = document.querySelector(".all-intervals");
let currentRoundIntervalBlock = document.querySelector(".current-round-interval");
let allRoundIntervalsBlock = document.querySelector(".all-round-intervals");
let taskBlock = document.querySelector(".task");
let closeButton = document.querySelector(".close");

settingButton.onclick = function () {
    settingBlock.style.display = 'block';
    mainBlock.style.display = 'none';
}

closeButton.onclick = function () {
    mainBlock.style.display = 'flex';
    settingBlock.style.display = 'none';
}

function setInitialValue() {
    document.querySelector("#work-time").value = 25;
    document.querySelector("#short-break-time").value = 5;
    document.querySelector("#long-break-time").value = 30;
    document.querySelector("#work-in-round").value = 4;
    document.querySelector("#work-at-the-day").value = 12;
}

function initialState() {
    setInitialValue();
    minutesBlock.innerHTML = leadZero(document.querySelector("#work-time").value);
    secondsBlock.innerHTML = "00";
    currentRoundIntervalBlock.innerHTML = "1";
    allRoundIntervalsBlock.innerHTML = document.querySelector("#work-in-round").value;
    currentIntervalBlock.innerHTML = "1";
    allIntervalsBlock.innerHTML = document.querySelector("#work-at-the-day").value;
    taskBlock.innerHTML = "Время поработать!";
}

initialState();

let now_seconds = 0; // сколько секунд прошло
let now_round_times = 0;
let now_times = 0;
let interval_type = 'work'; // режим работы таймера
let intervalVariable; // id таймера
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
    if (interval_type == 'work') {
        if (timer_params.time_work - now_seconds > 0) {
            timeBlock.style.color = '#F6FB00'; //yellow
            taskBlock.innerHTML = "Время поработать!";
            renderTimerNums(timer_params.time_work - now_seconds);
            now_seconds++;
        }
        else {
            renderTimerNums(0);
            now_seconds = 0;
            if (now_times % timer_params.round_interval_count == 0) interval_type = 'long_rest'
            else interval_type = 'short_rest';
        }
    }
    else if (interval_type == 'short_rest') {
        if (timer_params.time_short_rest - now_seconds > 0) {
            timeBlock.style.color = '#00FB19'; //green
            taskBlock.innerHTML = "Время отходнуть!";
            renderTimerNums(timer_params.time_short_rest - now_seconds);
            now_seconds++;
        }
        else {
            renderTimerNums(0);
            now_seconds = 0;
            now_round_times++;
            now_times++;
            if (now_times > timer_params.interval_count) {
                currentRoundIntervalBlock.innerHTML = timer_params.round_interval_count;
                currentIntervalBlock.innerHTML = timer_params.interval_count;
                let event = new Event("click");
                pauseButton.dispatchEvent(event);
                now_seconds = 0;
                timeBlock.style.color = '#FFFFFF';
            }
            else {
                currentRoundIntervalBlock.innerHTML = now_round_times;
                currentIntervalBlock.innerHTML = now_times;
            }
            interval_type = 'work';
        }
    }
    else if (interval_type == 'long_rest') {
        if (timer_params.time_long_rest - now_seconds > 0) {
            timeBlock.style.color = '#00FB19'; //green
            taskBlock.innerHTML = "Время длинного перерыва!";
            renderTimerNums(timer_params.time_long_rest - now_seconds);
            now_seconds++;
        }
        else {
            renderTimerNums(0);
            now_seconds = 0;
            now_round_times = 1;
            now_times++;
            if (now_times > timer_params.interval_count) {
                currentRoundIntervalBlock.innerHTML = timer_params.round_interval_count;
                currentIntervalBlock.innerHTML = timer_params.interval_count;
                let event = new Event("click");
                pauseButton.dispatchEvent(event);
                now_seconds = 0;
                timeBlock.style.color = '#FFFFFF';
            }
            else {
                currentRoundIntervalBlock.innerHTML = now_round_times;
                currentIntervalBlock.innerHTML = now_times;
            }
            interval_type = 'work';
        }
    }
}

playButton.onclick = function () {
    playButton.style.display = 'none';
    pauseButton.style.display = 'block';

    timer_minutes = minutesBlock.innerHTML;
    timer_seconds = secondsBlock.innerHTML;
    now_round_times = +currentRoundIntervalBlock.innerHTML;
    now_times = +currentIntervalBlock.innerHTML;

    let timer_params = {};
    timer_params.time_work = document.querySelector("#work-time").value * 60;
    timer_params.time_short_rest = document.querySelector("#short-break-time").value * 60;
    timer_params.time_long_rest = document.querySelector("#long-break-time").value * 60;
    timer_params.round_interval_count = +document.querySelector("#work-in-round").value;
    timer_params.interval_count = +document.querySelector("#work-at-the-day").value;

    if (now_round_times >= timer_params.round_interval_count) {
        now_round_times = 1;
        currentRoundIntervalBlock.innerHTML = now_round_times;
    }

    if (now_times >= timer_params.interval_count) {
        now_round_times = 1;
        now_times = 1;
        currentRoundIntervalBlock.innerHTML = now_round_times;
        currentIntervalBlock.innerHTML = now_times;
    }

    intervalVariable = setInterval(timerTick, 1000, timer_params);

    return false;
}

pauseButton.onclick = function () {
    pauseButton.style.display = 'none';
    playButton.style.display = 'block';

    clearInterval(intervalVariable);

    return false;
}

clearButton.onclick = function () {
    let event = new Event("click");
    pauseButton.dispatchEvent(event);

    interval_type = 'work';
    timeBlock.style.color = '#FFFFFF';
    now_seconds = 0;
    now_times = 0;

    initialState();

    return false;
}


document.querySelectorAll(".minus").forEach(function (minusBlock) {
    minusBlock.addEventListener("click", function () {
        let input = minusBlock.parentNode.querySelector("input");
        if (input.value > 1) --input.value;
    });
});

document.querySelectorAll(".plus").forEach(function (plusBlock) {
    plusBlock.addEventListener("click", function () {
        let input = plusBlock.parentNode.querySelector("input");
        if (input.value < 60) ++input.value;
    });
});

document.querySelector(".clear-setting").addEventListener("click", setInitialValue);
