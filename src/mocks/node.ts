import { setupServer } from 'msw/node';
import { handlers } from './handlers';
import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 20;

export const server = setupServer(...handlers);
