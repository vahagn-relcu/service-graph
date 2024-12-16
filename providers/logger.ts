import { BaseProvider, InjectionToken, ProviderNode } from "../core";
import { config, database, ILog, ILoggerService, logger, WithConfigService, WithDatabaseService, WithLoggerService } from "../interfaces";
import { scheduler, WithSchedulerService } from "../interfaces/scheduler";

export const loggerProvider = new ProviderNode({
	dependsOn: { config },
	provides: logger,
	provider: async (module) => {
		return LoggerProvider.init(module)
	},
}).after({
	dependsOn: { config, logger, database, scheduler },
	provides: InjectionToken.node("DatabaseLogger"),
	provider: async (module) => {
		return DatabaseLoggerProvider.init(module)
	}
});

type LoggerProviderOptions = WithConfigService
class LoggerProvider extends BaseProvider<LoggerProviderOptions> implements ILoggerService {
	private logs: ILog[] = []

	public static async init(module: WithConfigService) {
		return new LoggerProvider(module)
	}

	public log(...texts: string[]): void {
		this.logs.push({
			texts,
			createdAt: new Date(),
		})
	}

	public collect(): ILog[] {
		const logs = this.logs;
		this.logs = [];
		return logs;
	}
}

type DatabaseLoggerProviderOptions = WithLoggerService & WithDatabaseService & WithConfigService & WithSchedulerService
class DatabaseLoggerProvider extends BaseProvider<DatabaseLoggerProviderOptions> {
	public static async init(module: DatabaseLoggerProviderOptions) {
		const node = new DatabaseLoggerProvider(module)

		const syncMillis = module.config.getConfig().logger.syncSeconds * 1000
		module.scheduler.schedule(node, "handleSave", syncMillis)

		node.onStop(() => console.error("Logs not saved to database", module.logger.collect()))

		return node
	}

	public async handleSave() {
		const logs = this.app.logger.collect()
		await this.app.database.callSql(`insert into logs (texts) values (${logs})`)
	}
}
