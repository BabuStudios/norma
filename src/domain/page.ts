/**
 * Editable content blocks for a page like Ledningssystem: free text and
 * hand-drawn process diagrams, authored by the company rather than shipped
 * with the catalogue. The page starts empty, same as every other register.
 */
export interface TextBlock {
  id: string;
  type: 'text';
  heading: string;
  body: string;
}

/**
 * The classic Visio flowchart stencil, narrowed to the four shapes that cover
 * almost every process diagram: process, decision, terminator (start/end)
 * and data (input/output).
 */
export type DiagramShape = 'process' | 'decision' | 'terminator' | 'data';

export const DIAGRAM_SHAPES: DiagramShape[] = ['process', 'decision', 'terminator', 'data'];

export interface DiagramNode {
  id: string;
  /** Canvas-local pixel position, top-left corner. */
  x: number;
  y: number;
  label: string;
  shape: DiagramShape;
}

export interface DiagramEdge {
  id: string;
  from: string;
  to: string;
}

export interface DiagramBlock {
  id: string;
  type: 'diagram';
  title: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export type PageBlock = TextBlock | DiagramBlock;

/** Fixed box size every diagram node renders at — kept in sync with the
 *  `.node` width/min-height in DiagramEditor.module.css, since edges are
 *  routed to the box edge using these dimensions rather than a measured DOM
 *  size. */
export const DIAGRAM_NODE_WIDTH = 150;
export const DIAGRAM_NODE_HEIGHT = 56;

let idCounter = 0;
/** Unique enough for one page's blocks — not crypto.randomUUID(), matching
 *  the id scheme evidence uploads already use. */
function genId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

function newTextBlock(heading: string): TextBlock {
  return { id: genId('text'), type: 'text', heading, body: '' };
}

function newDiagramBlock(title: string): DiagramBlock {
  return { id: genId('diagram'), type: 'diagram', title, nodes: [], edges: [] };
}

function newDiagramNode(label: string, shape: DiagramShape, index: number): DiagramNode {
  // Cascades new boxes across a 4-column grid instead of stacking them on
  // top of each other at a fixed origin.
  return {
    id: genId('node'),
    label,
    shape,
    x: 24 + (index % 4) * 180,
    y: 24 + Math.floor(index / 4) * 110,
  };
}

export function addTextBlock(blocks: PageBlock[], heading: string): PageBlock[] {
  return [...blocks, newTextBlock(heading)];
}

export function addDiagramBlock(blocks: PageBlock[], title: string): PageBlock[] {
  return [...blocks, newDiagramBlock(title)];
}

export function updateTextBlock(
  blocks: PageBlock[],
  id: string,
  patch: Partial<Pick<TextBlock, 'heading' | 'body'>>,
): PageBlock[] {
  return blocks.map((block) =>
    block.id === id && block.type === 'text' ? { ...block, ...patch } : block,
  );
}

export function updateDiagramTitle(blocks: PageBlock[], id: string, title: string): PageBlock[] {
  return blocks.map((block) =>
    block.id === id && block.type === 'diagram' ? { ...block, title } : block,
  );
}

export function removeBlock(blocks: PageBlock[], id: string): PageBlock[] {
  return blocks.filter((block) => block.id !== id);
}

export function moveBlock(blocks: PageBlock[], id: string, direction: 'up' | 'down'): PageBlock[] {
  const index = blocks.findIndex((block) => block.id === id);
  const target = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || target < 0 || target >= blocks.length) return blocks;
  const next = [...blocks];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function mapDiagram(
  blocks: PageBlock[],
  blockId: string,
  fn: (block: DiagramBlock) => DiagramBlock,
): PageBlock[] {
  return blocks.map((block) =>
    block.id === blockId && block.type === 'diagram' ? fn(block) : block,
  );
}

export function addDiagramNode(
  blocks: PageBlock[],
  blockId: string,
  label: string,
  shape: DiagramShape,
): PageBlock[] {
  return mapDiagram(blocks, blockId, (block) => ({
    ...block,
    nodes: [...block.nodes, newDiagramNode(label, shape, block.nodes.length)],
  }));
}

export function moveDiagramNode(
  blocks: PageBlock[],
  blockId: string,
  nodeId: string,
  x: number,
  y: number,
): PageBlock[] {
  return mapDiagram(blocks, blockId, (block) => ({
    ...block,
    nodes: block.nodes.map((node) => (node.id === nodeId ? { ...node, x, y } : node)),
  }));
}

export function updateDiagramNodeLabel(
  blocks: PageBlock[],
  blockId: string,
  nodeId: string,
  label: string,
): PageBlock[] {
  return mapDiagram(blocks, blockId, (block) => ({
    ...block,
    nodes: block.nodes.map((node) => (node.id === nodeId ? { ...node, label } : node)),
  }));
}

export function removeDiagramNode(
  blocks: PageBlock[],
  blockId: string,
  nodeId: string,
): PageBlock[] {
  return mapDiagram(blocks, blockId, (block) => ({
    ...block,
    nodes: block.nodes.filter((node) => node.id !== nodeId),
    edges: block.edges.filter((edge) => edge.from !== nodeId && edge.to !== nodeId),
  }));
}

export function addDiagramEdge(
  blocks: PageBlock[],
  blockId: string,
  from: string,
  to: string,
): PageBlock[] {
  if (from === to) return blocks;
  return mapDiagram(blocks, blockId, (block) => {
    const exists = block.edges.some(
      (edge) => (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from),
    );
    if (exists) return block;
    return { ...block, edges: [...block.edges, { id: genId('edge'), from, to }] };
  });
}

export function removeDiagramEdge(
  blocks: PageBlock[],
  blockId: string,
  edgeId: string,
): PageBlock[] {
  return mapDiagram(blocks, blockId, (block) => ({
    ...block,
    edges: block.edges.filter((edge) => edge.id !== edgeId),
  }));
}

/**
 * Point where the ray from a box's center toward (dx, dy) crosses its edge,
 * so an arrow meets the box border instead of overlapping its label.
 */
export function boxEdgePoint(
  cx: number,
  cy: number,
  dx: number,
  dy: number,
  halfWidth: number,
  halfHeight: number,
): { x: number; y: number } {
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const scaleX = dx !== 0 ? halfWidth / Math.abs(dx) : Infinity;
  const scaleY = dy !== 0 ? halfHeight / Math.abs(dy) : Infinity;
  const scale = Math.min(scaleX, scaleY);
  return { x: cx + dx * scale, y: cy + dy * scale };
}
