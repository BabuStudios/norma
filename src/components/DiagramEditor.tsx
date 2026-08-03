import { useState, type PointerEvent as ReactPointerEvent } from 'react';
import {
  boxEdgePoint,
  DIAGRAM_NODE_HEIGHT,
  DIAGRAM_NODE_WIDTH,
  type DiagramBlock,
  type DiagramNode,
} from '@/domain/page';
import type { Dictionary } from '@/i18n/dictionary';
import styles from './DiagramEditor.module.css';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 420;

type Mode = 'select' | 'connect' | 'delete';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Box-to-box arrow coordinates, trimmed to each node's edge rather than its
 *  center, so the line meets the border instead of crossing the label. */
function edgeLine(from: DiagramNode, to: DiagramNode): [number, number, number, number] {
  const fromCenter = { x: from.x + DIAGRAM_NODE_WIDTH / 2, y: from.y + DIAGRAM_NODE_HEIGHT / 2 };
  const toCenter = { x: to.x + DIAGRAM_NODE_WIDTH / 2, y: to.y + DIAGRAM_NODE_HEIGHT / 2 };
  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;
  const start = boxEdgePoint(
    fromCenter.x,
    fromCenter.y,
    dx,
    dy,
    DIAGRAM_NODE_WIDTH / 2,
    DIAGRAM_NODE_HEIGHT / 2,
  );
  const end = boxEdgePoint(
    toCenter.x,
    toCenter.y,
    -dx,
    -dy,
    DIAGRAM_NODE_WIDTH / 2,
    DIAGRAM_NODE_HEIGHT / 2,
  );
  return [start.x, start.y, end.x, end.y];
}

export function DiagramEditor({
  block,
  editing,
  t,
  onTitleChange,
  onAddNode,
  onMoveNode,
  onLabelChange,
  onRemoveNode,
  onAddEdge,
  onRemoveEdge,
}: {
  block: DiagramBlock;
  editing: boolean;
  t: Dictionary;
  onTitleChange: (title: string) => void;
  onAddNode: () => void;
  onMoveNode: (nodeId: string, x: number, y: number) => void;
  onLabelChange: (nodeId: string, label: string) => void;
  onRemoveNode: (nodeId: string) => void;
  onAddEdge: (from: string, to: string) => void;
  onRemoveEdge: (edgeId: string) => void;
}) {
  const [mode, setMode] = useState<Mode>('select');
  const [pendingSource, setPendingSource] = useState<string | null>(null);
  const [drag, setDrag] = useState<{
    nodeId: string;
    pointerId: number;
    dx: number;
    dy: number;
  } | null>(null);

  const markerId = `diagram-arrow-${block.id}`;

  const handleNodeClick = (nodeId: string) => {
    if (mode === 'delete') {
      onRemoveNode(nodeId);
      return;
    }
    if (mode === 'connect') {
      if (pendingSource === null) {
        setPendingSource(nodeId);
      } else if (pendingSource === nodeId) {
        setPendingSource(null);
      } else {
        onAddEdge(pendingSource, nodeId);
        setPendingSource(null);
      }
    }
  };

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>, node: DiagramNode) => {
    if (!editing || mode !== 'select') return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({
      nodeId: node.id,
      pointerId: event.pointerId,
      dx: event.clientX - node.x,
      dy: event.clientY - node.y,
    });
  };

  const onDragMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const x = clamp(event.clientX - drag.dx, 0, CANVAS_WIDTH - DIAGRAM_NODE_WIDTH);
    const y = clamp(event.clientY - drag.dy, 0, CANVAS_HEIGHT - DIAGRAM_NODE_HEIGHT);
    onMoveNode(drag.nodeId, x, y);
  };

  const endDrag = () => setDrag(null);

  const setToolMode = (next: Mode) => {
    setMode((prev) => (prev === next ? 'select' : next));
    setPendingSource(null);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.titleRow}>
        {editing ? (
          <input
            className={`input ${styles.titleInput}`}
            value={block.title}
            onChange={(event) => onTitleChange(event.target.value)}
            aria-label={t.diagramTitleLabel}
          />
        ) : (
          <h4 className={styles.titleStatic}>{block.title}</h4>
        )}
      </div>

      {editing ? (
        <div className={styles.toolbar}>
          <button type="button" className="btn btn-secondary" onClick={onAddNode}>
            {t.addBox}
          </button>
          <button
            type="button"
            className="chip"
            aria-pressed={mode === 'connect'}
            onClick={() => setToolMode('connect')}
          >
            {t.connectBoxes}
          </button>
          <button
            type="button"
            className="chip"
            aria-pressed={mode === 'delete'}
            onClick={() => setToolMode('delete')}
          >
            {t.deleteMode}
          </button>
        </div>
      ) : null}

      {!editing && block.nodes.length === 0 ? (
        <p className={styles.empty}>{t.emptyDiagram}</p>
      ) : (
        <div
          className={styles.canvas}
          onClick={() => {
            if (mode === 'connect') setPendingSource(null);
          }}
        >
          <svg
            className={styles.edges}
            viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
            aria-hidden="true"
          >
            <defs>
              <marker
                id={markerId}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L10,5 L0,10 z" fill="var(--color-text)" />
              </marker>
            </defs>
            {block.edges.map((edge) => {
              const from = block.nodes.find((node) => node.id === edge.from);
              const to = block.nodes.find((node) => node.id === edge.to);
              if (!from || !to) return null;
              const [x1, y1, x2, y2] = edgeLine(from, to);
              return (
                <g key={edge.id}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="var(--color-text)"
                    strokeWidth={1.5}
                    markerEnd={`url(#${markerId})`}
                  />
                  {editing && mode === 'delete' ? (
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="transparent"
                      strokeWidth={14}
                      className={styles.edgeHit}
                      onClick={(event) => {
                        event.stopPropagation();
                        onRemoveEdge(edge.id);
                      }}
                    />
                  ) : null}
                </g>
              );
            })}
          </svg>

          {block.nodes.map((node) => (
            <div key={node.id} className={styles.node} style={{ left: node.x, top: node.y }}>
              {editing && mode === 'select' ? (
                <>
                  <div
                    className={styles.nodeHandle}
                    onPointerDown={(event) => startDrag(event, node)}
                    onPointerMove={onDragMove}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                    aria-hidden="true"
                  />
                  <input
                    className={styles.nodeInput}
                    value={node.label}
                    onChange={(event) => onLabelChange(node.id, event.target.value)}
                    aria-label={t.boxLabel}
                  />
                </>
              ) : editing ? (
                <button
                  type="button"
                  className={`${styles.nodeButton} ${pendingSource === node.id ? styles.nodePending : ''}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleNodeClick(node.id);
                  }}
                >
                  {node.label || t.newBoxLabel}
                </button>
              ) : (
                <div className={styles.nodeLabel}>{node.label}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
