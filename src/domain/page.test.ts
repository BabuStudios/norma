import { describe, expect, it } from 'vitest';
import {
  addDiagramBlock,
  addDiagramEdge,
  addDiagramNode,
  addOrgChartBlock,
  addTextBlock,
  connectionPointCoords,
  edgePath,
  moveBlock,
  moveDiagramNode,
  removeBlock,
  removeDiagramEdge,
  removeDiagramNode,
  resizeDiagramNode,
  snapNodePosition,
  snapToGrid,
  toggleDiagramNodeDocument,
  updateDiagramBackgroundColor,
  updateDiagramNodeFillColor,
  updateDiagramNodeLabel,
  updateDiagramNodeTextColor,
  updateDiagramTitle,
  updateTextBlock,
  type DiagramBlock,
  type PageBlock,
  type SnapBox,
} from './page';

const addEdge = (blocks: PageBlock[], blockId: string, from: string, to: string): PageBlock[] =>
  addDiagramEdge(blocks, blockId, from, to, 'e', 'w', 'solid', 'straight', '#201e1d');

describe('text blocks', () => {
  it('adds a text block with the given heading and an empty body', () => {
    const blocks = addTextBlock([], 'Ny rubrik');
    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toMatchObject({ type: 'text', heading: 'Ny rubrik', body: '' });
  });

  it('updates only the targeted block', () => {
    const blocks = addTextBlock(addTextBlock([], 'A'), 'B');
    const [first, second] = blocks;
    const updated = updateTextBlock(blocks, second.id, { body: 'text' });
    expect(updated.find((b) => b.id === first.id)).toMatchObject({ heading: 'A', body: '' });
    expect(updated.find((b) => b.id === second.id)).toMatchObject({ heading: 'B', body: 'text' });
  });

  it('leaves diagram blocks untouched when updating text', () => {
    const blocks = addDiagramBlock(addTextBlock([], 'A'), 'Diagram');
    const diagram = blocks[1] as DiagramBlock;
    const updated = updateTextBlock(blocks, diagram.id, { body: 'ignored' });
    expect(updated[1]).toEqual(diagram);
  });
});

