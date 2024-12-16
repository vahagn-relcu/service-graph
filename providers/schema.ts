import { BaseProvider, ProviderNode } from "../core";
import { config, database, ISchemaService, schema, WithConfigService, WithDatabaseService } from "../interfaces";

export const schemaProvider = new ProviderNode({
	dependsOn: { database, config },
	provides: schema,
	provider: async ({ database, config }) => {
		return SchemaProvider.init({ database, config });
	},
});

type SchemaProviderOptions = WithConfigService & WithDatabaseService & {
	classes: Record<string, string[]>
}

class SchemaProvider extends BaseProvider<SchemaProviderOptions> implements ISchemaService {
	public static async init(options: WithConfigService & WithDatabaseService) {
		const [classes] = await options.database.callSql<Record<string, string[]>>(`select * from schemas`);
		if (!classes) {
			console.log("Reading path", options.config.getConfig().schema.path)
			console.log("Populating classes")
			await options.database.callSql(`insert into schemas () values (...)`)
		}

		return new SchemaProvider({ ...options, classes })
	}

	public getSchema(className: string): string[] {
		return this.app.classes[className]
	}
}

