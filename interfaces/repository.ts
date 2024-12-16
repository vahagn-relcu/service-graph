import { InjectionToken } from "../core";

export interface IRepositoryService {
	create(className: string, object: Record<string, unknown>): Promise<string>;
	delete(className: string, id: string): Promise<void>;
	find(className: string, filter: string): Promise<Record<string, string>[]>;
}
export const repository = new InjectionToken<IRepositoryService>("Repository");
export interface WithRepositoryService {
	repository: IRepositoryService;
}

