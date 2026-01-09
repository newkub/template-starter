import { Effect } from 'effect';
import * as services from './services';
import * as utils from './utils';

export const main = Effect.gen(function* () {
  const message = utils.hello('World');
  console.log(message);
  
  yield* services.logger.log(message);
});
