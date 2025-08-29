"use strict"

const modesManual = document.querySelector('.pomodoro-modes-manual');
const modesAuto = document.querySelector('.pomodoro-modes-auto');

const pomodoroModesAuto = document.querySelectorAll('.mode-button-auto');

const pomodoroModeManual = document.getElementById('pomodoro-mode-manual');
const shortBreakModeManual = document.getElementById('short-break-mode-manual');
const longBreakModeManual = document.getElementById('long-break-mode-manual');

const timer = document.querySelector('.pomodoro-timer');
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');

const startPauseBtn = document.querySelector('.control-start-pause');
const resetBtn = document.querySelector('.control-reset');
const settingsBtn = document.querySelector('.control-settings');

const toggleMode = document.querySelector('.toggler');
const switchMessage = document.querySelector('.switch-mode-message');

const modalSettings = document.querySelector('.modal-settings');
const cancelModalButton = document.querySelector('.cancel-modal-button');
const saveModalButton = document.querySelector('.save-modal-button');

const tomatoes = document.querySelectorAll('.pomodoro-cycle-tomatoes img');
const totalTomatoesCounter = document.querySelector('.total-tomatoes-counter');
const tomatoesBlock = document.querySelector('.pomodoro-cycle-tomatoes');

const playText = document.querySelector('.play-text');
const pauseText = document.querySelector('.pause-text');

const nextModeArrow = document.querySelector('.control-next');

const pomodoroTimeInput = document.getElementById('pomodoro-time-input');
const shortBreakimeInput = document.getElementById('shortBreak-time-input');
const longBreakimeInput = document.getElementById('longBreak-time-input');

const alarmSound = new Audio('sounds/alarm-coin.wav');


let timerId = null;
let isRunning = false;


function formatTime(time) {
  return time < 10 ? '0' + time : time;
}

