let light_triggered = false
let sensitivity = 0
let lightlevel_avg = 45000
let dir = 0
let rot = 0
let starttime = 0
let triptime = 0
input.onButtonPressed(Button.A, () => {
    dir = 1
})
input.onButtonPressed(Button.B, () => {
    dir = 0
    rot = 0
})
rot = 0
dir = 0
sensitivity = 10 * 1000
light_triggered = false
starttime = input.runningTimeMicros()
basic.forever(() => {
    if (dir != 0 && rot > 20) {
        dir = -1
    }
    if (dir != 0 && rot < 0) {
        dir = 1
    }
    rot += dir
    pins.servoWritePin(AnalogPin.P1, rot)
    //serial.writeString("avg: " + lightlevel_avg + ", lightlevel:" + input.lightLevel() * 1000 + "\n")
    //basic.pause(5)
})
basic.forever(() => {
    let lightlevel = input.lightLevel() * 1000
    let lightlevel_0 = (lightlevel_avg * 975)
    let lightlevel_1 = (lightlevel_0 / 1000)
    let lightlevel_2 = (lightlevel * 25 / 1000)
    lightlevel_avg = lightlevel_1 + lightlevel_2
})
basic.forever(() => {
    let lightlevel = input.lightLevel() * 1000
    if (lightlevel > (lightlevel_avg + sensitivity) && !(light_triggered)) {
        light_triggered = true;
        triptime = input.runningTimeMicros() - starttime;
        starttime = input.runningTimeMicros()
        serial.writeValue("triptime", triptime)
    }
    else if (lightlevel < (lightlevel_avg + sensitivity / 2) && light_triggered) {
        light_triggered = false;
    }
})
