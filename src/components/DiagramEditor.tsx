import { useCallback, useState, type PointerEvent as ReactPointerEvent } from 'react';
import {
  boxEdgePoint,
  DIAGRAM_NODE_MIN_HEIGHT,
  DIAGRAM_NODE_MIN_WIDTH,
  DIAGRAM_SHAPES,
  snapNodePosition,
  snapToGrid,
  type DiagramBlock,
  type DiagramNode,
  type DiagramShape,
  type SnapGuide,
} from '@/domain/page';
import { useDismissable } from '@/hooks/useDismissable';
import type { Dictionary } from '@/i18n/dictionary';
import { DiagramShapeSvg } from './DiagramShape';
import styles from './DiagramEditor.module.css';

type NodeMenuView = 'root' | 'connect';

const SHAPE_LABEL: Record<DiagramShape, keyof Dictionary> = {
  process: 'shapeProcess',
  decision: 'shapeDecision',
  terminator: 'shapeTerminator',
  data: 'shapeData',
  document: 'shapeDocument',
  predefined: 'shapePredefined',
  preparation: 'shapePreparation',
  connector: 'shapeConnector',
  manualOperation: 'shapeManualOperation',
  storedData: 'shapeStoredData',
  internalStorage: 'shapeInternalStorage',
  directData: 'shapeDirectData',
  manualInput: 'shapeManualInput',
  card: 'shapeCard',
  paperTape: 'shapePaperTape',
  display: 'shapeDisplay',
  loopLimit: 'shapeLoopLimit',
  offPageOut: 'shapeOffPageOut',
  offPageIn: 'shapeOffPageIn',
  offPageArrow: 'shapeOffPageArrow',
};

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 420;

type Mode = 'select' | 'connect' | 'delete';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Box-to-box arrow coordinates, trimmed to each node's edge rather than its
 *  center, so the line meets the border instead of crossing the label. */
function edgeLine(from: DiagramNode, to: DiagramNode): [number, number, number, number] {
  const fromCenter = { x: from.x + from.width / 2, y: from.y + from.height / 2 };
  const toCenter = { x: to.x + to.width / 2, y: to.y + to.height / 2 };
  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;
  const start = boxEdgePoint(fromCenter.x, fromCenter.y, dx, dy, from.width / 2, from.height / 2);
  const end = boxEdgePoint(toCenter.x, toCenter.y, -dx, -dy, to.width / 2, to.height / 2);
  return [start.x, start.y, end.x, end.y];
}

