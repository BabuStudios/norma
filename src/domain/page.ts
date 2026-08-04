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
 * The classic Visio flowchart stencil: process, decision, terminator
 * (start/end), data (input/output), document, subprocess (predefined
 * process), preparation and connector — the shapes that cover the large
 * majority of process diagrams.
 */
export type DiagramShape =
  | 'process'
  | 'decision'
  | 'terminator'
  | 'data'
  | 'document'
  | 'predefined'
  | 'preparation'
  | 'connector';

export const DIAGRAM_SHAPES: DiagramShape[] = [
  'process',
  'decision',
  'terminator',
  'data',
  'document',
  'predefined',
  'preparation',
  'connector',
];

export interface DiagramNode {
  id: string;
  /** Canvas-local pixel position, top-left corner. */
  x: number;
  y: number;
  width: number;
  height: number;
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

/** Starting size for a new diagram node — after that, the box is resizable. */
export const DIAGRAM_NODE_WIDTH = 150;
export const DIAGRAM_NODE_HEIGHT = 56;

export const DIAGRAM_NODE_MIN_WIDTH = 80;
export const DIAGRAM_NODE_MIN_HEIGHT = 40;

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
    width: DIAGRAM_NODE_WIDTH,
    height: DIAGRAM_NODE_HEIGHT,
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

export function resizeDiagramNode(
  blocks: PageBlock[],
  blockId: string,
  nodeId: string,
  width: number,
  height: number,
): PageBlock[] {
  return mapDiagram(blocks, blockId, (block) => ({
    ...block,
    nodes: block.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            width: Math.max(DIAGRAM_NODE_MIN_WIDTH, width),
            height: Math.max(DIAGRAM_NODE_MIN_HEIGHT, height),
          }
        : node,
    ),
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

/**
 * Snapping while dragging or resizing a box — lining boxes up and giving
 * them even gaps by eye is fiddly, so a drag position is pulled toward a
 * grid and, when close enough, toward another box's edges/center or toward
 * an equal gap between two neighbors either side of it.
 */
export interface SnapBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SnapGuide {
  orientation: 'vertical' | 'horizontal';
  /** x for a vertical guide, y for a horizontal one. */
  position: number;
}

const SNAP_GRID = 20;
const SNAP_THRESHOLD = 6;

export function snapToGrid(value: number, grid = SNAP_GRID): number {
  return Math.round(value / grid) * grid;
}

function edgeCandidates(pos: number, size: number): number[] {
  return [pos, pos + size / 2, pos + size];
}

function bestEdgeSnap(
  movingPos: number,
  movingSize: number,
  others: { pos: number; size: number }[],
): { delta: number; guide: number } | null {
  let best: { delta: number; guide: number } | null = null;
  for (const other of others) {
    for (const moving of edgeCandidates(movingPos, movingSize)) {
      for (const target of edgeCandidates(other.pos, other.size)) {
        const diff = target - moving;
        if (Math.abs(diff) <= SNAP_THRESHOLD && (!best || Math.abs(diff) < Math.abs(best.delta))) {
          best = { delta: diff, guide: target };
        }
      }
    }
  }
  return best;
}

/** Whether two spans (start, start + size) overlap — used to decide whether
 *  a pair of boxes reads as "the same row" or "the same column". */
function overlaps(aStart: number, aSize: number, bStart: number, bSize: number): boolean {
  return aStart < bStart + bSize && bStart < aStart + aSize;
}

function closestLeftAndRight(
  moving: SnapBox,
  others: SnapBox[],
): { left: SnapBox; right: SnapBox } | null {
  let left: SnapBox | null = null;
  let right: SnapBox | null = null;
  for (const other of others) {
    if (!overlaps(moving.y, moving.height, other.y, other.height)) continue;
    if (other.x + other.width <= moving.x) {
      if (!left || other.x + other.width > left.x + left.width) left = other;
    } else if (other.x >= moving.x + moving.width) {
      if (!right || other.x < right.x) right = other;
    }
  }
  return left && right ? { left, right } : null;
}

function closestAboveAndBelow(
  moving: SnapBox,
  others: SnapBox[],
): { above: SnapBox; below: SnapBox } | null {
  let above: SnapBox | null = null;
  let below: SnapBox | null = null;
  for (const other of others) {
    if (!overlaps(moving.x, moving.width, other.x, other.width)) continue;
    if (other.y + other.height <= moving.y) {
      if (!above || other.y + other.height > above.y + above.height) above = other;
    } else if (other.y >= moving.y + moving.height) {
      if (!below || other.y < below.y) below = other;
    }
  }
  return above && below ? { above, below } : null;
}

/** The x that splits the gap between a left and right neighbor evenly
 *  around the moving box, so all three read as evenly spaced. */
function equalGapTargetX(
  moving: SnapBox,
  others: SnapBox[],
): { x: number; guideLeft: number; guideRight: number } | null {
  const pair = closestLeftAndRight(moving, others);
  if (!pair) return null;
  const { left, right } = pair;
  const gapTotal = right.x - (left.x + left.width);
  if (gapTotal < moving.width) return null;
  return {
    x: left.x + left.width + (gapTotal - moving.width) / 2,
    guideLeft: left.x + left.width,
    guideRight: right.x,
  };
}

function equalGapTargetY(
  moving: SnapBox,
  others: SnapBox[],
): { y: number; guideTop: number; guideBottom: number } | null {
  const pair = closestAboveAndBelow(moving, others);
  if (!pair) return null;
  const { above, below } = pair;
  const gapTotal = below.y - (above.y + above.height);
  if (gapTotal < moving.height) return null;
  return {
    y: above.y + above.height + (gapTotal - moving.height) / 2,
    guideTop: above.y + above.height,
    guideBottom: below.y,
  };
}

export function snapNodePosition(
  moving: SnapBox,
  others: SnapBox[],
): { x: number; y: number; guides: SnapGuide[] } {
  let x = snapToGrid(moving.x);
  let y = snapToGrid(moving.y);
  const guides: SnapGuide[] = [];

  const edgeX = bestEdgeSnap(
    moving.x,
    moving.width,
    others.map((other) => ({ pos: other.x, size: other.width })),
  );
  const gapX = equalGapTargetX(moving, others);
  const gapXDelta = gapX ? gapX.x - moving.x : null;

  if (
    gapX &&
    gapXDelta !== null &&
    Math.abs(gapXDelta) <= SNAP_THRESHOLD &&
    (!edgeX || Math.abs(gapXDelta) < Math.abs(edgeX.delta))
  ) {
    x = gapX.x;
    guides.push({ orientation: 'vertical', position: gapX.guideLeft });
    guides.push({ orientation: 'vertical', position: gapX.guideRight });
  } else if (edgeX) {
    x = moving.x + edgeX.delta;
    guides.push({ orientation: 'vertical', position: edgeX.guide });
  }

  const edgeY = bestEdgeSnap(
    moving.y,
    moving.height,
    others.map((other) => ({ pos: other.y, size: other.height })),
  );
  const gapY = equalGapTargetY(moving, others);
  const gapYDelta = gapY ? gapY.y - moving.y : null;

  if (
    gapY &&
    gapYDelta !== null &&
    Math.abs(gapYDelta) <= SNAP_THRESHOLD &&
    (!edgeY || Math.abs(gapYDelta) < Math.abs(edgeY.delta))
  ) {
    y = gapY.y;
    guides.push({ orientation: 'horizontal', position: gapY.guideTop });
    guides.push({ orientation: 'horizontal', position: gapY.guideBottom });
  } else if (edgeY) {
    y = moving.y + edgeY.delta;
    guides.push({ orientation: 'horizontal', position: edgeY.guide });
  }

  return { x, y, guides };
}
