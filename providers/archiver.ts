import { BaseProvider, ProviderNode, InjectionToken } from "../core";
import { logger, repository, WithLoggerService, WithRepositoryService } from "../interfaces";

export const archiverProvider = new ProviderNode({
	dependsOn: { repository, logger },
	provides: InjectionToken.node("Archiver"),
	provider: async (module) => {
		await ArchiverProvider.init(module)
	},
});

type ArchiverProviderOptions = WithRepositoryService & WithLoggerService & {
}
class ArchiverProvider extends BaseProvider<ArchiverProviderOptions> {
	public static async init(module: WithRepositoryService & WithLoggerService) {
		return new ArchiverProvider(module)
	}
}