describe('diagram blocks', () => {
  it('adds a diagram block with no nodes or edges', () => {
    const blocks = addDiagramBlock([], 'Process');
    expect(blocks[0]).toMatchObject({ type: 'diagram', title: 'Process', nodes: [], edges: [] });
  });

  it('renames a diagram title without touching its nodes', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'Box', 'process');
    blocks = updateDiagramTitle(blocks, id, 'New title');
    const diagram = blocks[0] as DiagramBlock;
    expect(diagram.title).toBe('New title');
    expect(diagram.nodes).toHaveLength(1);
  });

  it('stamps a new node with the requested shape', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'Decide', 'decision');
    expect((blocks[0] as DiagramBlock).nodes[0].shape).toBe('decision');
  });

  it('cascades new node positions instead of stacking them', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    blocks = addDiagramNode(blocks, id, 'B', 'process');
    const [a, b] = (blocks[0] as DiagramBlock).nodes;
    expect(a.x).not.toBe(b.x);
  });

  it('moves a node to the given position', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    const nodeId = (blocks[0] as DiagramBlock).nodes[0].id;
    blocks = moveDiagramNode(blocks, id, nodeId, 300, 150);
    expect((blocks[0] as DiagramBlock).nodes[0]).toMatchObject({ x: 300, y: 150 });
  });

  it('starts every node at the default size', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    expect((blocks[0] as DiagramBlock).nodes[0]).toMatchObject({ width: 150, height: 56 });
  });

  it('resizes a node', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    const nodeId = (blocks[0] as DiagramBlock).nodes[0].id;
    blocks = resizeDiagramNode(blocks, id, nodeId, 240, 90);
    expect((blocks[0] as DiagramBlock).nodes[0]).toMatchObject({ width: 240, height: 90 });
  });

  it('will not resize a node smaller than the minimum', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    const nodeId = (blocks[0] as DiagramBlock).nodes[0].id;
    blocks = resizeDiagramNode(blocks, id, nodeId, 10, 5);
    const node = (blocks[0] as DiagramBlock).nodes[0];
    expect(node.width).toBeGreaterThanOrEqual(80);
    expect(node.height).toBeGreaterThanOrEqual(40);
  });

  it('relabels a node', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    const nodeId = (blocks[0] as DiagramBlock).nodes[0].id;
    blocks = updateDiagramNodeLabel(blocks, id, nodeId, 'Renamed');
    expect((blocks[0] as DiagramBlock).nodes[0].label).toBe('Renamed');
  });

  it('gives every new box and diagram a default fill, text and background color', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    const diagram = blocks[0] as DiagramBlock;
    expect(diagram.backgroundColor).toBeTruthy();
    expect(diagram.nodes[0].fillColor).toBeTruthy();
    expect(diagram.nodes[0].textColor).toBeTruthy();
  });

  it('recolors a box independently of its text', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    const nodeId = (blocks[0] as DiagramBlock).nodes[0].id;
    blocks = updateDiagramNodeFillColor(blocks, id, nodeId, '#ff0000');
    blocks = updateDiagramNodeTextColor(blocks, id, nodeId, '#00ff00');
    expect((blocks[0] as DiagramBlock).nodes[0]).toMatchObject({
      fillColor: '#ff0000',
      textColor: '#00ff00',
    });
  });

  it('recolors the diagram background', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = updateDiagramBackgroundColor(blocks, id, '#0000ff');
    expect((blocks[0] as DiagramBlock).backgroundColor).toBe('#0000ff');
  });

  it('starts every new box with no linked documents', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    expect((blocks[0] as DiagramBlock).nodes[0].linkedDocumentIds).toEqual([]);
  });

  it('links a document to a box, and unlinks it on a second toggle', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    const nodeId = (blocks[0] as DiagramBlock).nodes[0].id;

    blocks = toggleDiagramNodeDocument(blocks, id, nodeId, 'D001');
    expect((blocks[0] as DiagramBlock).nodes[0].linkedDocumentIds).toEqual(['D001']);

    blocks = toggleDiagramNodeDocument(blocks, id, nodeId, 'D001');
    expect((blocks[0] as DiagramBlock).nodes[0].linkedDocumentIds).toEqual([]);
  });

  it('links multiple documents to the same box independently', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    const nodeId = (blocks[0] as DiagramBlock).nodes[0].id;

    blocks = toggleDiagramNodeDocument(blocks, id, nodeId, 'D001');
    blocks = toggleDiagramNodeDocument(blocks, id, nodeId, 'D002');
    expect((blocks[0] as DiagramBlock).nodes[0].linkedDocumentIds).toEqual(['D001', 'D002']);
  });

  it('connects two nodes with an edge', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    blocks = addDiagramNode(blocks, id, 'B', 'process');
    const [a, b] = (blocks[0] as DiagramBlock).nodes;
    blocks = addEdge(blocks, id, a.id, b.id);
    expect((blocks[0] as DiagramBlock).edges).toEqual([
      expect.objectContaining({ from: a.id, to: b.id }),
    ]);
  });

  it('stores the requested attachment points, line style and color', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    blocks = addDiagramNode(blocks, id, 'B', 'process');
    const [a, b] = (blocks[0] as DiagramBlock).nodes;
    blocks = addDiagramEdge(blocks, id, a.id, b.id, 'se', 'nw', 'dashed', 'curved', '#ec3013');
    expect((blocks[0] as DiagramBlock).edges[0]).toMatchObject({
      fromPoint: 'se',
      toPoint: 'nw',
      lineStyle: 'dashed',
      lineShape: 'curved',
      color: '#ec3013',
    });
  });

  it('refuses a self-loop', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    const [a] = (blocks[0] as DiagramBlock).nodes;
    blocks = addEdge(blocks, id, a.id, a.id);
    expect((blocks[0] as DiagramBlock).edges).toHaveLength(0);
  });

  it('does not duplicate an edge in either direction', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    blocks = addDiagramNode(blocks, id, 'B', 'process');
    const [a, b] = (blocks[0] as DiagramBlock).nodes;
    blocks = addEdge(blocks, id, a.id, b.id);
    blocks = addEdge(blocks, id, b.id, a.id);
    expect((blocks[0] as DiagramBlock).edges).toHaveLength(1);
  });

  it('removing a node also removes the edges touching it', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    blocks = addDiagramNode(blocks, id, 'B', 'process');
    const [a, b] = (blocks[0] as DiagramBlock).nodes;
    blocks = addEdge(blocks, id, a.id, b.id);
    blocks = removeDiagramNode(blocks, id, a.id);
    const diagram = blocks[0] as DiagramBlock;
    expect(diagram.nodes.map((n) => n.id)).toEqual([b.id]);
    expect(diagram.edges).toHaveLength(0);
  });

  it('removes a single edge without touching its nodes', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    blocks = addDiagramNode(blocks, id, 'B', 'process');
    const [a, b] = (blocks[0] as DiagramBlock).nodes;
    blocks = addEdge(blocks, id, a.id, b.id);
    const edgeId = (blocks[0] as DiagramBlock).edges[0].id;
    blocks = removeDiagramEdge(blocks, id, edgeId);
    const diagram = blocks[0] as DiagramBlock;
    expect(diagram.edges).toHaveLength(0);
    expect(diagram.nodes).toHaveLength(2);
  });
});

