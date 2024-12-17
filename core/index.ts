import { Graph, GraphEdge, GraphNode } from "./graph";

export class InjectionToken<_TResolver> {
	public id: symbol;
	constructor(public name: string) {
		this.id = Symbol(name);
	}

	public isSame<TOther>(other: InjectionToken<TOther>) {
		return this.id === other.id;
	}

	public static node(name: string) {
		return new InjectionToken<StoppableService>(name)
	}
}

type InjectionTokenToResolver<TProgressPoint> =
	TProgressPoint extends InjectionToken<infer TResolver> ? TResolver : never;
type InjectionTokenMapToResolvers<
	TInjections extends Record<string, InjectionToken<any>>,
> = {
		[K in keyof TInjections]: InjectionTokenToResolver<TInjections[K]>;
	};
type ProviderNodeOptions<
	TDeps extends Record<string, InjectionToken<any>>,
	TExports extends InjectionToken<any>,
> = {
	dependsOn: TDeps;
	provides: TExports;
	provider: (
		deps: InjectionTokenMapToResolvers<TDeps>,
	) => Promise<InjectionTokenToResolver<TExports>>;
};
export class ProviderNode<
	TDeps extends Record<string, InjectionToken<any>>,
	TExports extends InjectionToken<any>,
> {
	constructor(public options: ProviderNodeOptions<TDeps, TExports>) { }
	public after<
		TDeps extends Record<string, InjectionToken<any>>,
		TExports extends InjectionToken<any>,
	>(options: ProviderNodeOptions<TDeps, TExports>) {
		const next = new ProviderNode(options);
		return [this, next]
	}

	public requires() {
		return Object.values(this.options.dependsOn).map((injection) => injection.id)
	}
}

export abstract class StoppableService {
	private callbacks: Set<() => void> = new Set()
	public onStop(callback: () => void) {
		this.callbacks.add(callback)
	}

	public stop() {
		for (const callback of this.callbacks.values()) {
			try {
				callback()
			} catch (e) {
				console.error("Failed to stop node", e)
			}
		}
	}
}


export abstract class BaseProvider<TServices> extends StoppableService {
	constructor(protected app: TServices) {
		super()
	}
}

type AnyInjectionToken = InjectionToken<any>
type AnyProviderNode = ProviderNode<any, AnyInjectionToken>

export class Module {
	public nodes: AnyProviderNode[]
	constructor(public name: string, nodes: (AnyProviderNode | AnyProviderNode[])[], public attached: Module[] = []) {
		this.nodes = nodes.flatMap((node) => {
			if (Array.isArray(node)) {
				return node
			}
			return [node]
		})
	}

	public print() {
		for (const node of this.nodes) {
			console.log(node.options.provides.name)
		}
	}

	public attach(other: Module): Module {
		this.attached.push(other);
		return this;
	}

	public async start(): Promise<Application> {
		const app = new Application();
		const topological = this.toGraph().toTopological()
		console.log("top", topological.map(t => t.map(x => x.name)))
		for (const nodes of topological) {
			await Promise.all(
				nodes.map(async (node) => {
					const parameters = app.getParameters(node.data.options.dependsOn);
					const provider = await node.data.options.provider(parameters)
					app.add(node.data.options.provides, provider)
				})
			)
		}

		return app
	}

	public toGraph(): Graph<AnyProviderNode, null> {
		const graphNodes = this.nodes.map((node) =>
			new GraphNode<AnyProviderNode>(node.options.provides.id, node.options.provides.name, node, this.name)
		)
		const graphEdges = this.nodes.flatMap((node) =>
			Object.values(node.options.dependsOn as Record<string, AnyInjectionToken>).map((injection) => new GraphEdge<null>(node.options.provides.id, injection.id, "requires", null))
		)
		const current = new Graph(graphNodes, graphEdges)
		return this.attached.reduce((graph, other) => graph.attach(other.toGraph()), current)
	}
}

export class Application {
	private container: Map<symbol, any>
	constructor() {
		this.container = new Map()
	}

	public get<TResolver>(injection: InjectionToken<TResolver>): TResolver {
		const exists = this.container.has(injection.id)
		if (!exists) {
			throw new Error("Injection " + injection.name + " not provided")
		}

		return this.container.get(injection.id)!
	}

	public add<TResolver>(injection: InjectionToken<TResolver>, provider: TResolver) {
		const injectionExists = this.container.has(injection.id)
		if (injectionExists) {
			throw new Error("Adding same injection twice")
		}

		this.container.set(injection.id, provider)
	}

	public getParameters(dependsOn: Record<string, InjectionToken<any>>) {
		const parameterEntries = Object.entries(dependsOn).map(([key, injection]) => {
			if (!this.container.has(injection.id)) {
				throw new Error("Provider not found for " + injection.name)
			}

			const provider = this.container.get(injection.id)
			return [key, provider]
		})
		return Object.fromEntries(
			parameterEntries
		)
	}

	public stop() {
		for (const provider of this.container.values()) {
			if (provider instanceof StoppableService) {
				provider.stop()
			}
		}
	}
}
