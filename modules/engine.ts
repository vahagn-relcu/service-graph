import { Module } from "../core";
import { configProvider } from "../providers/config";
import { databaseProvider } from "../providers/database";
import { repositoryProvider } from "../providers/repository";
import { schemaProvider } from "../providers/schema";

export default new Module([
	databaseProvider,
	repositoryProvider,
	schemaProvider,
	configProvider,
])
