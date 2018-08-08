let dir = 1
let rotCenter = 0
let rotOuter = 40 // 40
let rotPhase2 = rotOuter
let rotPhase3 = 30 // 20
let rotPhase4Outer = 25 // 15
let rotPhase4Inner = 2 // 5
let rotPhase5 = rotCenter
let rot = 0
let state = 0
let starttime = 0
let roundTime = 3000

input.onButtonPressed(Button.A, () => {
    state++
    starttime = input.runningTime()
})

input.onButtonPressed(Button.B, () => {
    state = 0
    starttime = input.runningTime()
})

function stateMachine() {
    //serial.writeValue("State", state)
    //serial.writeValue("rot", rot)
    if (state == 0) {
        rot = rotPhase2
        dir = 1
        state++
    }
    else if (state == 1) {
        // do nothing
    }
    else if (state == 2) {
        rot = rotPhase2
        if (input.runningTime() - starttime > roundTime * 2) {
            state++
            starttime = input.runningTime()

        }
    }
    else if (state == 3) {
        rot = rotPhase3
        if (input.runningTime() - starttime > roundTime * 2) {
            state++
            starttime = input.runningTime()
        }
    }
    else if (state == 4) {
        if (input.runningTime() - starttime > roundTime * 10) {
            state++
            starttime = input.runningTime()
        } else {
            if (dir != 0 && rot >= rotPhase4Outer) {
                dir = -1
            }
            if (dir != 0 && rot <= rotPhase4Inner) {
                dir = 1
            }
            rot += dir * 2

        }
    }
    else if (state == 5) {
        rot = rotPhase5
    }
    pins.servoWritePin(AnalogPin.P1, rot)
}

let ledState = 0
function nextLeds() {
    switch (ledState) {
        case 0:
            basic.showLeds(`
# . . . .
. # . . .
. . # . .
. . . # .
. . . . #
`)
            break
        case 1:
            basic.showLeds(`
. . . . .
. . . . .
. . # . .
. # . # .
# . . . #
`)
            break
        case 2:
            basic.showLeds(`
# . . . #
. # . # .
. . # . .
. . . . .
. . . . .
`)
            break
        case 3:
            basic.showLeds(`
. . . . #
. . . # .
. . # . .
. . . # .
. . . . #
`)
            break
        case 4:
            basic.showLeds(`
. . . # .
. . # . .
. # . . .
. . # . .
. . . # .
`)
            break
        case 5:
            basic.showLeds(`
. . # . .
. # . . .
# . . . .
. # . . .
. . # . .
`)
            break
    }
}
let loopTime = 47
let loopCount = 0
basic.forever(() => {
    let loopStartTime = input.runningTime()
    stateMachine()
    if (loopCount % 6 == 0) {
        ledState = (ledState + 1) % 6
        nextLeds()
    }
    loopCount++
    let loopEndTime = input.runningTime()
    basic.pause(Math.max(0, loopTime - (loopEndTime - loopStartTime)))
})
