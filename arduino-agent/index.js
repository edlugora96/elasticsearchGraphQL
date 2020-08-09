const { Board, Led } = require("johnny-five")
const board = new Board()
const Agent = require("../services/mqtt-agent")

const gadgetAgent = new Agent({ mqtt: { topic: "led" } })

let blink = true

board.on("ready", () => {
  const led = new Led(13)

  board.repl.inject({
    led,
  })

  led.blink(1000)

  const led11 = new Led(11)

  led11.fade({
    easing: "linear",
    duration: 1000,
    cuePoints: [0, 0.2, 0.4, 0.6, 0.8, 1],
    keyFrames: [0, 250, 25, 150, 100, 125],
    onstop() {
      console.log("Animation stopped")
    },
  })

  gadgetAgent.hear((_, payload) => {
    switch (payload.toString().replace(/"/gim, "")) {
      case "on":
        led11.fadeIn()
        break
      case "off":
        led11.fadeOut()
        break
      case "blink":
        board.loop(2000, () => {
          blink ? led11.fadeOut() : led11.fadeIn()
          blink = !blink
        })
        break
    }
  })
  // Toggle the led11 after 2 seconds (shown in ms)
})
