import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EmptyState } from '@/components/EmptyState';
import { Pill } from '@/components/Pill';
import { Tick } from '@/components/Tick';
import {
  OPTIONAL_COLUMNS,
  SUPPLIERS,
  SUPPLIER_FACTS,
  SUPPLIER_FIELDS,
  resolveSupplier,
  type SupplierFields,
} from '@/data/suppliers';
import { useDismissable } from '@/hooks/useDismissable';
import { useApp } from '@/state/store';
import styles from './SuppliersScreen.module.css';

/** The six columns the table always shows, after the supplier name. */
const BASE_WIDTHS = [150, 130, 130, 90, 130];
const COLUMN_GAP = 14;
/** The name column takes the slack but never shrinks below this. */
const NAME_MIN = 190;

type Draft = Record<keyof SupplierFields, string>;

function toDraft(fields: SupplierFields): Draft {
  return { ...fields, score: String(fields.score) };
}

export function SuppliersScreen() {
  const { state, t, toggleSupplierColumn, saveSupplier } = useApp();
  const navigate = useNavigate();
  const { supplierId } = useParams();
  const lang = state.lang;

  const [menuOpen, setMenuOpen] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const menuRef = useDismissable<HTMLDivElement>(menuOpen, closeMenu);

  // The register can be empty, so there may be nothing to show in the aside.
  const seed = SUPPLIERS.find((candidate) => candidate.id === supplierId) ?? SUPPLIERS.at(0);
  const current = seed ? resolveSupplier(seed, lang, state.supplierOverrides[seed.id]) : null;

  const activeColumns = OPTIONAL_COLUMNS.filter((column) => state.supplierColumns[column.key]);
  const minWidth =
    [...BASE_WIDTHS, ...activeColumns.map((column) => parseInt(column.width, 10))].reduce(
      (sum, width) => sum + width + COLUMN_GAP,
      0,
    ) + NAME_MIN;

  const needAttention = SUPPLIERS.filter((supplier) => supplier.kind !== 'met').length;

  const selectSupplier = (id: string) => {
    setDraft(null);
    setMenuOpen(false);
    navigate(`/suppliers/${id}`);
  };

  const commit = () => {
    if (!draft || !seed) return;
    saveSupplier(seed.id, { ...draft, score: Number.parseInt(draft.score, 10) || 0 });
    setDraft(null);
  };

  return (
    <div className={styles.panes} data-view={supplierId ? 'detail' : 'list'}>
      <div className={styles.list}>
        <div className={styles.toolbar} ref={menuRef}>
          <span className={styles.summary}>
            {SUPPLIERS.length} {t.suppliersLabel}
            {SUPPLIERS.length > 0 ? ` · ${needAttention} ${t.needAttention}` : ''}
          </span>
          <button
            type="button"
            className={`btn btn-secondary ${styles.addColumn}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="supplier-column-menu"
          >
            + {t.addColumn}
          </button>

          {menuOpen ? (
            <div className={`dropdown ${styles.columnMenu}`} id="supplier-column-menu">
              <div className={`microLabel ${styles.columnMenuHead}`}>{t.chooseColumns}</div>
              {OPTIONAL_COLUMNS.map((column) => {
                const on = Boolean(state.supplierColumns[column.key]);
                return (
                  <label key={column.key} className={styles.columnOption}>
                    <Tick
                      checked={on}
                      size="xs"
                      onChange={() => toggleSupplierColumn(column.key)}
                    />
                    <span>{column.label[lang]}</span>
                  </label>
                );
              })}
            </div>
          ) : null}
        </div>

        {SUPPLIERS.length === 0 ? (
          <EmptyState
            action={
              <button type="button" className="btn btn-secondary">
                + {t.addSupplier}
              </button>
            }
          >
            {t.emptySuppliers}
          </EmptyState>
        ) : (
          <div className="tableScroll">
            <table
              className="dataTable dataTable--rowLinks"
              style={{ minWidth }}
              aria-label={t.supplierRegister}
            >
              <colgroup>
                <col />
                {BASE_WIDTHS.map((width, index) => (
                  <col key={index} style={{ width: `${width + COLUMN_GAP}px` }} />
                ))}
                {activeColumns.map((column) => (
                  <col
                    key={column.key}
                    style={{ width: `${parseInt(column.width, 10) + COLUMN_GAP}px` }}
                  />
                ))}
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">{t.supplier}</th>
                  <th scope="col">{t.category}</th>
                  <th scope="col">{t.certs}</th>
                  <th scope="col">{t.lastEval}</th>
                  <th scope="col">{t.score}</th>
                  <th scope="col">{t.status}</th>
                  {activeColumns.map((column) => (
                    <th key={column.key} scope="col">
                      {column.label[lang]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SUPPLIERS.map((supplier) => {
                  const fields = resolveSupplier(
                    supplier,
                    lang,
                    state.supplierOverrides[supplier.id],
                  );
                  return (
                    <tr
                      key={supplier.id}
                      aria-selected={supplier.id === seed?.id}
                      onClick={() => selectSupplier(supplier.id)}
                    >
                      <th scope="row" className={styles.supplierName}>
                        {fields.name}
                      </th>
                      <td className={styles.category}>{fields.category}</td>
                      <td className={styles.certs}>{fields.certs}</td>
                      <td className="num">{fields.lastEvaluated}</td>
                      <td className={styles.scoreCell}>{fields.score}</td>
                      <td>
                        <Pill kind={supplier.kind}>{fields.state}</Pill>
                      </td>
                      {activeColumns.map((column) => (
                        <td key={column.key} className={styles.extra}>
                          {String(fields[column.key])}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <aside className={styles.detail}>
        <div className={styles.detailInner}>
          <button type="button" className={styles.backLink} onClick={() => navigate('/suppliers')}>
            <span aria-hidden="true">←</span> {t.backToSuppliers}
          </button>

          {!seed || !current ? (
            <>
              <div className="microLabel">{t.supplierDetail}</div>
              <EmptyState>{t.emptySupplierDetail}</EmptyState>
            </>
          ) : (
            <>
              <header className={styles.detailHeader}>
                <div className="microLabel">{t.supplierDetail}</div>
                <h2 className={styles.detailName}>{current.name}</h2>
                <div className={styles.detailMeta}>
                  <Pill kind={seed.kind}>{current.state}</Pill>
                  <span className={styles.detailMetaText}>
                    {current.category} · {current.certs}
                  </span>
                </div>
              </header>

              {draft ? (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    commit();
                  }}
                >
                  {SUPPLIER_FIELDS.map((field) => (
                    <div key={field.key} className={`field ${styles.field}`}>
                      <label htmlFor={`supplier-${field.key}`}>{field.label[lang]}</label>
                      <input
                        id={`supplier-${field.key}`}
                        className="input"
                        value={draft[field.key]}
                        onChange={(event) => setDraft({ ...draft, [field.key]: event.target.value })}
                      />
                    </div>
                  ))}
                  <div className={styles.formActions}>
                    <button type="submit" className="btn btn-primary">
                      {t.saveSupplier}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setDraft(null)}
                    >
                      {t.cancel}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <dl className={styles.facts}>
                    {SUPPLIER_FACTS.map((fact) => (
                      <div key={fact.key} className={styles.fact}>
                        <dt className={styles.factLabel}>{fact.label[lang]}</dt>
                        <dd className={styles.factValue}>{String(current[fact.key])}</dd>
                      </div>
                    ))}
                  </dl>
                  <button
                    type="button"
                    className={`btn btn-secondary ${styles.editButton}`}
                    onClick={() => setDraft(toDraft(current))}
                  >
                    {t.editSupplier}
                  </button>
                </div>
              )}

              <section className={styles.docs}>
                <div className="sectionHead">
                  <h3>{t.linkedDocs}</h3>
                  <span className="sectionHead__note">{seed.documents.length}</span>
                </div>

                {seed.documents.length === 0 ? (
                  <p className={styles.docsEmpty}>{t.noDocs}</p>
                ) : (
                  seed.documents.map((document) => (
                    <div key={document.id} className={styles.docRow}>
                      <span className={styles.docId}>{document.id}</span>
                      <span className={styles.docText}>
                        <span className={styles.docName}>{document.name[lang]}</span>
                        <span className={styles.docMeta}>{document.meta[lang]}</span>
                      </span>
                      <button type="button" className={styles.docOpen}>
                        {t.open}
                      </button>
                    </div>
                  ))
                )}

                <div className={styles.docActions}>
                  <button type="button" className="btn btn-primary">
                    + {t.attachDoc}
                  </button>
                  <button type="button" className="btn btn-secondary">
                    {t.newEval}
                  </button>
                </div>
              </section>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