describe('org chart blocks', () => {
  const roles = ['Kvalitet', 'Produktion', 'Försäljning', 'Inköp', 'Ekonomi'];

  it('seeds top management plus one box per role, not an empty canvas', () => {
    const blocks = addOrgChartBlock([], 'Organisationsschema', 'VD', roles);
    const diagram = blocks[0] as DiagramBlock;
    expect(diagram.title).toBe('Organisationsschema');
    expect(diagram.nodes.map((node) => node.label)).toEqual(['VD', ...roles]);
  });

  it('connects every role directly to top management, not to each other', () => {
    const blocks = addOrgChartBlock([], 'Organisationsschema', 'VD', roles);
    const diagram = blocks[0] as DiagramBlock;
    const [top, ...rest] = diagram.nodes;
    expect(diagram.edges).toHaveLength(rest.length);
    for (const edge of diagram.edges) {
      expect(edge.from).toBe(top.id);
      expect(rest.map((node) => node.id)).toContain(edge.to);
    }
  });

  it('draws the reporting lines as elbow connectors, the usual org-chart style', () => {
    const blocks = addOrgChartBlock([], 'Organisationsschema', 'VD', roles);
    const diagram = blocks[0] as DiagramBlock;
    expect(diagram.edges.every((edge) => edge.lineShape === 'angled')).toBe(true);
  });

  it('places every role below top management, none overlapping another', () => {
    const blocks = addOrgChartBlock([], 'Organisationsschema', 'VD', roles);
    const diagram = blocks[0] as DiagramBlock;
    const [top, ...rest] = diagram.nodes;
    for (const node of rest) {
      expect(node.y).toBeGreaterThan(top.y);
    }
    const xs = rest.map((node) => node.x).sort((a, b) => a - b);
    for (let i = 1; i < xs.length; i += 1) {
      expect(xs[i]).toBeGreaterThanOrEqual(xs[i - 1] + 150);
    }
  });

  it('still produces an ordinary, fully editable diagram block', () => {
    const blocks = addOrgChartBlock([], 'Organisationsschema', 'VD', roles);
    const diagram = blocks[0] as DiagramBlock;
    expect(diagram.type).toBe('diagram');
    const relabeled = updateDiagramNodeLabel(blocks, diagram.id, diagram.nodes[0].id, 'Ny VD');
    expect((relabeled[0] as DiagramBlock).nodes[0].label).toBe('Ny VD');
  });
});

describe('block ordering and removal', () => {
  function labels(blocks: PageBlock[]): string[] {
    return blocks.map((b) => (b.type === 'text' ? b.heading : b.title));
  }

  it('removes the targeted block only', () => {
    const blocks = addTextBlock(addTextBlock([], 'A'), 'B');
    const removed = removeBlock(blocks, blocks[0].id);
    expect(labels(removed)).toEqual(['B']);
  });

  it('swaps a block with its neighbor when moved up or down', () => {
    const blocks = addTextBlock(addTextBlock(addTextBlock([], 'A'), 'B'), 'C');
    expect(labels(moveBlock(blocks, blocks[1].id, 'up'))).toEqual(['B', 'A', 'C']);
    expect(labels(moveBlock(blocks, blocks[1].id, 'down'))).toEqual(['A', 'C', 'B']);
  });

  it('does nothing at either end of the list', () => {
    const blocks = addTextBlock(addTextBlock([], 'A'), 'B');
    expect(moveBlock(blocks, blocks[0].id, 'up')).toEqual(blocks);
    expect(moveBlock(blocks, blocks[1].id, 'down')).toEqual(blocks);
  });
});

describe('snapToGrid', () => {
  it('rounds to the nearest grid line', () => {
    expect(snapToGrid(7)).toBe(0);
    expect(snapToGrid(11)).toBe(20);
    expect(snapToGrid(29)).toBe(20);
    expect(snapToGrid(31)).toBe(40);
  });
});

