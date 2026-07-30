import { EmptyState } from '@/components/EmptyState';
import { ASPECTS, ELEVATED_AT, SIGNIFICANT_AT } from '@/data/aspects';
import { useApp } from '@/state/store';
import styles from './AspectsScreen.module.css';

function band(score: number) {
  if (score >= SIGNIFICANT_AT) return 'significant';
  if (score >= ELEVATED_AT) return 'elevated';
  return 'plain';
}

export function AspectsScreen() {
  const { state, t } = useApp();
  const lang = state.lang;

  return (
    <div className={styles.screen}>
      <p className={styles.note}>
        <span className={styles.clauseChip}>ISO 14001 §6.1.2</span>
        <span className={styles.noteBody}>{t.aspectNote}</span>
      </p>

      {ASPECTS.length === 0 ? (
        <section>
          <div className="sectionHead">
            <h2>{t.aspectRegister}</h2>
          </div>
          <EmptyState
            action={
              <button type="button" className="btn btn-secondary">
                + {t.addAspect}
              </button>
            }
          >
            {t.emptyAspects}
          </EmptyState>
        </section>
      ) : (
        <div className="tableScroll">
          <table className="dataTable" aria-label={t.aspectRegister}>
            <colgroup>
              <col style={{ width: '18%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '134px' }} />
              <col style={{ width: '84px' }} />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">{t.activity}</th>
                <th scope="col">{t.aspect}</th>
                <th scope="col">{t.impact}</th>
                <th scope="col">{t.lifecycle}</th>
                <th scope="col">{t.sig}</th>
                <th scope="col">{t.control}</th>
              </tr>
            </thead>
            <tbody>
              {ASPECTS.map((aspect) => (
                <tr key={aspect.activity.en}>
                  <td className={styles.activity}>{aspect.activity[lang]}</td>
                  <td>{aspect.aspect[lang]}</td>
                  <td className={styles.impact}>{aspect.impact[lang]}</td>
                  <td className={styles.stage}>{aspect.stage[lang]}</td>
                  <td>
                    <span className={styles.score} data-band={band(aspect.significance)}>
                      {aspect.significance}
                    </span>
                  </td>
                  <td className={styles.control}>{aspect.control[lang]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
