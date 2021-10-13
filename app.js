// default minutes
var defaultTimerValue = 25; 
var app = new Vue({
    el: '#app',
    data: {
        // used to keep track of initial timer value which is applied when user stops the clock
        initialTimerValue: defaultTimerValue,
        // minutes (this could have been named better)
        timer: defaultTimerValue, 
        // seconds
        timerSeconds: 0, 
        // stopped -> playing -> paused/stopped/overdue (repeat)
        timerState: 'stopped',
        intervalObject: null,
        // this stores the amount of time user takes to stop the clock after overdue
        timerRecord: {
            minutes: 0,
            seconds: 0
        },
        // mutes the alarm that is beeped every minute
        mute: false
    },

    // Vue has computed variable which are dynamic and updated per frame (i think)
    computed: {
        // used for the loading bar shown on top of the screen
        computedWidth: function(){
            return (this.timerSeconds/60)*100 + '%';
        }
    },

    methods: {

        // set the timer to value x
        setTimer: function(x){
            this.timer = x;
            this.initialTimerValue = x;
        },

        // save the default value if the text box is updated
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

        // ran every second when playing
        updateTimer: function () {
            if(this.timerState == 'playing'){
                // set to overdue if time is up
                if(this.timer == 0 && this.timerSeconds == 0){
                    this.timerState = 'overdue';
                    if(!this.mute){
                        this.$refs.alarmSound.play();
                    }
                }else{
                    if(this.timerSeconds == 0){
                        this.timerSeconds = 60;
                        this.timer -= 1;
                    }
                    this.timerSeconds -= 1;
                }
            }else if(this.timerState == 'overdue'){
                // play a sound every minute if overdue
                if(this.timerSeconds == 59){
                    if(!this.mute){
                        this.$refs.alarmSound.play();
                    }
                    this.timerSeconds = 0;
                    this.timer += 1;
                }
                this.timerSeconds += 1;
            }
        },

        toggleMute: function () {
            this.mute = !this.mute;
            document.getElementById('mute-button').innerText = (this.mute ? 'Unmute 🔇' : 'Mute 🔉');
        }
    }
})