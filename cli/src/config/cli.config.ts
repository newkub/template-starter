import { FROZEN_TEMPLATE_MAP } from '../constant/template.const'

const cfg = {
  templateMap: FROZEN_TEMPLATE_MAP
} as const

export const cliConfig = Object.freeze(cfg)