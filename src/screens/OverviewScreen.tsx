import { useState } from 'react';
import { DiagramEditor } from '@/components/DiagramEditor';
import { EmptyState } from '@/components/EmptyState';
import { CHANGE_LOG } from '@/data/changeLog';
import {
  addDiagramBlock,
  addDiagramEdge,
  addDiagramNode,
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
} from '@/domain/page';
import { useApp } from '@/state/store';
import styles from './OverviewScreen.module.css';

export function OverviewScreen() {
  const { state, t, updateManagementSystemBlocks } = useApp();
  const [editing, setEditing] = useState(false);
  const blocks = state.managementSystemBlocks;

  return (
    <div className={styles.screen}>
      <section className={styles.blocks}>
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
              onClick={() =>
                updateManagementSystemBlocks((prev) => addTextBlock(prev, t.newTextHeading))
              }
            >
              {t.addTextBlock}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                updateManagementSystemBlocks((prev) => addDiagramBlock(prev, t.newDiagramTitle))
              }
            >
              {t.addDiagramBlock}
            </button>
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
                      onClick={() =>
                        updateManagementSystemBlocks((prev) => moveBlock(prev, block.id, 'up'))
                      }
                    >
                      <span aria-hidden="true">▴</span>
                      <span className="visuallyHidden">{t.moveUp}</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-icon"
                      disabled={index === blocks.length - 1}
                      onClick={() =>
                        updateManagementSystemBlocks((prev) => moveBlock(prev, block.id, 'down'))
                      }
                    >
                      <span aria-hidden="true">▾</span>
                      <span className="visuallyHidden">{t.moveDown}</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-icon"
                      onClick={() =>
                        updateManagementSystemBlocks((prev) => removeBlock(prev, block.id))
                      }
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
                          updateManagementSystemBlocks((prev) =>
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
                          updateManagementSystemBlocks((prev) =>
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
                    lang={state.lang}
                    documents={state.documents}
                    onTitleChange={(title) =>
                      updateManagementSystemBlocks((prev) =>
                        updateDiagramTitle(prev, block.id, title),
                      )
                    }
                    onAddNode={(shape) =>
                      updateManagementSystemBlocks((prev) =>
                        addDiagramNode(prev, block.id, t.newBoxLabel, shape),
                      )
                    }
                    onMoveNode={(nodeId, x, y) =>
                      updateManagementSystemBlocks((prev) =>
                        moveDiagramNode(prev, block.id, nodeId, x, y),
                      )
                    }
                    onResizeNode={(nodeId, width, height) =>
                      updateManagementSystemBlocks((prev) =>
                        resizeDiagramNode(prev, block.id, nodeId, width, height),
                      )
                    }
                    onLabelChange={(nodeId, label) =>
                      updateManagementSystemBlocks((prev) =>
                        updateDiagramNodeLabel(prev, block.id, nodeId, label),
                      )
                    }
                    onRemoveNode={(nodeId) =>
                      updateManagementSystemBlocks((prev) =>
                        removeDiagramNode(prev, block.id, nodeId),
                      )
                    }
                    onAddEdge={(from, to, fromPoint, toPoint, lineStyle, lineShape, color) =>
                      updateManagementSystemBlocks((prev) =>
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
                      updateManagementSystemBlocks((prev) =>
                        removeDiagramEdge(prev, block.id, edgeId),
                      )
                    }
                    onFillColorChange={(nodeId, color) =>
                      updateManagementSystemBlocks((prev) =>
                        updateDiagramNodeFillColor(prev, block.id, nodeId, color),
                      )
                    }
                    onTextColorChange={(nodeId, color) =>
                      updateManagementSystemBlocks((prev) =>
                        updateDiagramNodeTextColor(prev, block.id, nodeId, color),
                      )
                    }
                    onBackgroundChange={(color) =>
                      updateManagementSystemBlocks((prev) =>
                        updateDiagramBackgroundColor(prev, block.id, color),
                      )
                    }
                    onToggleDocumentLink={(nodeId, documentId) =>
                      updateManagementSystemBlocks((prev) =>
                        toggleDiagramNodeDocument(prev, block.id, nodeId, documentId),
                      )
                    }
                  />
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className={styles.trail}>
        <div className="sectionHead">
          <h2>{t.trail}</h2>
        </div>
        {CHANGE_LOG.length === 0 ? (
          <EmptyState>{t.emptyChangeLog}</EmptyState>
        ) : (
          <div className="tableScroll">
            <table className={`dataTable ${styles.trailTable}`}>
              <colgroup>
                <col style={{ width: '156px' }} />
                <col style={{ width: '136px' }} />
                <col />
                <col style={{ width: '160px' }} />
              </colgroup>
              <thead className="visuallyHidden">
                <tr>
                  <th scope="col">{t.logWhen}</th>
                  <th scope="col">{t.logWho}</th>
                  <th scope="col">{t.logWhat}</th>
                  <th scope="col">{t.logRef}</th>
                </tr>
              </thead>
              <tbody>
                {CHANGE_LOG.map((entry) => (
                  <tr key={`${entry.when}-${entry.ref}`}>
                    <td className={`num ${styles.trailWhen}`}>{entry.when}</td>
                    <td className={styles.trailWho}>{entry.who}</td>
                    <td>{entry.what[state.lang]}</td>
                    <td className={styles.trailRef}>{entry.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
