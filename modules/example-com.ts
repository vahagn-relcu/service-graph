import { Module } from "../core";
import { archiverProvider } from "../providers/archiver";
import engine from "./engine";

export default new Module("example.com", [
	archiverProvider
]).attach(engine)
