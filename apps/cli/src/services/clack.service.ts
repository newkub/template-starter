import { log as clackLog } from '@clack/prompts'

export const clackLib = {
  log: clackLog,
  select: async (options: any) => {
    const { select } = await import('@clack/prompts')
    return select(options)
  },
  text: async (options: any) => {
    const { text } = await import('@clack/prompts')
    return text(options)
  },
  confirm: async (options: any) => {
    const { confirm } = await import('@clack/prompts')
    return confirm(options)
  },
  isCancel: async (value: unknown) => {
    const { isCancel } = await import('@clack/prompts')
    return isCancel(value)
  }
} as const
