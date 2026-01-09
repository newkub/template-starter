import { Effect } from 'effect';

export class AppError {
  readonly _tag = 'AppError';
  constructor(readonly message: string) {}
}

export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }
  if (error instanceof Error) {
    return new AppError(error.message);
  }
  return new AppError(String(error));
};
