import { Effect } from 'effect';
import { AppError } from '../error';

export const log = (message: string): Effect.Effect<void, AppError> =>
  Effect.tryPromise({
    try: async () => console.log(`[LOG] ${message}`),
    catch: (error: unknown) => new AppError(`Failed to log: ${error}`),
  });
