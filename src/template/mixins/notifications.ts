import { ElMessageBox, ElNotification } from 'element-plus';
import type { MessageBoxData } from 'element-plus/lib/components/message-box';
import type { NotificationOptions } from 'element-plus/lib/components/notification/index';
import { LogLevel } from '../logger/constants';
import type { UserMessage } from './../api/api.d';
import type { MessageBoxInput } from './@types/notifications';

export const enum ApiMessageTypes {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export const enum MessageTypeStatus {
  SUCCESS = 1,
  INFO = 2,
  WARNING = 3,
  ERROR = 4,
  OTHER = 5,
}

export function parseUserMessageError(userMessagesList: UserMessage[]): MessageBoxInput {
  const message = userMessagesList.map((item: UserMessage) => item.message).join('<br>');
  return {
    title: userMessagesList[0].title,
    message,
    options: {
      type: getMessageType(userMessagesList[0].type),
    },
  };
}

export function convertLoggerType(val: LogLevel): 'success' | 'warning' | 'info' | 'error' | '' | undefined {
  switch (val) {
    case LogLevel.info:
      return ApiMessageTypes.INFO;
    case LogLevel.warning:
      return ApiMessageTypes.WARNING;
    case LogLevel.error:
      return ApiMessageTypes.ERROR;
    case LogLevel.off:
      return undefined;
    default:
      return ApiMessageTypes.INFO;
  }
}

export function getMessageType(val: number): 'success' | 'warning' | 'info' | 'error' | '' | undefined {
  switch (val) {
    case MessageTypeStatus.SUCCESS:
      return ApiMessageTypes.SUCCESS;
    case MessageTypeStatus.INFO:
      return ApiMessageTypes.INFO;
    case MessageTypeStatus.WARNING:
      return ApiMessageTypes.WARNING;
    case MessageTypeStatus.ERROR:
      return ApiMessageTypes.ERROR;
    case MessageTypeStatus.OTHER:
      return undefined;
    default:
      return ApiMessageTypes.INFO;
  }
}

export async function showAlert(message: MessageBoxInput): Promise<MessageBoxData> {
  return await (message.title ? ElMessageBox.alert(message.message, message.title, message.options) : ElMessageBox.alert(message.message, message.options));
}
export async function showConfirm(message: MessageBoxInput): Promise<MessageBoxData> {
  return await (message.title ? ElMessageBox.confirm(message.message, message.title, message.options) : ElMessageBox.confirm(message.message, message.options));
}

export function showNotification(message: string, options?: Partial<NotificationOptions>): void {
  ElNotification({ ...options, message });
}
