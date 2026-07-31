import { Pill } from '@/components/Pill';
import { PERSONAL_DATA, PROTECTION_CONTROLS, ROLES } from '@/data/governance';
import { useApp } from '@/state/store';
import styles from './SettingsScreen.module.css';

export function SettingsScreen() {
  const { state, t } = useApp();
  const lang = state.lang;

  const permissionColumns = [t.permRead, t.permWrite, t.permApprove, t.permAudit, t.permAdmin];

  return (
    <div className={styles.screen}>
      <div className={styles.columns}>
        <section>
          <div className="sectionHead">
            <h2>{t.personalData}</h2>
          </div>
          <table className={`dataTable ${styles.gdprTable}`}>
            <colgroup>
              <col />
              <col />
              <col style={{ width: '110px' }} />
            </colgroup>
            <thead className="visuallyHidden">
              <tr>
                <th scope="col">{t.dataType}</th>
                <th scope="col">{t.legalBasis}</th>
                <th scope="col">{t.retention}</th>
              </tr>
            </thead>
            <tbody>
              {PERSONAL_DATA.map((row) => (
                <tr key={row.data.en}>
                  <td className={styles.dataName}>{row.data[lang]}</td>
                  <td className={styles.basis}>{row.basis[lang]}</td>
                  <td className={styles.retention}>{row.retention[lang]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.gdprNote}>{t.gdprNote}</p>
        </section>

        <section>
          <div className="sectionHead">
            <h2>{t.controls}</h2>
          </div>
          {PROTECTION_CONTROLS.map((control) => (
            <div key={control.label.en} className={styles.controlRow}>
              <span className={styles.controlText}>
                <span className={styles.controlLabel}>{control.label[lang]}</span>
                <span className={styles.controlBody}>{control.body[lang]}</span>
              </span>
              <Pill kind={control.kind}>{control.state[lang]}</Pill>
            </div>
          ))}
        </section>
      </div>

      <section className={styles.roles}>
        <div className="sectionHead">
          <h2>{t.roles}</h2>
        </div>
        <div className="tableScroll">
          <table className="dataTable">
            <colgroup>
              <col style={{ width: '192px' }} />
              {permissionColumns.map((column) => (
                <col key={column} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th scope="col">{t.role}</th>
                {permissionColumns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLES.map((role) => (
                <tr key={role.role.en}>
                  <th scope="row" className={styles.roleName}>
                    {role.role[lang]}
                  </th>
                  {role.permissions.map((granted, index) => (
                    <td key={permissionColumns[index]} className={styles.permission}>
                      <span aria-hidden="true">{granted ? '✓' : '–'}</span>
                      <span className="visuallyHidden">
                        {granted ? t.permGranted : t.permDenied}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
