import { createFileRoute } from "@tanstack/react-router";
import {
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	Background,
	type Connection,
	type Edge,
	type EdgeChange,
	type Node,
	type NodeChange,
	ReactFlow,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import "@xyflow/react/dist/style.css";
import { Box } from "@chakra-ui/react";
import { ResizableGroupNode } from "@/components/ui/flow/ResizableGroupNode";

export const Route = createFileRoute("/envEditor")({
	component: EnvEditor,
});

// Определяем типы нод
const nodeTypes = {
	resizableGroup: ResizableGroupNode,
};

export const initialNodes: Node[] = [
	{
		id: "A",
		type: "resizableGroup", // используем новый тип
		data: {
			label: "Group2",
			backgroundColor: "rgba(0, 100, 255, 0.15)", // можно менять
			borderColor: "cyan.500", // можно менять
		},

		position: { x: 0, y: 0 },
		style: {
			width: 170,
			height: 140,
		},
	},
	{
		id: "B",
		type: "input",
		data: { label: "child node 1" },
		position: { x: 10, y: 10 },
		parentId: "A",
		extent: "parent",
	},
	{
		id: "C",
		data: { label: "child node 2" },
		position: { x: 10, y: 90 },
		parentId: "A",
		extent: "parent",
	},
];

export const initialEdges: Edge[] = [
	{
		id: "b-c",
		source: "B",
		target: "C",
	},
];

function EnvEditor() {
	const [nodes, setNodes] = useState<Node[]>(initialNodes);
	const [edges, setEdges] = useState<Edge[]>(initialEdges);

	const onNodesChange = useCallback(
		(changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
		[setNodes],
	);

	const onEdgesChange = useCallback(
		(changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
		[setEdges],
	);

	const onConnect = useCallback((connection: Connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);

	return (
		<Box width="100vw" height="100vh">
			<ReactFlow
				colorMode="dark"
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes} // добавляем типы нод
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				fitView
				attributionPosition="top-right"
			>
				<Background />
			</ReactFlow>
		</Box>
	);
}
