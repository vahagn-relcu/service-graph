import { BaseProvider, ProviderNode, InjectionToken } from "../core";
import { repository, WithRepositoryService } from "../interfaces";

export const archiverProvider = new ProviderNode({
	dependsOn: { repository },
	provides: InjectionToken.node("Archiver"),
	provider: async (module) => {
		await ArchiverProvider.init(module)
	},
});

type ArchiverProviderOptions = WithRepositoryService & {
}
class ArchiverProvider extends BaseProvider<ArchiverProviderOptions> {
	public static async init(module: WithRepositoryService) {
		return new ArchiverProvider(module)
	}
}
