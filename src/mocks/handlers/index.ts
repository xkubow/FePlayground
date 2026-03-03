export { vozidloHandlers } from './vozidlo'
export { eskalaceHandlers } from './eskalace'
export { uzivatelHandlers } from './uzivatel'
export { ciselnikyHandlers } from './ciselniky'
export { miscHandlers } from './misc'

import { vozidloHandlers } from './vozidlo'
import { eskalaceHandlers } from './eskalace'
import { uzivatelHandlers } from './uzivatel'
import { ciselnikyHandlers } from './ciselniky'
import { miscHandlers } from './misc'

export const handlers = [
  ...uzivatelHandlers,
  ...vozidloHandlers,
  ...eskalaceHandlers,
  ...ciselnikyHandlers,
  ...miscHandlers,
]
