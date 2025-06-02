import { Console, Effect, Logger } from "effect";

export function runWithLogger<T>(effect: Effect.Effect<T, unknown>, label?: string): Promise<T> {
  return Effect.runPromise(
    effect.pipe(
      Console.withGroup({ label: label ?? "[Logger]" }),
      Effect.provide(Logger.pretty),
    )
  );
}
