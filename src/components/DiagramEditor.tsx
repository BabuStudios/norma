import { useCallback, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { ManagedDocument } from '@/data/documents';
import type { Lang } from '@/data/types';
import {
  ARROW_LINE_SHAPES,
  ARROW_LINE_STYLES,
  CONNECTION_POINTS,
  connectionPointCoords,
  DIAGRAM_DEFAULT_EDGE_COLOR,
  DIAGRAM_NODE_MIN_HEIGHT,
  DIAGRAM_NODE_MIN_WIDTH,
  DIAGRAM_SHAPES,
  edgePath,
  snapNodePosition,
  snapToGrid,
  type ArrowLineShape,
  type ArrowLineStyle,
  type ConnectionPoint,
  type DiagramBlock,
  type DiagramNode,
  type DiagramShape,
  type SnapGuide,
} from '@/domain/page';
import { useDismissable } from '@/hooks/useDismissable';
import type { Dictionary } from '@/i18n/dictionary';
import { DiagramShapeSvg } from './DiagramShape';
import styles from './DiagramEditor.module.css';

type NodeMenuView = 'root' | 'connect' | 'linkDocument';

const ARROW_STYLE_LABEL: Record<ArrowLineStyle, keyof Dictionary> = {
  solid: 'arrowStyleSolid',
  dashed: 'arrowStyleDashed',
  dotted: 'arrowStyleDotted',
  dashDot: 'arrowStyleDashDot',
};

const ARROW_SHAPE_LABEL: Record<ArrowLineShape, keyof Dictionary> = {
  straight: 'arrowShapeStraight',
  curved: 'arrowShapeCurved',
  angled: 'arrowShapeAngled',
};

const ARROW_DASH: Record<ArrowLineStyle, string | undefined> = {
  solid: undefined,
  dashed: '10 6',
  dotted: '1.5 5',
  dashDot: '10 5 1.5 5',
};

/** Fixed CSS position (percent of box width/height) for each connection point. */
const CONNECTION_POINT_OFFSET: Record<ConnectionPoint, { left: string; top: string }> = {
  n: { left: '50%', top: '0%' },
  ne: { left: '100%', top: '0%' },
  e: { left: '100%', top: '50%' },
  se: { left: '100%', top: '100%' },
  s: { left: '50%', top: '100%' },
  sw: { left: '0%', top: '100%' },
  w: { left: '0%', top: '50%' },
  nw: { left: '0%', top: '0%' },
};

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

export function DiagramEditor({
  block,
  editing,
  t,
  lang,
  onTitleChange,
  onAddNode,
  onMoveNode,
  onResizeNode,
  onLabelChange,
  onRemoveNode,
  onAddEdge,
  onRemoveEdge,
  onFillColorChange,
  onTextColorChange,
  onBackgroundChange,
  documents,
  onToggleDocumentLink,
}: {
  block: DiagramBlock;
  editing: boolean;
  t: Dictionary;
  lang: Lang;
  onTitleChange: (title: string) => void;
  onAddNode: (shape: DiagramShape) => void;
  onMoveNode: (nodeId: string, x: number, y: number) => void;
  onResizeNode: (nodeId: string, width: number, height: number) => void;
  onLabelChange: (nodeId: string, label: string) => void;
  onRemoveNode: (nodeId: string) => void;
  onAddEdge: (
    from: string,
    to: string,
    fromPoint: ConnectionPoint,
    toPoint: ConnectionPoint,
    lineStyle: ArrowLineStyle,
    lineShape: ArrowLineShape,
    color: string,
  ) => void;
  onRemoveEdge: (edgeId: string) => void;
  onFillColorChange: (nodeId: string, color: string) => void;
  onTextColorChange: (nodeId: string, color: string) => void;
  onBackgroundChange: (color: string) => void;
  documents: ManagedDocument[];
  onToggleDocumentLink: (nodeId: string, documentId: string) => void;
}) {
  const [mode, setMode] = useState<Mode>('select');
  const [pendingSource, setPendingSource] = useState<{
    nodeId: string;
    point: ConnectionPoint;
  } | null>(null);
  const [lineStyle, setLineStyle] = useState<ArrowLineStyle>('solid');
  const [lineShape, setLineShape] = useState<ArrowLineShape>('straight');
  const [arrowColor, setArrowColor] = useState<string>(DIAGRAM_DEFAULT_EDGE_COLOR);
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

  const handleConnectionPointClick = (nodeId: string, point: ConnectionPoint) => {
    if (!pendingSource) {
      setPendingSource({ nodeId, point });
      return;
    }
    if (pendingSource.nodeId === nodeId) {
      // Same box again: re-picking the same point cancels, a different one
      // just moves where the arrow will start from.
      setPendingSource(pendingSource.point === point ? null : { nodeId, point });
      return;
    }
    onAddEdge(
      pendingSource.nodeId,
      nodeId,
      pendingSource.point,
      point,
      lineStyle,
      lineShape,
      arrowColor,
    );
    setPendingSource(null);
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
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const closeNodeMenu = useCallback(() => {
    setOpenMenuNodeId(null);
    setMenuView('root');
  }, []);
  const menuRef = useDismissable<HTMLDivElement>(openMenuNodeId !== null, closeNodeMenu);

  const toggleNodeMenu = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    if (openMenuNodeId === nodeId) {
      closeNodeMenu();
    } else {
      setOpenMenuNodeId(nodeId);
      setMenuView('root');
    }
  };

  const selectedNode = block.nodes.find((node) => node.id === selectedNodeId) ?? null;
  const linkedDocuments = selectedNode
    ? documents.filter((document) => selectedNode.linkedDocumentIds.includes(document.id))
    : [];

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
            {t.arrowMode}
          </button>
          <button
            type="button"
            className="chip"
            aria-pressed={mode === 'delete'}
            onClick={() => setToolMode('delete')}
          >
            {t.deleteMode}
          </button>
          {mode === 'connect' ? (
            <div className={styles.arrowStylePanel}>
              <div
                className="segmented segmented--caps"
                role="group"
                aria-label={t.arrowLineStyleLabel}
              >
                {ARROW_LINE_STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    className="segmented__opt"
                    aria-pressed={lineStyle === style}
                    onClick={() => setLineStyle(style)}
                  >
                    {t[ARROW_STYLE_LABEL[style]]}
                  </button>
                ))}
              </div>
              <div
                className="segmented segmented--caps"
                role="group"
                aria-label={t.arrowLineShapeLabel}
              >
                {ARROW_LINE_SHAPES.map((shape) => (
                  <button
                    key={shape}
                    type="button"
                    className="segmented__opt"
                    aria-pressed={lineShape === shape}
                    onClick={() => setLineShape(shape)}
                  >
                    {t[ARROW_SHAPE_LABEL[shape]]}
                  </button>
                ))}
              </div>
              <label className={styles.colorField}>
                {t.arrowColorLabel}
                <input
                  type="color"
                  value={arrowColor}
                  onChange={(event) => setArrowColor(event.target.value)}
                />
              </label>
            </div>
          ) : null}
          <label className={styles.colorField}>
            {t.backgroundColorLabel}
            <input
              type="color"
              value={block.backgroundColor}
              onChange={(event) => onBackgroundChange(event.target.value)}
            />
          </label>
        </div>
      ) : null}

      {!editing && block.nodes.length === 0 ? (
        <p className={styles.empty}>{t.emptyDiagram}</p>
      ) : (
        <div
          className={styles.canvas}
          style={{ background: block.backgroundColor }}
          onClick={() => {
            if (mode === 'connect') setPendingSource(null);
          }}
        >
          <svg
            className={styles.edges}
            viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
            aria-hidden="true"
          >
            {block.edges.map((edge) => {
              const from = block.nodes.find((node) => node.id === edge.from);
              const to = block.nodes.find((node) => node.id === edge.to);
              if (!from || !to) return null;
              const start = connectionPointCoords(from, edge.fromPoint);
              const end = connectionPointCoords(to, edge.toPoint);
              const d = edgePath(start, end, edge.lineShape, edge.fromPoint);
              const edgeMarkerId = `${markerId}-${edge.id}`;
              return (
                <g key={edge.id}>
                  <defs>
                    <marker
                      id={edgeMarkerId}
                      viewBox="0 0 10 10"
                      refX="9"
                      refY="5"
                      markerWidth="7"
                      markerHeight="7"
                      orient="auto-start-reverse"
                    >
                      <path d="M0,0 L10,5 L0,10 z" fill={edge.color} />
                    </marker>
                  </defs>
                  <path
                    d={d}
                    fill="none"
                    stroke={edge.color}
                    strokeWidth={1.5}
                    strokeDasharray={ARROW_DASH[edge.lineStyle]}
                    strokeLinecap={edge.lineStyle === 'dotted' ? 'round' : undefined}
                    className={styles.edgeLine}
                    markerEnd={`url(#${edgeMarkerId})`}
                  />
                  {editing && mode === 'delete' ? (
                    <path
                      d={d}
                      fill="none"
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
                fillColor={node.fillColor}
                className={styles.nodeShape}
              />
              {editing && mode === 'select' ? (
                <>
                  <input
                    className={styles.nodeInput}
                    style={{ color: node.textColor }}
                    value={node.label}
                    onChange={(event) => onLabelChange(node.id, event.target.value)}
                    onPointerDown={(event) => event.stopPropagation()}
                    aria-label={t.boxLabel}
                  />
                  <div className={styles.nodeColorControls}>
                    <label className={styles.colorSwatch}>
                      <span className="visuallyHidden">{t.boxColorLabel}</span>
                      <input
                        type="color"
                        value={node.fillColor}
                        onPointerDown={(event) => event.stopPropagation()}
                        onChange={(event) => onFillColorChange(node.id, event.target.value)}
                      />
                    </label>
                    <label className={styles.colorSwatch}>
                      <span className="visuallyHidden">{t.textColorLabel}</span>
                      <input
                        type="color"
                        value={node.textColor}
                        onPointerDown={(event) => event.stopPropagation()}
                        onChange={(event) => onTextColorChange(node.id, event.target.value)}
                      />
                    </label>
                  </div>
                </>
              ) : editing && mode === 'connect' ? (
                <>
                  <span className={styles.nodeStatic} style={{ color: node.textColor }}>
                    {node.label || t.newBoxLabel}
                  </span>
                  {CONNECTION_POINTS.map((point) => (
                    <button
                      key={point}
                      type="button"
                      className={`${styles.connectionPoint} ${
                        pendingSource?.nodeId === node.id && pendingSource.point === point
                          ? styles.connectionPointActive
                          : ''
                      }`}
                      style={CONNECTION_POINT_OFFSET[point]}
                      aria-label={t.connectionPointLabel}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleConnectionPointClick(node.id, point);
                      }}
                    />
                  ))}
                </>
              ) : editing ? (
                <button
                  type="button"
                  className={styles.nodeButton}
                  style={{ color: node.textColor }}
                  onClick={(event) => {
                    event.stopPropagation();
                    onRemoveNode(node.id);
                  }}
                >
                  {node.label || t.newBoxLabel}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className={styles.nodeLabel}
                    style={{ color: node.textColor }}
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
                      ) : menuView === 'connect' ? (
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
                            onClick={() => setMenuView('linkDocument')}
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
                      ) : (
                        <>
                          <button
                            type="button"
                            className={styles.nodeMenuBack}
                            onClick={() => setMenuView('connect')}
                          >
                            <span aria-hidden="true">←</span> {t.nodeMenuBack}
                          </button>
                          {documents.length === 0 ? (
                            <p className={styles.nodeMenuEmpty}>{t.noDocumentsToLink}</p>
                          ) : (
                            documents.map((document) => (
                              <button
                                key={document.id}
                                type="button"
                                role="menuitemcheckbox"
                                aria-checked={node.linkedDocumentIds.includes(document.id)}
                                className={styles.nodeMenuItem}
                                onClick={() => onToggleDocumentLink(node.id, document.id)}
                              >
                                <span className={styles.nodeMenuCheck} aria-hidden="true">
                                  {node.linkedDocumentIds.includes(document.id) ? '✓' : ''}
                                </span>
                                {document.id} — {document.name[lang]}
                              </button>
                            ))
                          )}
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

      {!editing && selectedNode ? (
        <div className={styles.linkedDocuments}>
          <h5 className="microLabel">{t.linked}</h5>
          {linkedDocuments.length === 0 ? (
            <p className={styles.linkedDocumentsEmpty}>{t.noDocs}</p>
          ) : (
            <ul className={styles.linkedDocumentList}>
              {linkedDocuments.map((document) => (
                <li key={document.id} className={styles.linkedDocument}>
                  <span className={styles.linkedDocumentId}>{document.id}</span>
                  <span>{document.name[lang]}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
