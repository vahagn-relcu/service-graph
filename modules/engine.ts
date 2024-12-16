import { Module } from "../core";
import { configProvider } from "../providers/config";
import { databaseProvider } from "../providers/database";
import { loggerProvider } from "../providers/logger";
import { repositoryProvider } from "../providers/repository";
import { schedulerProvider } from "../providers/scheduler";
import { schemaProvider } from "../providers/schema";

export default new Module("Engine", [
	configProvider,
	databaseProvider,
	schemaProvider,
	repositoryProvider,
	loggerProvider,
	schedulerProvider
])
