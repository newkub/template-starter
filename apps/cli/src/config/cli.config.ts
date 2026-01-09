import { FROZEN_TEMPLATE_MAP } from '../constant/template.const'

const cfg = {
  templateMap: FROZEN_TEMPLATE_MAP,
  github: {
    owner: 'newkub',
    repository: 'templates',
    branch: 'main',
    templatesPath: 'templates'
  }
} as const

export const cliConfig = Object.freeze(cfg)