export const LOG_LENGTH = 100;
export const NAME = 'logger';

export const enum LogLevel {
  off = 0,
  success = 1,
  info = 2,
  warning = 3,
  error = 4,
  other = 5,
}
export const LogLevelNames = ['', 'success', 'info', 'warning', 'error', ''];

export const errorNotImplemented = Error('Not implemented');
