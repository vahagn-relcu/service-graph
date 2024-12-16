import { BaseProvider, ProviderNode } from "../core";
import { config, database, IDatabaseService, WithConfigService } from "../interfaces";

export const databaseProvider = new ProviderNode({
	dependsOn: { config },
	provides: database,
	provider: async ({ config }) => {
		return DatabaseProvider.init({ config })
	},
});

type DatabaseProviderOptions = WithConfigService & {
	connection: unknown
}
class DatabaseProvider extends BaseProvider<DatabaseProviderOptions> implements IDatabaseService {
	public static async init(options: WithConfigService) {
		const connection = await new Promise<object>((resolve) => setTimeout(() => {
			console.log(`Connected to ${options.config.getConfig().database.url}`)
			resolve({})
		}, 1000))
		return new DatabaseProvider({ ...options, connection })
	}

	public async callSql<TResult>(sql: string): Promise<TResult[]> {
		return [{
			id: sql
		} as TResult]
	}
}

