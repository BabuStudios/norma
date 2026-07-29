import { Pill } from '@/components/Pill';
import { Tick } from '@/components/Tick';
import { FIELD_CHECKS, FIELD_TASKS, FIELD_WALK } from '@/data/fieldMode';
import { useApp } from '@/state/store';
import styles from './FieldModeScreen.module.css';

/**
 * Field mode is shown as two phone frames rather than a working mobile view:
 * it documents what staff see on site. The app's own small-screen layout is
 * handled by the responsive rules on each screen.
 */
export function FieldModeScreen() {
  const { state, t } = useApp();
  const lang = state.lang;
  const percent = Math.round((FIELD_WALK.done / FIELD_WALK.total) * 100);

  return (
    <div className={styles.screen}>
      <p className={styles.intro}>{t.fieldNote}</p>

      <div className={styles.phones}>
        <section className={styles.phone}>
          <div className={styles.statusBar} aria-hidden="true">
            <span>09:41</span>
            <span>NORMA</span>
          </div>
          <div className={styles.phoneBody}>
            <h2 className="microLabel">{t.auditWalk}</h2>
            <p className={styles.phoneTitle}>
              {t.production} — {FIELD_WALK.clause}
            </p>

            <div className={styles.progress}>
              <span className={styles.track} aria-hidden="true">
                <span className={styles.fill} style={{ width: `${percent}%` }} />
              </span>
              <span className={styles.progressCount}>
                {FIELD_WALK.done}/{FIELD_WALK.total}
              </span>
            </div>

            {FIELD_CHECKS.map((check) => (
              <div key={check.question.en} className={styles.checkRow}>
                <Tick checked={check.checked} size="sm" label={check.question[lang]} />
                <span className={styles.checkText}>{check.question[lang]}</span>
              </div>
            ))}

            <div className={styles.phoneActions}>
              <span className={`${styles.phoneAction} ${styles.phoneActionOutline}`}>
                {t.finding}
              </span>
              <span className={`${styles.phoneAction} ${styles.phoneActionFilled}`}>{t.next}</span>
            </div>
          </div>
        </section>

        <section className={styles.phone}>
          <div className={styles.statusBar} aria-hidden="true">
            <span>09:41</span>
            <span>NORMA</span>
          </div>
          <div className={styles.phoneBody}>
            <h2 className="microLabel">{t.myTasks}</h2>
            <p className={styles.phoneTitle}>
              {FIELD_TASKS.length} {t.tasksDue}
            </p>

            {FIELD_TASKS.map((task) => (
              <div key={task.title.en} className={styles.task}>
                <div className={styles.taskHead}>
                  <span className={styles.taskClause}>{task.clause}</span>
                  <span className={styles.taskDue}>
                    <Pill kind={task.kind}>{task.due[lang]}</Pill>
                  </span>
                </div>
                <div className={styles.taskTitle}>{task.title[lang]}</div>
              </div>
            ))}

            <p className={`hintBox ${styles.signNote}`}>{t.signNote}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
