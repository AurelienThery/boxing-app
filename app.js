// Boxing Training App - Main JavaScript

class BoxingApp {
    constructor() {
        this.currentRound = 1;
        this.totalRounds = 3;
        this.roundTime = 180; // seconds
        this.restTime = 60; // seconds
        this.timeRemaining = this.roundTime;
        this.isRunning = false;
        this.isPaused = false;
        this.isResting = false;
        this.timer = null;
        this.soundEnabled = true;
        this.audioContext = null;
        this.MAX_HISTORY_SESSIONS = 50;
        
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupTimerControls();
        this.loadWorkouts();
        this.loadCombos();
        this.loadHistory();
        this.updateDisplay();
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                
                // Remove active class from all tabs and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                btn.classList.add('active');
                document.getElementById(tabName).classList.add('active');
            });
        });
    }

    setupTimerControls() {
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resetBtn = document.getElementById('resetBtn');

        startBtn.addEventListener('click', () => this.start());
        pauseBtn.addEventListener('click', () => this.pause());
        resetBtn.addEventListener('click', () => this.reset());

        // Settings inputs
        document.getElementById('roundTime').addEventListener('change', (e) => {
            this.roundTime = parseInt(e.target.value) * 60;
            if (!this.isRunning) {
                this.timeRemaining = this.roundTime;
                this.updateDisplay();
            }
        });

        document.getElementById('restTime').addEventListener('change', (e) => {
            this.restTime = parseInt(e.target.value);
        });

        document.getElementById('numRounds').addEventListener('change', (e) => {
            this.totalRounds = parseInt(e.target.value);
            document.getElementById('totalRounds').textContent = this.totalRounds;
        });

        document.getElementById('soundEnabled').addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
        });

        document.getElementById('clearHistory').addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
                localStorage.removeItem('boxingHistory');
                this.loadHistory();
            }
        });
    }

    start() {
        if (this.isPaused) {
            this.isPaused = false;
        } else {
            this.isRunning = true;
        }

        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        
        this.timer = setInterval(() => this.tick(), 1000);
        this.updateDisplay();
        this.playSound('start');
    }

    pause() {
        this.isPaused = true;
        clearInterval(this.timer);
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        
        this.updateDisplay();
    }

    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.isResting = false;
        this.currentRound = 1;
        this.timeRemaining = this.roundTime;
        
        clearInterval(this.timer);
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        
        this.updateDisplay();
    }

    tick() {
        this.timeRemaining--;

        if (this.timeRemaining <= 0) {
            if (this.isResting) {
                // Rest finished, start next round
                this.isResting = false;
                this.currentRound++;
                
                if (this.currentRound > this.totalRounds) {
                    // Workout complete
                    this.completeWorkout();
                    return;
                }
                
                this.timeRemaining = this.roundTime;
                this.playSound('start');
            } else {
                // Round finished, start rest
                if (this.currentRound < this.totalRounds) {
                    this.isResting = true;
                    this.timeRemaining = this.restTime;
                    this.playSound('rest');
                } else {
                    // Last round finished
                    this.completeWorkout();
                    return;
                }
            }
        } else if (this.timeRemaining === 10 && !this.isResting) {
            this.playSound('warning');
        }

        this.updateDisplay();
    }

    completeWorkout() {
        this.playSound('complete');
        this.saveToHistory();
        this.reset();
        alert('🏆 Entraînement terminé ! Excellent travail !');
    }

    updateDisplay() {
        const timerDisplay = document.querySelector('.timer-display');
        const timeDisplay = document.getElementById('timeDisplay');
        const statusLabel = document.getElementById('statusLabel');
        const currentRoundEl = document.getElementById('currentRound');

        // Update time
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Update round
        currentRoundEl.textContent = this.currentRound;

        // Update status and styling
        timerDisplay.classList.remove('active', 'rest', 'warning');
        
        if (this.isRunning && !this.isPaused) {
            timerDisplay.classList.add('active');
            
            if (this.isResting) {
                timerDisplay.classList.add('rest');
                statusLabel.textContent = 'Repos';
            } else {
                statusLabel.textContent = 'En cours';
                
                if (this.timeRemaining <= 10) {
                    timerDisplay.classList.add('warning');
                }
            }
        } else if (this.isPaused) {
            statusLabel.textContent = 'Pause';
        } else {
            statusLabel.textContent = 'Prêt';
        }
    }

    playSound(type) {
        if (!this.soundEnabled) return;

        // Create audio context once and reuse it
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;

        switch(type) {
            case 'start':
                oscillator.frequency.value = 880;
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.1);
                break;
            case 'rest':
                oscillator.frequency.value = 440;
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.3);
                break;
            case 'warning':
                oscillator.frequency.value = 660;
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.1);
                break;
            case 'complete':
                // Play a sequence for completion
                const frequencies = [523, 659, 784, 1047];
                frequencies.forEach((freq, i) => {
                    setTimeout(() => {
                        const osc = this.audioContext.createOscillator();
                        const gain = this.audioContext.createGain();
                        osc.connect(gain);
                        gain.connect(this.audioContext.destination);
                        osc.frequency.value = freq;
                        gain.gain.value = 0.3;
                        osc.start();
                        osc.stop(this.audioContext.currentTime + 0.2);
                    }, i * 150);
                });
                break;
        }
    }

    saveToHistory() {
        const history = JSON.parse(localStorage.getItem('boxingHistory') || '[]');
        
        const session = {
            date: new Date().toISOString(),
            rounds: this.totalRounds,
            roundTime: this.roundTime / 60,
            restTime: this.restTime
        };
        
        history.unshift(session);
        
        // Keep only last sessions as per MAX_HISTORY_SESSIONS
        if (history.length > this.MAX_HISTORY_SESSIONS) {
            history.pop();
        }
        
        localStorage.setItem('boxingHistory', JSON.stringify(history));
    }

    loadHistory() {
        const historyList = document.getElementById('historyList');
        const history = JSON.parse(localStorage.getItem('boxingHistory') || '[]');

        if (history.length === 0) {
            historyList.innerHTML = '<div class="empty-message">Aucun entraînement enregistré</div>';
            return;
        }

        historyList.innerHTML = history.map(session => {
            const date = new Date(session.date);
            const dateStr = date.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            return `
                <div class="history-item">
                    <div class="date">${dateStr}</div>
                    <div class="details">
                        ${session.rounds} rounds × ${session.roundTime} min 
                        (repos: ${session.restTime}s)
                    </div>
                </div>
            `;
        }).join('');
    }

    loadWorkouts() {
        const workouts = [
            {
                name: 'Débutant',
                description: 'Entraînement pour commencer',
                rounds: 3,
                roundTime: 2,
                rest: 60,
                icon: '🥊'
            },
            {
                name: 'Intermédiaire',
                description: 'Entraînement standard',
                rounds: 5,
                roundTime: 3,
                rest: 60,
                icon: '🔥'
            },
            {
                name: 'Avancé',
                description: 'Entraînement intensif',
                rounds: 8,
                roundTime: 3,
                rest: 45,
                icon: '💪'
            },
            {
                name: 'Sparring',
                description: 'Simulation de combat',
                rounds: 6,
                roundTime: 3,
                rest: 60,
                icon: '⚡'
            },
            {
                name: 'Technique',
                description: 'Focus sur la technique',
                rounds: 4,
                roundTime: 4,
                rest: 90,
                icon: '🎯'
            },
            {
                name: 'Cardio',
                description: 'Conditionnement intensif',
                rounds: 10,
                roundTime: 2,
                rest: 30,
                icon: '🏃'
            }
        ];

        const workoutGrid = document.getElementById('workoutGrid');
        workoutGrid.innerHTML = workouts.map(workout => `
            <div class="workout-card" onclick="app.selectWorkout(${workout.rounds}, ${workout.roundTime}, ${workout.rest})">
                <h3>${workout.icon} ${workout.name}</h3>
                <p>${workout.description}</p>
                <div class="workout-details">
                    <div class="detail-item">
                        <span>⏱️ ${workout.rounds} rounds</span>
                    </div>
                    <div class="detail-item">
                        <span>🕐 ${workout.roundTime} min</span>
                    </div>
                    <div class="detail-item">
                        <span>💤 ${workout.rest}s</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    selectWorkout(rounds, roundTime, rest) {
        document.getElementById('numRounds').value = rounds;
        document.getElementById('roundTime').value = roundTime;
        document.getElementById('restTime').value = rest;

        this.totalRounds = rounds;
        this.roundTime = roundTime * 60;
        this.restTime = rest;
        this.timeRemaining = this.roundTime;

        document.getElementById('totalRounds').textContent = this.totalRounds;
        this.updateDisplay();

        // Switch to timer tab
        document.querySelector('[data-tab="timer"]').click();
    }

    loadCombos() {
        const combos = [
            {
                name: 'Jab-Cross',
                sequence: '1-2',
                description: 'Combinaison de base : jab suivi d\'un direct du bras arrière'
            },
            {
                name: 'Jab-Cross-Crochet',
                sequence: '1-2-3',
                description: 'Enchaînement classique avec un crochet du bras avant'
            },
            {
                name: 'Jab-Uppercut-Crochet',
                sequence: '1-6-3',
                description: 'Jab, uppercut du bras arrière, crochet du bras avant'
            },
            {
                name: 'Double Jab-Cross',
                sequence: '1-1-2',
                description: 'Double jab rapide suivi d\'un direct puissant'
            },
            {
                name: 'Cross-Crochet-Uppercut',
                sequence: '2-3-5',
                description: 'Direct, crochet avant, uppercut avant'
            },
            {
                name: 'Jab-Cross-Crochet-Cross',
                sequence: '1-2-3-2',
                description: 'Combinaison de quatre coups avec retour du direct'
            },
            {
                name: 'Crochet-Crochet-Uppercut',
                sequence: '3-4-6',
                description: 'Crochets avant et arrière, uppercut arrière'
            },
            {
                name: 'Jab-Cross-Crochet-Uppercut-Cross',
                sequence: '1-2-3-6-2',
                description: 'Combinaison avancée de cinq coups'
            }
        ];

        const combosList = document.getElementById('combosList');
        combosList.innerHTML = combos.map(combo => `
            <div class="combo-card">
                <h3>${combo.name}</h3>
                <div class="combo-sequence">${combo.sequence}</div>
                <div class="combo-description">${combo.description}</div>
            </div>
        `).join('');
    }
}

// Initialize the app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new BoxingApp();
});
