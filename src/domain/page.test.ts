import { describe, expect, it } from 'vitest';
import {
  addDiagramBlock,
  addDiagramEdge,
  addDiagramNode,
  addTextBlock,
  boxEdgePoint,
  moveBlock,
  moveDiagramNode,
  removeBlock,
  removeDiagramEdge,
  removeDiagramNode,
  updateDiagramTitle,
  updateDiagramNodeLabel,
  updateTextBlock,
  type DiagramBlock,
  type PageBlock,
} from './page';

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

  it('relabels a node', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    const nodeId = (blocks[0] as DiagramBlock).nodes[0].id;
    blocks = updateDiagramNodeLabel(blocks, id, nodeId, 'Renamed');
    expect((blocks[0] as DiagramBlock).nodes[0].label).toBe('Renamed');
  });

  it('connects two nodes with an edge', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    blocks = addDiagramNode(blocks, id, 'B', 'process');
    const [a, b] = (blocks[0] as DiagramBlock).nodes;
    blocks = addDiagramEdge(blocks, id, a.id, b.id);
    expect((blocks[0] as DiagramBlock).edges).toEqual([
      expect.objectContaining({ from: a.id, to: b.id }),
    ]);
  });

  it('refuses a self-loop', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    const [a] = (blocks[0] as DiagramBlock).nodes;
    blocks = addDiagramEdge(blocks, id, a.id, a.id);
    expect((blocks[0] as DiagramBlock).edges).toHaveLength(0);
  });

  it('does not duplicate an edge in either direction', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    blocks = addDiagramNode(blocks, id, 'B', 'process');
    const [a, b] = (blocks[0] as DiagramBlock).nodes;
    blocks = addDiagramEdge(blocks, id, a.id, b.id);
    blocks = addDiagramEdge(blocks, id, b.id, a.id);
    expect((blocks[0] as DiagramBlock).edges).toHaveLength(1);
  });

  it('removing a node also removes the edges touching it', () => {
    let blocks = addDiagramBlock([], 'Process');
    const id = blocks[0].id;
    blocks = addDiagramNode(blocks, id, 'A', 'process');
    blocks = addDiagramNode(blocks, id, 'B', 'process');
    const [a, b] = (blocks[0] as DiagramBlock).nodes;
    blocks = addDiagramEdge(blocks, id, a.id, b.id);
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
    blocks = addDiagramEdge(blocks, id, a.id, b.id);
    const edgeId = (blocks[0] as DiagramBlock).edges[0].id;
    blocks = removeDiagramEdge(blocks, id, edgeId);
    const diagram = blocks[0] as DiagramBlock;
    expect(diagram.edges).toHaveLength(0);
    expect(diagram.nodes).toHaveLength(2);
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

describe('boxEdgePoint', () => {
  it('returns the center when there is no direction', () => {
    expect(boxEdgePoint(50, 50, 0, 0, 75, 28)).toEqual({ x: 50, y: 50 });
  });

  it('exits through the right edge when pointing mostly horizontal', () => {
    const point = boxEdgePoint(0, 0, 100, 10, 75, 28);
    expect(point.x).toBeCloseTo(75);
  });

  it('exits through the bottom edge when pointing mostly vertical', () => {
    const point = boxEdgePoint(0, 0, 10, 100, 75, 28);
    expect(point.y).toBeCloseTo(28);
  });
});
