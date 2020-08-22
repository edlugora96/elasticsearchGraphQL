const {
  Board,
  Led,
  Button,
  Servo,
  Thermometer,
  Sensor,
} = require("johnny-five")
const board = new Board()
const Agent = require("../services/mqtt-agent")

const { encryptedData } = require("../utils")

const arduinoAgent = new Agent({
  mqtt: { topic: "arduino" },
  clientId: process.env.ID_ARDUINO_MQTT,
})
const key = process.env.SENT_TO_PROJECT_KEY.split("\\n").join("\n")

board.on("ready", () => {
  const led = new Led(11)
  const mic = new Sensor("A0")
  button = new Button(2)
  const servo = new Servo(6)
  const thermometer = new Thermometer({
    controller: "LM35",
    pin: "A1",
  })

  board.repl.inject({
    led,
    button,
    servo,
  })
  arduinoAgent.hear((_, payload) => {
    if ("value" in payload) {
      servo.to(payload.value)
    }
  })

  setInterval(() => {
    const { celsius, fahrenheit, kelvin } = thermometer
    arduinoAgent.say(
      JSON.stringify({
        agentId: "thermometer",
        data: encryptedData(
          String({
            celsius,
            fahrenheit,
            kelvin,
          }),
          key
        ),
      })
    )
  }, 1000)

  mic.on("data", function () {
    arduinoAgent.say(
      JSON.stringify({
        agentId: "mic",
        data: encryptedData(String(this.value), key),
      })
    )
    led.brightness(this.value >> 2)
  })

  // mic.on("change", () => {
  //   console.log("====================================")
  //   console.log(mic.value, mic.value >> 2)
  //   console.log("====================================")
  // })

  button.on("down", function () {
    arduinoAgent.say(
      JSON.stringify({
        agentId: "button",
        data: encryptedData("down", key),
      })
    )
  })

  button.on("hold", function () {
    console.log("hold")
    arduinoAgent.say(
      JSON.stringify({
        agentId: "button",
        data: encryptedData("hold", key),
      })
    )
  })

  button.on("up", function () {
    arduinoAgent.say(
      JSON.stringify({
        agentId: "button",
        data: encryptedData("up", key),
      })
    )
  })
})
