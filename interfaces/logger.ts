import { InjectionToken } from "../core";

export interface ILoggerService {
	log(...texts: string[]): void
	collect(): ILog[]
}

export interface ILog {
	texts: string[]
	createdAt: Date
}

export const logger = new InjectionToken<ILoggerService>("Logger");
export interface WithLoggerService {
	logger: ILoggerService;
}
