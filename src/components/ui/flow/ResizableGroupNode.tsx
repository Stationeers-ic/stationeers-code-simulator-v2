import { Box } from "@chakra-ui/react";
import type { Node } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";

const HANDLE_SIZE = 10;
const MIN_WIDTH = 100;
const MIN_HEIGHT = 100;

type ResizeHandle = "se" | "sw" | "ne" | "nw" | "e" | "w" | "n" | "s";

interface ResizableGroupNodeData extends Record<string, unknown> {
	label?: string;
	backgroundColor?: string;
	borderColor?: string;
}

interface HandleConfig {
	handle: ResizeHandle;
	cursor: string;
	style: Record<string, string>;
}

const CORNER_HANDLES: HandleConfig[] = [
	{
		handle: "nw",
		cursor: "nw-resize",
		style: { top: `${-HANDLE_SIZE / 2}px`, left: `${-HANDLE_SIZE / 2}px` },
	},
	{
		handle: "ne",
		cursor: "ne-resize",
		style: { top: `${-HANDLE_SIZE / 2}px`, right: `${-HANDLE_SIZE / 2}px` },
	},
	{
		handle: "sw",
		cursor: "sw-resize",
		style: { bottom: `${-HANDLE_SIZE / 2}px`, left: `${-HANDLE_SIZE / 2}px` },
	},
	{
		handle: "se",
		cursor: "se-resize",
		style: { bottom: `${-HANDLE_SIZE / 2}px`, right: `${-HANDLE_SIZE / 2}px` },
	},
];

const SIDE_HANDLES: HandleConfig[] = [
	{
		handle: "w",
		cursor: "w-resize",
		style: { top: "25%", left: `${-HANDLE_SIZE / 2}px`, width: `${HANDLE_SIZE}px`, height: "50%" },
	},
	{
		handle: "e",
		cursor: "e-resize",
		style: { top: "25%", right: `${-HANDLE_SIZE / 2}px`, width: `${HANDLE_SIZE}px`, height: "50%" },
	},
	{
		handle: "n",
		cursor: "n-resize",
		style: { left: "25%", top: `${-HANDLE_SIZE / 2}px`, width: "50%", height: `${HANDLE_SIZE}px` },
	},
	{
		handle: "s",
		cursor: "s-resize",
		style: { left: "25%", bottom: `${-HANDLE_SIZE / 2}px`, width: "50%", height: `${HANDLE_SIZE}px` },
	},
];

const BASE_HANDLE_STYLE = {
	position: "absolute" as const,
	background: "rgba(100, 150, 255, 0.5)",
	border: "1px solid rgba(100, 150, 255, 0.8)",
	borderRadius: "2px",
	zIndex: 10,
};

const CORNER_SIZE = {
	width: `${HANDLE_SIZE}px`,
	height: `${HANDLE_SIZE}px`,
};

type ResizableGroupNodeProps = {
	data: ResizableGroupNodeData;
	id: string;
};

