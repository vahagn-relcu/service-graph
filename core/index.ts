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
		return new InjectionToken<void>(name)
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
		return new ProviderNode(options);
	}

	public requires() {
		return Object.values(this.options.dependsOn).map((injection) => injection.id)
	}
}

export abstract class BaseProvider<TServices> {
	constructor(protected app: TServices) {
	}
}

type AnyInjectionToken = InjectionToken<any>
type AnyProviderNode = ProviderNode<any, AnyInjectionToken>

export class Module {
	constructor(public nodes: AnyProviderNode[]) {
	}

	public print() {
		for (const node of this.nodes) {
			console.log(node.options.provides.name)
		}
	}

	public attach(other: Module): Module {
		return new Module([...this.nodes, ...other.nodes])
	}

	public async start() {
		const container = new Map<symbol, InjectionToken<any>>();
		const topological = this.toGraph().toTopological()
		for (const node of topological) {
			const parameters = dependsOnToParameters(node.data.options.dependsOn, container);
			const provider = await node.data.options.provider(parameters)
			addProviderToContainer(node.data.options.provides, provider, container)
		}
	}

	public toGraph(): Graph<AnyProviderNode, null> {
		const graphNodes = this.nodes.map((node) =>
			new GraphNode<AnyProviderNode>(node.options.provides.id, node.options.provides.name, node)
		)
		const graphEdges = this.nodes.flatMap((node) =>
			Object.values(node.options.dependsOn as Record<string, AnyInjectionToken>).map((injection) => new GraphEdge<null>(node.options.provides.id, injection.id, "requires", null))
		)
		return new Graph(graphNodes, graphEdges)
	}
}

function dependsOnToParameters(dependsOn: Record<string, InjectionToken<any>>, container: Map<symbol, any>): Record<string, any> {
	const parameterEntries = Object.entries(dependsOn).map(([key, injection]) => {
		if (!container.has(injection.id)) {
			throw new Error("Provider not found for " + injection.name)
		}

		const provider = container.get(injection.id)
		return [key, provider]
	})
	return Object.fromEntries(
		parameterEntries
	)
}

function addProviderToContainer(injection: InjectionToken<any>, provider: any, container: Map<symbol, any>): void {
	const injectionExists = container.has(injection.id)
	if (injectionExists) {
		throw new Error("Adding same injection twice")
	}

	container.set(injection.id, provider)
}
