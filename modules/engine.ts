import { Module } from "../core";
import { configProvider } from "../providers/config";
import { databaseProvider } from "../providers/database";
import { repositoryProvider } from "../providers/repository";
import { schemaProvider } from "../providers/schema";

export default new Module("Engine", [
	databaseProvider,
	repositoryProvider,
	schemaProvider,
	configProvider,
])
