import { useState } from 'react';
import type { ManagedDocument } from '@/data/documents';
import type { Lang } from '@/data/types';
import {
  addDiagramBlock,
  addDiagramEdge,
  addDiagramNode,
  addOrgChartBlock,
  addTextBlock,
  moveBlock,
  moveDiagramNode,
  removeBlock,
  removeDiagramEdge,
  removeDiagramNode,
  resizeDiagramNode,
  toggleDiagramNodeDocument,
  updateDiagramBackgroundColor,
  updateDiagramNodeFillColor,
  updateDiagramNodeLabel,
  updateDiagramNodeTextColor,
  updateDiagramTitle,
  updateTextBlock,
  type PageBlock,
} from '@/domain/page';
import type { Dictionary } from '@/i18n/dictionary';
import { DiagramEditor } from './DiagramEditor';
import { EmptyState } from './EmptyState';
import styles from './PageBlocksEditor.module.css';

export interface PageBlocksEditorProps {
  blocks: PageBlock[];
  onUpdateBlocks: (updater: (blocks: PageBlock[]) => PageBlock[]) => void;
  documents: ManagedDocument[];
  lang: Lang;
  t: Dictionary;
  /** Only Ledningssystem seeds an ISO-style org chart — every other page
   *  just gets text and process-diagram blocks. */
  showOrgChart?: boolean;
}

/**
 * Editable text and process-diagram blocks, shared by Ledningssystem and
 * every mandatory-process page — each page owns its own `PageBlock[]`, this
 * component just renders and edits whichever one it's handed.
 */
export function PageBlocksEditor({
  blocks,
  onUpdateBlocks,
  documents,
  lang,
  t,
  showOrgChart = false,
}: PageBlocksEditorProps) {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <div className="sectionHead">
        <h2>{t.pageContent}</h2>
        <button
          type="button"
          className="btn btn-secondary"
          aria-pressed={editing}
          onClick={() => setEditing((prev) => !prev)}
        >
          {editing ? t.doneEditing : t.edit}
        </button>
      </div>

      {editing ? (
        <div className={styles.addRow}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onUpdateBlocks((prev) => addTextBlock(prev, t.newTextHeading))}
          >
            {t.addTextBlock}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onUpdateBlocks((prev) => addDiagramBlock(prev, t.newDiagramTitle))}
          >
            {t.addDiagramBlock}
          </button>
          {showOrgChart ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                onUpdateBlocks((prev) =>
                  addOrgChartBlock(prev, t.newOrgChartTitle, t.orgChartTopLabel, [
                    t.qhseManager,
                    t.orgChartProductionLabel,
                    t.orgChartSalesLabel,
                    t.orgChartPurchasingLabel,
                    t.orgChartFinanceHrLabel,
                  ]),
                )
              }
            >
              {t.addOrgChart}
            </button>
          ) : null}
        </div>
      ) : null}

      {blocks.length === 0 ? (
        !editing ? (
          <EmptyState compact>{t.emptyManagementSystem}</EmptyState>
        ) : null
      ) : (
        <div className={styles.blockList}>
          {blocks.map((block, index) => (
            <article key={block.id} className={styles.block}>
              {editing ? (
                <div className={styles.blockToolbar}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-icon"
                    disabled={index === 0}
                    onClick={() => onUpdateBlocks((prev) => moveBlock(prev, block.id, 'up'))}
                  >
                    <span aria-hidden="true">▴</span>
                    <span className="visuallyHidden">{t.moveUp}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-icon"
                    disabled={index === blocks.length - 1}
                    onClick={() => onUpdateBlocks((prev) => moveBlock(prev, block.id, 'down'))}
                  >
                    <span aria-hidden="true">▾</span>
                    <span className="visuallyHidden">{t.moveDown}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-icon"
                    onClick={() => onUpdateBlocks((prev) => removeBlock(prev, block.id))}
                  >
                    <span aria-hidden="true">×</span>
                    <span className="visuallyHidden">{t.removeBlock}</span>
                  </button>
                </div>
              ) : null}

              {block.type === 'text' ? (
                editing ? (
                  <div className={styles.textEdit}>
                    <input
                      className="input"
                      value={block.heading}
                      placeholder={t.textBlockHeadingLabel}
                      aria-label={t.textBlockHeadingLabel}
                      onChange={(event) =>
                        onUpdateBlocks((prev) =>
                          updateTextBlock(prev, block.id, { heading: event.target.value }),
                        )
                      }
                    />
                    <textarea
                      className="input"
                      value={block.body}
                      placeholder={t.textBlockBodyLabel}
                      aria-label={t.textBlockBodyLabel}
                      onChange={(event) =>
                        onUpdateBlocks((prev) =>
                          updateTextBlock(prev, block.id, { body: event.target.value }),
                        )
                      }
                    />
                  </div>
                ) : (
                  <div className={styles.textView}>
                    <h3 className={styles.textHeading}>{block.heading}</h3>
                    <p className={styles.textBody}>{block.body}</p>
                  </div>
                )
              ) : (
                <DiagramEditor
                  block={block}
                  editing={editing}
                  t={t}
                  lang={lang}
                  documents={documents}
                  onTitleChange={(title) =>
                    onUpdateBlocks((prev) => updateDiagramTitle(prev, block.id, title))
                  }
                  onAddNode={(shape) =>
                    onUpdateBlocks((prev) => addDiagramNode(prev, block.id, t.newBoxLabel, shape))
                  }
                  onMoveNode={(nodeId, x, y) =>
                    onUpdateBlocks((prev) => moveDiagramNode(prev, block.id, nodeId, x, y))
                  }
                  onResizeNode={(nodeId, width, height) =>
                    onUpdateBlocks((prev) =>
                      resizeDiagramNode(prev, block.id, nodeId, width, height),
                    )
                  }
                  onLabelChange={(nodeId, label) =>
                    onUpdateBlocks((prev) => updateDiagramNodeLabel(prev, block.id, nodeId, label))
                  }
                  onRemoveNode={(nodeId) =>
                    onUpdateBlocks((prev) => removeDiagramNode(prev, block.id, nodeId))
                  }
                  onAddEdge={(from, to, fromPoint, toPoint, lineStyle, lineShape, color) =>
                    onUpdateBlocks((prev) =>
                      addDiagramEdge(
                        prev,
                        block.id,
                        from,
                        to,
                        fromPoint,
                        toPoint,
                        lineStyle,
                        lineShape,
                        color,
                      ),
                    )
                  }
                  onRemoveEdge={(edgeId) =>
                    onUpdateBlocks((prev) => removeDiagramEdge(prev, block.id, edgeId))
                  }
                  onFillColorChange={(nodeId, color) =>
                    onUpdateBlocks((prev) =>
                      updateDiagramNodeFillColor(prev, block.id, nodeId, color),
                    )
                  }
                  onTextColorChange={(nodeId, color) =>
                    onUpdateBlocks((prev) =>
                      updateDiagramNodeTextColor(prev, block.id, nodeId, color),
                    )
                  }
                  onBackgroundChange={(color) =>
                    onUpdateBlocks((prev) => updateDiagramBackgroundColor(prev, block.id, color))
                  }
                  onToggleDocumentLink={(nodeId, documentId) =>
                    onUpdateBlocks((prev) =>
                      toggleDiagramNodeDocument(prev, block.id, nodeId, documentId),
                    )
                  }
                />
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
