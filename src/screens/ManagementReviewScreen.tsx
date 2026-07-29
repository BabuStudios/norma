import { Tick } from '@/components/Tick';
import {
  NEXT_REVIEW_MEETING,
  REVIEW_INPUTS,
  REVIEW_OUTPUTS,
} from '@/data/managementReview';
import { useApp } from '@/state/store';
import styles from './ManagementReviewScreen.module.css';

export function ManagementReviewScreen() {
  const { state, t, toggleReviewCheck } = useApp();
  const lang = state.lang;

  return (
    <div className={styles.screen}>
      <div className={styles.columns}>
        <section>
          <div className="sectionHead">
            <h2>{t.agendaInputs}</h2>
            <span className="sectionHead__note">§9.3.2</span>
          </div>
          {REVIEW_INPUTS.map((input, index) => {
            const checked = Boolean(state.reviewChecks[index]);
            return (
              <label key={input.label.en} className={styles.inputRow}>
                <Tick checked={checked} onChange={() => toggleReviewCheck(index)} />
                <span className={styles.inputText}>
                  <span className={styles.inputLabel}>{input.label[lang]}</span>
                  <span className={styles.inputSource}>{input.source[lang]}</span>
                </span>
              </label>
            );
          })}
        </section>

        <aside>
          <div className={styles.card}>
            <h2 className="microLabel">{t.meeting}</h2>
            <div className={styles.meetingDate}>{NEXT_REVIEW_MEETING.date}</div>
            <div className={styles.participants}>
              {t.participants}: {NEXT_REVIEW_MEETING.participants}
            </div>

            <div className={styles.rule} />

            <h3 className="microLabel">{t.outputs}</h3>
            {REVIEW_OUTPUTS.map((output) => (
              <div key={output.en} className={styles.output}>
                {output[lang]}
              </div>
            ))}

            <button type="button" className={`btn btn-primary ${styles.generate}`}>
              {t.generateMinutes}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
