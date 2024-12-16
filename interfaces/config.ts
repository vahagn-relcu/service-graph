import { InjectionToken } from "../core";

export interface IConfig {
	database: {
		url: string;
	}
	schema: {
		path: string;
	}
	logger: {
		syncSeconds: number;
	}
}
export interface IConfigService {
	getConfig(): IConfig
}

export const config = new InjectionToken<IConfigService>("Config");
export interface WithConfigService {
	config: IConfigService;
}