function toggleHiddenText(isPlaying) {
  playText.classList.toggle('hidden', isPlaying);
  pauseText.classList.toggle('hidden', !isPlaying);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

function generateModesCycle() {
  const pomodoroTime = parseInt(pomodoroTimeInput.value, 10);
  const shortBreakTime = parseInt(shortBreakimeInput.value, 10);
  const longBreakTime = parseInt(longBreakimeInput.value, 10);

  return [
    {name: 'pomodoro', minutes: pomodoroTime, seconds: 0, done: false},
    {name: 'shortBreak', minutes: shortBreakTime, seconds: 0, done: false},
    {name: 'pomodoro', minutes: pomodoroTime, seconds: 0, done: false},
    {name: 'shortBreak', minutes: shortBreakTime, seconds: 0, done: false},
    {name: 'pomodoro', minutes: pomodoroTime, seconds: 0, done: false},
    {name: 'shortBreak', minutes: shortBreakTime, seconds: 0, done: false},
    {name: 'pomodoro', minutes: pomodoroTime, seconds: 0, done: false},
    {name: 'longBreak', minutes: longBreakTime, seconds: 0, done: false},
  ];
}

let  modesCycle = generateModesCycle();

let indexMode = 0;
let currentMode = modesCycle[indexMode];
let currentTimerMode = 'auto';

let modeDurationMinutes = modesCycle[indexMode].minutes;
let modeDurationSeconds = modesCycle[indexMode].seconds;

let remainingMinutes = modeDurationMinutes;
let remainingSeconds = modeDurationSeconds;

function playAlarm() {
  alarmSound.currentTime = 0;
  alarmSound.play().catch(error => {
    console.log('Автозапуск звука заблокирован:', error);
  });
}

function updateModeButtonDecoration() {
  pomodoroModesAuto.forEach(mode => mode.classList.remove('currentMode'));
  switch (currentMode.name) {
    case 'pomodoro':
      pomodoroModesAuto[0].classList.add('currentMode');
      break;
    case 'shortBreak':
      pomodoroModesAuto[1].classList.add('currentMode');
      break;
    case 'longBreak':
      pomodoroModesAuto[2].classList.add('currentMode');
      break;
  }
}

function updateModeButtonDecorationManual() {
  switch (currentMode.name) {
    case 'pomodoro':
      pomodoroModeManual.checked = true;
      indexMode = 0;
      break;
    case 'shortBreak':
      shortBreakModeManual.checked = true;
      indexMode = 1;
      break;
    case 'longBreak':
      longBreakModeManual.checked = true;
      indexMode = 7;
      break;
  }
}

function startTimer() {
  isRunning = true;

  timerId = setInterval(() => {

    if (remainingSeconds === 0) {
      if (remainingMinutes === 0) {
        isRunning = false;
        stopTimer();
        toggleHiddenText(false);
        playAlarm();
        if (currentTimerMode === 'auto') {
          nextMode();
          return;
        } else {
          switchMode(currentMode);
          if (currentMode.name === 'pomodoro') {
            totalTomatoes++;
            totalTomatoesCounter.textContent = totalTomatoes;
          }
          return;
        }
      }
      remainingMinutes--;
      remainingSeconds = 59;

    } else {
      remainingSeconds--;
    }

    minutes.textContent = formatTime(remainingMinutes);
    seconds.textContent = formatTime(remainingSeconds);

  }, 1000);
}

function resetTimer() {
  stopTimer();
  isRunning = false;
  toggleHiddenText(false);
  remainingMinutes = modeDurationMinutes;
  remainingSeconds = modeDurationSeconds;
  minutes.textContent = formatTime(modeDurationMinutes);
  seconds.textContent = formatTime(modeDurationSeconds);
}

function switchMode(modeObj) {
  stopTimer();
  isRunning = false;

  modeDurationMinutes = modeObj.minutes;
  modeDurationSeconds = modeObj.seconds;
  remainingMinutes = modeDurationMinutes;
  remainingSeconds = modeDurationSeconds;
  minutes.textContent = formatTime(modeDurationMinutes);
  seconds.textContent = formatTime(modeDurationSeconds);

  toggleHiddenText(false);

  if (currentTimerMode === 'auto') {
    startTimer();
    toggleHiddenText(true);
  } 
}

let cycleTomatoes = 0;
let totalTomatoes = 0;

function updateTomatoes() {

  if (cycleTomatoes > 0) {
    tomatoes[cycleTomatoes-1].setAttribute('src', `./images/tomatoes/tomato-red.png`);
  } else {
    tomatoes.forEach(tomato => tomato.setAttribute('src', `./images/tomatoes/tomato-gray.png`));
  }
}

function nextMode() {
  stopTimer();
  isRunning = false;

  modesCycle[indexMode].done = true;

  indexMode++;

  if (indexMode >= modesCycle.length) {

    indexMode = 0;

    modesCycle.forEach(mode => mode.done = false);
    cycleTomatoes = 0;
    stopTimer();
    isRunning = false;
  } 

  if (currentMode.name === 'pomodoro') {
    cycleTomatoes++;
    totalTomatoes++;
    totalTomatoesCounter.textContent = totalTomatoes;
  }

  updateTomatoes();

  currentMode = modesCycle[indexMode];


  const nextModeObj = modesCycle[indexMode];

  updateModeButtonDecoration();
  switchMode(nextModeObj);
}

resetBtn.addEventListener('click', resetTimer);

startPauseBtn.addEventListener('click', () => {
  if (isRunning === true) {
    isRunning = false
    stopTimer();
    toggleHiddenText(false);
    return;
  }

  if (remainingMinutes <= 0 && remainingSeconds <= 0) return;

  startTimer();

  toggleHiddenText(true);
});

function getModeByName(name) {
  return modesCycle.find(mode => mode.name === name);
}

pomodoroModeManual.addEventListener('click', () => {
  currentMode = getModeByName('pomodoro');
  indexMode = modesCycle.indexOf(currentMode);
  switchMode(currentMode);
});
shortBreakModeManual.addEventListener('click', () => {
  currentMode = getModeByName('shortBreak');
  switchMode(currentMode);
});
longBreakModeManual.addEventListener('click', () => {
  currentMode = getModeByName('longBreak');
  switchMode(currentMode);
});

nextModeArrow.addEventListener('click', () => {
  toggleHiddenText(true);
  nextMode();
});

let prevTimerMode = currentTimerMode;

toggleMode.addEventListener('change', () => {
  prevTimerMode = currentTimerMode;
  currentTimerMode = toggleMode.checked ? 'auto' : 'manual';
});

settingsBtn.addEventListener('click', () => {
  modalSettings.showModal();
  stopTimer();
  isRunning = false;
  toggleHiddenText(false);
});

cancelModalButton.addEventListener('click', () => {
  currentTimerMode = prevTimerMode;
  if (currentTimerMode === 'auto') {
    toggleMode.checked = true;
  } else {
    toggleMode.checked = false;
  }
  pomodoroTimeInput.value = modesCycle[0].minutes;
  shortBreakimeInput.value = modesCycle[1].minutes;
  longBreakimeInput.value = modesCycle[7].minutes;
  modalSettings.close();
});

function refreshCurrentMode() {
  currentMode = modesCycle[indexMode];
  modeDurationMinutes = currentMode.minutes;
  modeDurationSeconds = currentMode.seconds;
  remainingMinutes = modeDurationMinutes;
  remainingSeconds = modeDurationSeconds;
  minutes.textContent = formatTime(remainingMinutes);
  seconds.textContent = formatTime(remainingSeconds);
}

function resetCycle() {
  stopTimer();
  isRunning = false;
  toggleHiddenText(false);
  indexMode = 0;
  refreshCurrentMode();
}

saveModalButton.addEventListener('click', () => {
  if (hasInvalidInput()) {
    event.preventDefault();
    inputList.forEach(validateInput);
    return;
  }


  if (currentTimerMode === 'auto') {
    nextModeArrow.style.display = 'inline-block';
    tomatoesBlock.classList.remove('manual-tomatoes');
    modesManual.style.display = 'none';
    modesAuto.style.display = 'flex';

    if (prevTimerMode !== currentTimerMode) {
      resetCycle();
      cycleTomatoes = 0;
      updateTomatoes();
    } 

    updateModeButtonDecoration();
    
  } else {
    nextModeArrow.style.display = 'none';
    tomatoesBlock.classList.add('manual-tomatoes');
    modesAuto.style.display = 'none';
    modesManual.style.display = 'flex';

    cycleTomatoes = 0;
    updateTomatoes();

    updateModeButtonDecorationManual();
    refreshCurrentMode();
    console.log(currentMode);
  }
  prevTimerMode = currentTimerMode;

  modesCycle = generateModesCycle();

  refreshCurrentMode();
  modalSettings.close();
})


const inputList = Array.from(document.querySelectorAll('.change-timer-value__input'));

function toggleErrorSpan(inputElement, errorMessage = '') {
  const errorElement = document.getElementById(`${inputElement.id}-error`);
  if (!errorElement) return;

  if (errorMessage) {
    inputElement.classList.add('form__type-input-error');
    errorElement.textContent = errorMessage;
    errorElement.classList.add('form__error-active');
  } else {
    inputElement.classList.remove('form__type-input-error');
    errorElement.textContent = '';
    errorElement.classList.remove('form__error-active');
  }
}

function validateInput(inputElement) {
  let errorMessage = '';

  if (!inputElement.validity.valid) {
    if (inputElement.validity.valueMissing) {
      errorMessage = 'this field is required';
    } else if (inputElement.validity.rangeUnderflow || inputElement.validity.rangeOverflow) {
      errorMessage = inputElement.dataset.errorMessage || 'Number out of range';
    } else {
      errorMessage = inputElement.dataset.errorMessage || 'Invalid value';
    }
  }

  toggleErrorSpan(inputElement, errorMessage);
  return !errorMessage;
}

function checkLengthMismatch(inputElement) {
  if (inputElement.type !== 'text') return '';
  const valueLength = inputElement.value.trim().length;
  if (valueLength < inputElement.minLength) {
    return `Minimum number of characters: ${inputElement.minLength}`;
  }
  return '';
}

function hasInvalidInput() {
  return inputList.some(input => !validateInput(input));
}

function toggleButton() {
  const isInvalid = hasInvalidInput();
  saveModalButton.classList.toggle('button-inactive', isInvalid);
  saveModalButton.setAttribute('aria-disabled', String(isInvalid));
}

function initValidation() {
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      validateInput(inputElement);
      toggleButton();
    });
    inputElement.addEventListener('blur', () => {
      validateInput(inputElement);
    });
    inputElement.addEventListener('focus', () => {
      toggleErrorSpan(inputElement);
    });
  });

  toggleButton();
}
initValidation();
