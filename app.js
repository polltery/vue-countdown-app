var defaultTimerValue = 25;
var app = new Vue({
    el: '#app',
    data: {
        initialTimerValue: defaultTimerValue,
        timer: defaultTimerValue,
        timerSeconds: 0,
        timerState: 'stopped',
        intervalObject: null
    },
    computed: {
        computedWidth: function(){
            return (this.timerSeconds/60)*100 + '%';
        }
    },
    methods: {
        setTimer: function(x){
            this.timer = x;
            this.initialTimerValue = x;
        },
        saveDefaultTimerValue: function () {
            this.initialTimerValue = this.timer;
        },
        playTimer: function () {
            this.timerState = 'playing';
            if(this.intervalObject == null){
                this.intervalObject = setInterval(this.updateTimer, 1000);
            }
        },
        pauseTimer: function () {
            this.timerState = 'paused';
        },
        stopTimer: function () {
            this.timerState = 'stopped';
            clearInterval(this.intervalObject);
            this.intervalObject = null;
            this.timer = this.initialTimerValue;
            this.timerSeconds = 0;
        },
        updateTimer: function () {
            if(this.timerState == 'playing'){
                if(this.timer == 0 && this.timerSeconds == 0){
                    this.timerState = 'overdue';
                    this.$refs.alarmSound.play();
                }else{
                    if(this.timerSeconds == 0){
                        this.timerSeconds = 60;
                        this.timer -= 1;
                    }
                    this.timerSeconds -= 1;
                }
            }else if(this.timerState == 'overdue'){
                if(this.timerSeconds == 59){
                    this.$refs.alarmSound.play();
                    this.timerSeconds = 0;
                    this.timer += 1;
                }
                this.timerSeconds += 1;
            }
        }
    }
})