import type { ICourseRepository } from './repositories/ICourseRepository'
import type { IAuthRepository } from './repositories/IAuthRepository'
import type { IArticleRepository } from './repositories/IArticleRepository'
import type { ITransactionRepository } from './repositories/ITransactionRepository'
import type { IDashboardRepository } from './repositories/IDashboardRepository'
import type { IUserRepository } from './repositories/IUserRepository'

interface Repositories {
  courseRepo: ICourseRepository
  authRepo: IAuthRepository
  articleRepo: IArticleRepository
  transactionRepo: ITransactionRepository
  dashboardRepo: IDashboardRepository
  userRepo: IUserRepository
}

let _repos: Repositories | null = null

export function injectRepositories(repos: Repositories): void {
  _repos = repos
}

function requireRepo<T>(name: string, repo: T | undefined): T {
  if (!repo) throw new Error(`Repository "${name}" not injected — call injectRepositories() first`)
  return repo
}

export const repos = {
  get course(): ICourseRepository {
    return requireRepo('courseRepo', _repos?.courseRepo)
  },
  get auth(): IAuthRepository {
    return requireRepo('authRepo', _repos?.authRepo)
  },
  get article(): IArticleRepository {
    return requireRepo('articleRepo', _repos?.articleRepo)
  },
  get transaction(): ITransactionRepository {
    return requireRepo('transactionRepo', _repos?.transactionRepo)
  },
  get dashboard(): IDashboardRepository {
    return requireRepo('dashboardRepo', _repos?.dashboardRepo)
  },
  get user(): IUserRepository {
    return requireRepo('userRepo', _repos?.userRepo)
  },
}
