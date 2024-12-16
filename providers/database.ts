import { BaseProvider, ProviderNode } from "../core";
import { config, database, IDatabaseService, logger, WithConfigService, WithLoggerService } from "../interfaces";

export const databaseProvider = new ProviderNode({
	dependsOn: { config, logger },
	provides: database,
	provider: async (module) => {
		return DatabaseProvider.init(module)
	},
});

type DatabaseProviderOptions = WithConfigService & WithLoggerService & {
	connection: unknown
}
class DatabaseProvider extends BaseProvider<DatabaseProviderOptions> implements IDatabaseService {
	public static async init(options: WithConfigService & WithLoggerService) {
		const connection = await new Promise<object>((resolve) => setTimeout(() => {
			console.log(`Connected to ${options.config.getConfig().database.url}`)
			resolve({})
		}, 1000))
		return new DatabaseProvider({ ...options, connection })
	}

	public async callSql<TResult>(sql: string): Promise<TResult[]> {
		this.app.logger.log("Calling sql", sql)
		return [{
			id: sql
		} as TResult]
	}
}