export function DiagramEditor({
  block,
  editing,
  t,
  onTitleChange,
  onAddNode,
  onMoveNode,
  onResizeNode,
  onLabelChange,
  onRemoveNode,
  onAddEdge,
  onRemoveEdge,
}: {
  block: DiagramBlock;
  editing: boolean;
  t: Dictionary;
  onTitleChange: (title: string) => void;
  onAddNode: (shape: DiagramShape) => void;
  onMoveNode: (nodeId: string, x: number, y: number) => void;
  onResizeNode: (nodeId: string, width: number, height: number) => void;
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
  const [guides, setGuides] = useState<SnapGuide[]>([]);
  const [resize, setResize] = useState<{
    nodeId: string;
    pointerId: number;
    nodeX: number;
    nodeY: number;
    startWidth: number;
    startHeight: number;
    startClientX: number;
    startClientY: number;
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
    const node = block.nodes.find((candidate) => candidate.id === drag.nodeId);
    if (!node) return;
    const rawX = clamp(event.clientX - drag.dx, 0, CANVAS_WIDTH - node.width);
    const rawY = clamp(event.clientY - drag.dy, 0, CANVAS_HEIGHT - node.height);
    const others = block.nodes
      .filter((candidate) => candidate.id !== drag.nodeId)
      .map((candidate) => ({
        x: candidate.x,
        y: candidate.y,
        width: candidate.width,
        height: candidate.height,
      }));
    const snapped = snapNodePosition(
      { x: rawX, y: rawY, width: node.width, height: node.height },
      others,
    );
    setGuides(snapped.guides);
    onMoveNode(drag.nodeId, snapped.x, snapped.y);
  };

  const endDrag = () => {
    setDrag(null);
    setGuides([]);
  };

  const startResize = (event: ReactPointerEvent<HTMLDivElement>, node: DiagramNode) => {
    if (!editing || mode !== 'select') return;
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setResize({
      nodeId: node.id,
      pointerId: event.pointerId,
      nodeX: node.x,
      nodeY: node.y,
      startWidth: node.width,
      startHeight: node.height,
      startClientX: event.clientX,
      startClientY: event.clientY,
    });
  };

  const onResizeMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!resize || event.pointerId !== resize.pointerId) return;
    const rawWidth = resize.startWidth + (event.clientX - resize.startClientX);
    const rawHeight = resize.startHeight + (event.clientY - resize.startClientY);
    const width = clamp(snapToGrid(rawWidth), DIAGRAM_NODE_MIN_WIDTH, CANVAS_WIDTH - resize.nodeX);
    const height = clamp(
      snapToGrid(rawHeight),
      DIAGRAM_NODE_MIN_HEIGHT,
      CANVAS_HEIGHT - resize.nodeY,
    );
    onResizeNode(resize.nodeId, width, height);
  };

  const endResize = () => setResize(null);

  const setToolMode = (next: Mode) => {
    setMode((prev) => (prev === next ? 'select' : next));
    setPendingSource(null);
  };

  const [openMenuNodeId, setOpenMenuNodeId] = useState<string | null>(null);
  const [menuView, setMenuView] = useState<NodeMenuView>('root');

  const closeNodeMenu = useCallback(() => {
    setOpenMenuNodeId(null);
    setMenuView('root');
  }, []);
  const menuRef = useDismissable<HTMLDivElement>(openMenuNodeId !== null, closeNodeMenu);

  const toggleNodeMenu = (nodeId: string) => {
    if (openMenuNodeId === nodeId) {
      closeNodeMenu();
    } else {
      setOpenMenuNodeId(nodeId);
      setMenuView('root');
    }
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
          <div className={styles.shapePalette} role="group" aria-label={t.addBox}>
            {DIAGRAM_SHAPES.map((shape) => (
              <button
                key={shape}
                type="button"
                className={styles.shapeButton}
                onClick={() => onAddNode(shape)}
              >
                <DiagramShapeSvg
                  shape={shape}
                  width={18}
                  height={14}
                  strokeWidth={1.25}
                  className={styles.shapeSwatch}
                />
                {t[SHAPE_LABEL[shape]]}
              </button>
            ))}
          </div>
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
            {guides.map((guide, index) =>
              guide.orientation === 'vertical' ? (
                <line
                  key={`guide-v-${index}`}
                  x1={guide.position}
                  y1={0}
                  x2={guide.position}
                  y2={CANVAS_HEIGHT}
                  className={styles.guide}
                />
              ) : (
                <line
                  key={`guide-h-${index}`}
                  x1={0}
                  y1={guide.position}
                  x2={CANVAS_WIDTH}
                  y2={guide.position}
                  className={styles.guide}
                />
              ),
            )}
          </svg>

          {block.nodes.map((node) => (
            <div
              key={node.id}
              className={styles.node}
              data-shape={node.shape}
              style={{
                left: node.x,
                top: node.y,
                width: node.width,
                height: node.height,
                cursor:
                  editing && mode === 'select'
                    ? drag?.nodeId === node.id
                      ? 'grabbing'
                      : 'grab'
                    : undefined,
              }}
              onPointerDown={(event) => startDrag(event, node)}
              onPointerMove={onDragMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              <DiagramShapeSvg
                shape={node.shape}
                width={node.width}
                height={node.height}
                className={styles.nodeShape}
              />
              {editing && mode === 'select' ? (
                <input
                  className={styles.nodeInput}
                  value={node.label}
                  onChange={(event) => onLabelChange(node.id, event.target.value)}
                  onPointerDown={(event) => event.stopPropagation()}
                  aria-label={t.boxLabel}
                />
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
                <>
                  <button
                    type="button"
                    className={styles.nodeLabel}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleNodeMenu(node.id);
                    }}
                    aria-haspopup="menu"
                    aria-expanded={openMenuNodeId === node.id}
                  >
                    {node.label}
                  </button>
                  {openMenuNodeId === node.id ? (
                    <div
                      ref={menuRef}
                      className={`dropdown ${styles.nodeMenu}`}
                      role="menu"
                      onPointerDown={(event) => event.stopPropagation()}
                    >
                      {menuView === 'root' ? (
                        <>
                          <button
                            type="button"
                            role="menuitem"
                            className={styles.nodeMenuItem}
                            onClick={() => setMenuView('connect')}
                          >
                            {t.nodeMenuConnect}
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className={styles.nodeMenuItem}
                            onClick={closeNodeMenu}
                          >
                            {t.nodeMenuInfo}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className={styles.nodeMenuBack}
                            onClick={() => setMenuView('root')}
                          >
                            <span aria-hidden="true">←</span> {t.nodeMenuBack}
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className={styles.nodeMenuItem}
                            onClick={closeNodeMenu}
                          >
                            {t.nodeMenuLinkDocument}
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className={styles.nodeMenuItem}
                            onClick={closeNodeMenu}
                          >
                            {t.nodeMenuLinkForward}
                          </button>
                        </>
                      )}
                    </div>
                  ) : null}
                </>
              )}
              {editing && mode === 'select' ? (
                <div
                  className={styles.resizeHandle}
                  onPointerDown={(event) => startResize(event, node)}
                  onPointerMove={onResizeMove}
                  onPointerUp={endResize}
                  onPointerCancel={endResize}
                  aria-hidden="true"
                />
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
