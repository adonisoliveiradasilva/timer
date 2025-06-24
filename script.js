document.addEventListener('DOMContentLoaded', () => {
    const needle = document.getElementById('needle');
    const startStopBtn = document.getElementById('startStopBtn');
    const resetBtn = document.getElementById('resetBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeButton = document.querySelector('.close-button');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const workTimeInput = document.getElementById('workTime');
    const restTimeInput = document.getElementById('restTime');
    const notificationSound = document.getElementById('notificationSound');
    const timerDisplay = document.getElementById('timerDisplay');
    const markingsContainer = document.querySelector('.markings-container');
    const statusDisplay = document.getElementById('statusDisplay');
    const cycleCountDisplay = document.getElementById('cycleCountDisplay');
    const cycleToggleBtn = document.getElementById('cycleToggleBtn');
    const cycleToggleIcon = document.getElementById('cycleToggleIcon');

    // Generate markings
    for (let i = 0; i < 12; i++) {
        const marking = document.createElement('div');
        marking.classList.add('marking');
        marking.style.transform = `rotate(${i * 30}deg)`;
        markingsContainer.appendChild(marking);
    }

    let workTime = parseInt(workTimeInput.value, 10);
    let restTime = parseInt(restTimeInput.value, 10);

    let timerId = null;
    let isRunning = false;
    let isResting = false;
    let totalTime = workTime;
    let timeRemaining = totalTime;
    let cycleCount = 0;
    let isCycleCounterEnabled = false;

    function updateStatusDisplay() {
        statusDisplay.textContent = isResting ? 'Descanso' : 'Foco';
    }

    function updateCycleCountDisplay() {
        cycleCountDisplay.textContent = `Ciclos: ${cycleCount}`;
    }

    function updateTimerDisplay() {
        timerDisplay.textContent = timeRemaining >= 0 ? timeRemaining : 0;
    }

    function updateStopwatchAnimation() {
        const elapsed = totalTime - timeRemaining;
        const rotation = (elapsed / totalTime) * 360;
        
        if (isRunning) {
            needle.style.transition = 'transform 1s linear, background-color 0.5s';
        } else {
            needle.style.transition = 'none';
        }

        needle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
    }

    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        startStopBtn.innerHTML = '<i class="fas fa-pause"></i>';
        
        updateStopwatchAnimation();

        timerId = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();
            updateStopwatchAnimation();
            
            if (timeRemaining < 0) {
                notificationSound.play();
                isResting = !isResting;
                
                if (isCycleCounterEnabled && !isResting) {
                    cycleCount++;
                    updateCycleCountDisplay();
                }
                
                if (isResting) {
                    totalTime = restTime;
                    needle.style.backgroundColor = '#3498db'; // Blue for rest
                } else {
                    totalTime = workTime;
                    needle.style.backgroundColor = '#e74c3c'; // Red for work
                }
                timeRemaining = totalTime;
                updateStatusDisplay();
                updateTimerDisplay();
                updateStopwatchAnimation();
            }
        }, 1000);
    }

    function stopTimer() {
        if (!isRunning) return;
        isRunning = false;
        clearInterval(timerId);
        timerId = null;
        startStopBtn.innerHTML = '<i class="fas fa-play"></i>';
        updateStopwatchAnimation(); // To remove transition
    }

    function resetTimer() {
        stopTimer();
        isResting = false;
        cycleCount = 0;
        needle.style.backgroundColor = '#e74c3c'; // Back to work color
        totalTime = workTime;
        timeRemaining = totalTime;
        updateTimerDisplay();
        updateStatusDisplay();
        updateCycleCountDisplay();
        updateStopwatchAnimation();
    }

    startStopBtn.addEventListener('click', () => {
        if (isRunning) {
            stopTimer();
        } else {
            startTimer();
        }
    });

    resetBtn.addEventListener('click', resetTimer);

    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('show');
    });

    closeButton.addEventListener('click', () => {
        settingsModal.classList.remove('show');
    });

    window.addEventListener('click', (event) => {
        if (event.target === settingsModal) {
            settingsModal.classList.remove('show');
        }
    });
    
    function updateCycleToggle() {
        if (isCycleCounterEnabled) {
            cycleToggleIcon.classList.remove('fa-toggle-off');
            cycleToggleIcon.classList.add('fa-toggle-on');
            cycleToggleBtn.classList.add('active');
        } else {
            cycleToggleIcon.classList.remove('fa-toggle-on');
            cycleToggleIcon.classList.add('fa-toggle-off');
            cycleToggleBtn.classList.remove('active');
        }
    }

    cycleToggleBtn.addEventListener('click', () => {
        isCycleCounterEnabled = !isCycleCounterEnabled;
        updateCycleToggle();
    });

    saveSettingsBtn.addEventListener('click', () => {
        workTime = parseInt(workTimeInput.value, 10);
        restTime = parseInt(restTimeInput.value, 10);
        cycleCountDisplay.style.display = isCycleCounterEnabled ? 'block' : 'none';
        settingsModal.classList.remove('show');
        resetTimer();
    });

    // Initialize
    cycleCountDisplay.style.display = 'none';
    updateCycleCountDisplay();
    updateCycleToggle();
    updateStatusDisplay();
    updateTimerDisplay();
    updateStopwatchAnimation();
}); 