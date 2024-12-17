import { BaseProvider, ProviderNode } from "../core";
import { config, IConfig, IConfigService } from "../interfaces";


export const configProvider = new ProviderNode({
	dependsOn: {},
	provides: config,
	provider: async () => {
		return ConfigProvider.init()
	},
});

type ConfigProviderOptions = {
	config: IConfig
}
class ConfigProvider extends BaseProvider<ConfigProviderOptions> implements IConfigService {
	public static async init() {
		console.log("Reading from file")
		return new ConfigProvider({
			config: {
				database: {
					url: "psql://somethign"
				},
				schema: {
					path: "./schemas"
				},
				logger: {
					syncSeconds: 10
				}
			},
		})
	}

	public getConfig(): IConfig {
		return this.app.config;
	}
}