export function ResizableGroupNode({ data, id }: ResizableGroupNodeProps) {
	const { getNode, setNodes, getViewport } = useReactFlow();
	const nodeRef = useRef<HTMLDivElement>(null);
	const [isResizing, setIsResizing] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
	const startPos = useRef({
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		nodeX: 0,
		nodeY: 0,
		zoom: 1,
	});

	const backgroundColor = data?.backgroundColor || "rgba(0, 0, 255, 0.1)";
	const borderColor = data?.borderColor || "blue.500";

	const initializeInteraction = useCallback(
		(e: React.MouseEvent, isResize: boolean, handle?: ResizeHandle) => {
			e.stopPropagation();
			e.preventDefault();

			const node = getNode(id);
			const viewport = getViewport();
			if (!node) return;

			if (isResize) {
				setIsResizing(true);
				setResizeHandle(handle || null);
			} else {
				setIsDragging(true);
			}

			startPos.current = {
				x: e.clientX,
				y: e.clientY,
				width: node.style?.width ? Number(node.style.width) : node.width || 170,
				height: node.style?.height ? Number(node.style.height) : node.height || 140,
				nodeX: node.position.x,
				nodeY: node.position.y,
				zoom: viewport.zoom,
			};
		},
		[id, getNode, getViewport],
	);

	const handleLabelMouseDown = useCallback(
		(e: React.MouseEvent) => initializeInteraction(e, false),
		[initializeInteraction],
	);

	const handleResizeMouseDown = useCallback(
		(e: React.MouseEvent, handle: ResizeHandle) => initializeInteraction(e, true, handle),
		[initializeInteraction],
	);

	const calculateNewDimension = useCallback((current: number, delta: number, min: number, isInverse: boolean) => {
		const potential = isInverse ? current - delta : current + delta;
		return Math.max(min, potential);
	}, []);

	const calculateResizeDeltas = useCallback(
		(deltaX: number, deltaY: number, handle: ResizeHandle) => {
			let newWidth = startPos.current.width;
			let newHeight = startPos.current.height;
			let newX = startPos.current.nodeX;
			let newY = startPos.current.nodeY;

			if (handle.includes("e")) {
				newWidth = calculateNewDimension(startPos.current.width, deltaX, MIN_WIDTH, false);
			}
			if (handle.includes("w")) {
				const potentialWidth = startPos.current.width - deltaX;
				if (potentialWidth >= MIN_WIDTH) {
					newWidth = potentialWidth;
					newX = startPos.current.nodeX + deltaX;
				} else {
					newWidth = MIN_WIDTH;
					newX = startPos.current.nodeX + (startPos.current.width - MIN_WIDTH);
				}
			}
			if (handle.includes("s")) {
				newHeight = calculateNewDimension(startPos.current.height, deltaY, MIN_HEIGHT, false);
			}
			if (handle.includes("n")) {
				const potentialHeight = startPos.current.height - deltaY;
				if (potentialHeight >= MIN_HEIGHT) {
					newHeight = potentialHeight;
					newY = startPos.current.nodeY + deltaY;
				} else {
					newHeight = MIN_HEIGHT;
					newY = startPos.current.nodeY + (startPos.current.height - MIN_HEIGHT);
				}
			}

			return { newWidth, newHeight, newX, newY };
		},
		[calculateNewDimension],
	);

	useEffect(() => {
		if (!isDragging && !isResizing) return;

		const handleMouseMove = (e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();

			const deltaX = (e.clientX - startPos.current.x) / startPos.current.zoom;
			const deltaY = (e.clientY - startPos.current.y) / startPos.current.zoom;

			if (isDragging) {
				const newX = startPos.current.nodeX + deltaX;
				const newY = startPos.current.nodeY + deltaY;

				setNodes((nodes) => nodes.map((node) => (node.id === id ? { ...node, position: { x: newX, y: newY } } : node)));
			} else if (isResizing && resizeHandle) {
				const { newWidth, newHeight, newX, newY } = calculateResizeDeltas(deltaX, deltaY, resizeHandle);

				setNodes((nodes) =>
					nodes.map((node) =>
						node.id === id
							? {
									...node,
									position: { x: newX, y: newY },
									style: { ...node.style, width: newWidth, height: newHeight },
								}
							: node,
					),
				);
			}
		};

		const handleMouseUp = (e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsResizing(false);
			setIsDragging(false);
			setResizeHandle(null);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, isResizing, resizeHandle, id, setNodes, calculateResizeDeltas]);

	const renderHandle = useCallback(
		({ handle, cursor, style }: HandleConfig, isCorner: boolean) => (
			<Box
				key={handle}
				{...BASE_HANDLE_STYLE}
				{...(isCorner ? CORNER_SIZE : {})}
				{...style}
				cursor={cursor}
				transition={isResizing ? "none" : "background 0.2s"}
				onMouseDown={(e) => handleResizeMouseDown(e, handle)}
				className="nodrag nopan"
				_hover={{ background: "rgba(100, 150, 255, 0.8)" }}
			/>
		),
		[isResizing, handleResizeMouseDown],
	);

	return (
		<Box
			ref={nodeRef}
			position="relative"
			width="100%"
			height="100%"
			border="2px solid"
			borderColor={borderColor}
			borderRadius="md"
			bg={backgroundColor}
			p={2}
			className="nodrag"
		>
			{data?.label && (
				<Box
					position="absolute"
					top={-6}
					left={2}
					bg={borderColor}
					px={2}
					py={0.5}
					borderRadius="sm"
					fontSize="xs"
					fontWeight="bold"
					cursor={isDragging ? "grabbing" : "grab"}
					userSelect="none"
					onMouseDown={handleLabelMouseDown}
					_hover={{ opacity: 0.8 }}
					_active={{ opacity: 0.6 }}
					zIndex={11}
				>
					{data.label}
				</Box>
			)}

			{CORNER_HANDLES.map((config) => renderHandle(config, true))}
			{SIDE_HANDLES.map((config) => renderHandle(config, false))}
		</Box>
	);
}

// Экспорт типа для использования в других местах
export type ResizableGroupNodeType = Node<ResizableGroupNodeData>;
