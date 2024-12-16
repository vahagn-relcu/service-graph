import { mapGetBind, mapSetBind, randomString } from "../utilities/map";

export class GraphNode<TNode> {
	constructor(public id: symbol, public name: string, public data: TNode, public group?: string) {
	}

	public getFromEdges<TEdge>(graph: Graph<TNode, TEdge>): GraphEdge<TEdge>[] {
		return graph.getFromEdges(this.id)
	}

	public getToEdges<TEdge>(graph: Graph<TNode, TEdge>): GraphEdge<TEdge>[] {
		return graph.getToEdges(this.id)
	}
}

export class GraphEdge<TEdge> {
	constructor(public from: symbol, public to: symbol, public name: string, public data: TEdge) {
	}

	public getFromNode<TNode>(graph: Graph<TNode, TEdge>): GraphNode<TNode> {
		return graph.getNode(this.from)
	}

	public getToNode<TNode>(graph: Graph<TNode, TEdge>): GraphNode<TNode> {
		return graph.getNode(this.to)
	}
}

type TopologicalDependency = "independent" | "requires" | "provides"
export class Graph<TNode, TEdge> {
	private nodeMap: Map<symbol, GraphNode<TNode>>;
	private fromToMap: Map<symbol, GraphEdge<TEdge>[]>;
	private toFromMap: Map<symbol, GraphEdge<TEdge>[]>;
	constructor(public readonly nodes: GraphNode<TNode>[], public readonly edges: GraphEdge<TEdge>[]) {
		this.nodeMap = new Map(nodes.map((node) => [node.id, node]))
		this.fromToMap = new Map<symbol, GraphEdge<TEdge>[]>()
		this.toFromMap = new Map<symbol, GraphEdge<TEdge>[]>()

		for (const edge of edges) {
			mapSetBind(this.fromToMap, edge.from, [], (to) => [...to, edge])
			mapSetBind(this.toFromMap, edge.to, [], (from) => [...from, edge])
		}
	}

	public getNode(id: symbol): GraphNode<TNode> {
		if (!this.nodeMap.has(id)) {
			throw new Error("Node does not exist")
		}
		return this.nodeMap.get(id)!
	}

	public getFromEdges(id: symbol): GraphEdge<TEdge>[] {
		return this.fromToMap.get(id) ?? []
	}

	public getToEdges(id: symbol): GraphEdge<TEdge>[] {
		return this.toFromMap.get(id) ?? []
	}

	public attach<TOtherNode, TOtherEdge>(other: Graph<TOtherNode, TOtherEdge>): Graph<TNode | TOtherNode, TEdge | TOtherEdge> {
		const nodes: GraphNode<TNode | TOtherNode>[] = [...this.nodes, ...other.nodes]
		const edges: GraphEdge<TEdge | TOtherEdge>[] = [...this.edges, ...other.edges]

		return new Graph(nodes, edges)
	}

	public populate(other: Graph<TNode, TEdge>): Graph<TNode, TEdge> {
		const nodes: GraphNode<TNode>[] = [...this.nodes, ...other.nodes]
		const edges: GraphEdge<TEdge>[] = [...this.edges, ...other.edges]

		return new Graph(nodes, edges)
	}

	public toTopological(checker: (edge: TEdge) => TopologicalDependency = () => "requires"): GraphNode<TNode>[] {
		// TODO
		return [...this.nodeMap.values()]
	}

	public toJSON() {
		type JsonNode = {
			id: string
			name: string
			group?: string
		}
		type JsonEdge = {
			source: string
			target: string
			name: string
		}
		const idToString = new Map<symbol, string>()
		const nodes: JsonNode[] = [];
		const edges: JsonEdge[] = [];

		for (const node of this.nodes) {
			nodes.push({
				id: mapGetBind(idToString, node.id, () => randomString()),
				name: node.name,
				group: node.group
			})
		}

		for (const edge of this.edges) {
			edges.push({
				source: mapGetBind(idToString, edge.from),
				target: mapGetBind(idToString, edge.to),
				name: edge.name,
			})
		}

		return JSON.stringify({ nodes, edges }, null, 2)
	}
}
