import { InjectionToken } from "../core";

export interface ISchemaService {
	getSchema(className: string): string[];
}
export const schema = new InjectionToken<ISchemaService>("Schema");
export interface WithSchemaService {
	schema: ISchemaService
}