describe('snapNodePosition', () => {
  const box = (x: number, y: number, width = 100, height = 60): SnapBox => ({
    x,
    y,
    width,
    height,
  });

  it('falls back to the grid when nothing else is near', () => {
    const result = snapNodePosition(box(103, 207), []);
    expect(result).toEqual({ x: 100, y: 200, guides: [] });
  });

  it("snaps a left edge to another box's left edge and reports a guide", () => {
    const other = box(300, 500);
    const moving = box(304, 40);
    const result = snapNodePosition(moving, [other]);
    expect(result.x).toBe(300);
    expect(result.guides).toContainEqual({ orientation: 'vertical', position: 300 });
  });

  it("snaps a center to another box's center", () => {
    const other = box(0, 0, 200, 60); // center x = 100
    const moving = box(54, 400, 100, 60); // center x = 104, within threshold of 100
    const result = snapNodePosition(moving, [other]);
    expect(result.x).toBe(50); // shifts so its own center lands on 100
    expect(result.guides).toContainEqual({ orientation: 'vertical', position: 100 });
  });

  it('does not snap when nothing is within the threshold', () => {
    const other = box(0, 0);
    const moving = box(400, 400);
    const result = snapNodePosition(moving, [other]);
    expect(result.guides.length).toBe(0);
  });

  it('splits the gap evenly between a left and right neighbor', () => {
    const left = box(0, 100, 100, 60); // right edge at 100
    const right = box(300, 100, 100, 60); // left edge at 300
    // Ideal x centers a 100-wide box in the 200px gap: x = 150.
    const moving = box(154, 104, 100, 60);
    const result = snapNodePosition(moving, [left, right]);
    expect(result.x).toBe(150);
    expect(result.guides).toContainEqual({ orientation: 'vertical', position: 100 });
    expect(result.guides).toContainEqual({ orientation: 'vertical', position: 300 });
  });

  it('splits the gap evenly between a box above and below', () => {
    const above = box(100, 0, 60, 100); // bottom edge at 100
    const below = box(100, 300, 60, 100); // top edge at 300
    const moving = box(104, 154, 60, 100);
    const result = snapNodePosition(moving, [above, below]);
    expect(result.y).toBe(150);
    expect(result.guides).toContainEqual({ orientation: 'horizontal', position: 100 });
    expect(result.guides).toContainEqual({ orientation: 'horizontal', position: 300 });
  });

  it('ignores a left/right pair that does not share a row', () => {
    const left = box(0, 0, 100, 60);
    const right = box(300, 500, 100, 60); // far below — not the same row
    const moving = box(154, 400, 100, 60);
    const result = snapNodePosition(moving, [left, right]);
    // No equal-gap match; only the grid applies.
    expect(result.x).toBe(snapToGrid(154));
  });
});

describe('connectionPointCoords', () => {
  const box = { x: 100, y: 200, width: 60, height: 40 };

  it('places the four edge midpoints and corners around the box', () => {
    expect(connectionPointCoords(box, 'n')).toEqual({ x: 130, y: 200 });
    expect(connectionPointCoords(box, 'e')).toEqual({ x: 160, y: 220 });
    expect(connectionPointCoords(box, 's')).toEqual({ x: 130, y: 240 });
    expect(connectionPointCoords(box, 'w')).toEqual({ x: 100, y: 220 });
    expect(connectionPointCoords(box, 'nw')).toEqual({ x: 100, y: 200 });
    expect(connectionPointCoords(box, 'se')).toEqual({ x: 160, y: 240 });
  });
});

describe('edgePath', () => {
  it('draws a straight line as a plain segment', () => {
    expect(edgePath({ x: 0, y: 0 }, { x: 100, y: 0 }, 'straight')).toBe('M0,0 L100,0');
  });

  it('bows a curved line away from the straight path', () => {
    const path = edgePath({ x: 0, y: 0 }, { x: 100, y: 0 }, 'curved');
    expect(path).toMatch(/^M0,0 Q\d+(\.\d+)?,-?\d+(\.\d+)? 100,0$/);
    expect(path).not.toContain('Q50,0 ');
  });

  it('turns a single 90° corner for an angled line, exiting the source horizontally', () => {
    const path = edgePath({ x: 0, y: 0 }, { x: 100, y: 80 }, 'angled', 'e');
    expect(path).toBe('M0,0 L100,0 L100,80');
  });

  it('turns a single 90° corner for an angled line, exiting the source vertically', () => {
    const path = edgePath({ x: 0, y: 0 }, { x: 100, y: 80 }, 'angled', 'n');
    expect(path).toBe('M0,0 L0,80 L100,80');
  });
});
