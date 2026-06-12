import { Effect, Ref } from "effect"

const MIN = 250_000
const MAX = 500_000
const DURATION = 1800

const formatSalary = (n: number) =>
  "$" + Math.round(n).toLocaleString("en-US")

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

const main = Effect.gen(function* () {
  const amountEl = document.getElementById("amount")!
  const slider = document.getElementById("salary-slider") as HTMLInputElement

  const userInteracted = yield* Ref.make(false)

  const setDisplay = (value: number) =>
    Effect.sync(() => {
      const rounded = Math.round(value)
      amountEl.textContent = formatSalary(rounded)
      slider.value = String(rounded)
      const pct = ((rounded - MIN) / (MAX - MIN)) * 100
      slider.style.setProperty("--fill", `${pct}%`)
    })

  yield* Effect.sync(() => {
    slider.addEventListener("input", () => {
      Effect.runFork(
        Effect.gen(function* () {
          yield* Ref.set(userInteracted, true)
          yield* setDisplay(Number(slider.value))
        })
      )
    })
  })

  const startTime = performance.now()

  const loop: Effect.Effect<void> = Effect.suspend(() =>
    Effect.gen(function* () {
      const interacted = yield* Ref.get(userInteracted)
      if (interacted) return

      const t = Math.min((performance.now() - startTime) / DURATION, 1)
      yield* setDisplay(MIN + (MAX - MIN) * easeInOutCubic(t))

      if (t < 1) {
        yield* Effect.sleep("16 millis")
        yield* loop
      }
    })
  )

  yield* loop
})

Effect.runPromise(main).catch(console.error)
