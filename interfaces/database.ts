import { InjectionToken } from "../core";

export interface IDatabaseService {
	callSql<TResult>(sql: string): Promise<TResult[]>;
}
export const database = new InjectionToken<IDatabaseService>("Database");
export interface WithDatabaseService {
	database: IDatabaseService
}

