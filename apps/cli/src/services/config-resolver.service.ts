import type { UserConfig, ResolvedConfig } from '../types/config'
import { cliConfig } from '../config/cli.config'
import { TEMPLATE_MAP } from '../constant/template.const'

export class ConfigResolver {
  /**
   * Resolve final config by merging default and user config
   */
  static resolve(userConfig: UserConfig | null): ResolvedConfig {
    return {
      github: {
        owner: userConfig?.github?.owner ?? cliConfig.github.owner,
        repository: userConfig?.github?.repository ?? cliConfig.github.repository,
        branch: userConfig?.github?.branch ?? cliConfig.github.branch,
        templatesPath: userConfig?.github?.templatesPath ?? cliConfig.github.templatesPath
      },
      templateMap: {
        ...TEMPLATE_MAP,
        ...userConfig?.customTemplates
      },
      defaultProjectName: userConfig?.defaultProjectName ?? 'my-project',
      autoConfirm: userConfig?.autoConfirm ?? false,
      openBrowser: userConfig?.openBrowser ?? true,
      placeholders: {
        projectName: userConfig?.placeholders?.projectName ?? 'my-awesome-project',
        submoduleUrl: userConfig?.placeholders?.submoduleUrl ?? 'https://github.com/user/repo',
        submodulePath: userConfig?.placeholders?.submodulePath ?? 'templates/my-submodule'
      }
    }
  }
}
