import { BaseProvider, ProviderNode } from "../core";
import { database, IRepositoryService, repository, schema, WithDatabaseService, WithSchemaService } from "../interfaces";

export const repositoryProvider = new ProviderNode({
	dependsOn: { schema, database },
	provides: repository,
	provider: async ({ database, schema }) => {
		return RepositoryProvider.init({ database, schema })
	}
});

type RepositoryProviderOptions = WithSchemaService & WithDatabaseService & {

}
class RepositoryProvider extends BaseProvider<RepositoryProviderOptions> implements IRepositoryService {
	public static async init(options: WithSchemaService & WithDatabaseService) {
		return new RepositoryProvider({ ...options })
	}

	public async create(className: string, object: Record<string, unknown>) {
		const missingField = this.app.schema
			.getSchema(className)
			.find((field) => object[field] === undefined);
		if (missingField) {
			throw new Error("Missing field " + missingField);
		}
		const [{ id }] = await this.app.database.callSql<Record<string, string>>(
			`insert into ${className} (${Object.keys(object)}) values (${Object.values(object)})`,
		);

		return id;
	}
	public async delete(className: string, id: string) {
		await this.app.database.callSql(
			`delete from ${className} where id = ${id}`,
		);
	}
	public async find(className: string, filter: string) {
		return await this.app.database.callSql<Record<string, string>>(
			`select * from ${className} where ${filter}`,
		);
	}
}

