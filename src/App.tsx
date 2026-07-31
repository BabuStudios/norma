import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { AppProvider } from '@/state/AppProvider';
import { AspectsScreen } from '@/screens/AspectsScreen';
import { AuditsScreen } from '@/screens/AuditsScreen';
import { DocumentsScreen } from '@/screens/DocumentsScreen';
import { FieldModeScreen } from '@/screens/FieldModeScreen';
import { ManagementReviewScreen } from '@/screens/ManagementReviewScreen';
import { OverviewScreen } from '@/screens/OverviewScreen';
import { RequirementsScreen } from '@/screens/RequirementsScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { SuppliersScreen } from '@/screens/SuppliersScreen';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<OverviewScreen />} />
            <Route path="/requirements" element={<RequirementsScreen />} />
            <Route path="/requirements/:clauseId" element={<RequirementsScreen />} />
            <Route path="/documents" element={<DocumentsScreen />} />
            <Route path="/aspects" element={<AspectsScreen />} />
            <Route path="/audits" element={<AuditsScreen />} />
            <Route path="/suppliers" element={<SuppliersScreen />} />
            <Route path="/suppliers/:supplierId" element={<SuppliersScreen />} />
            <Route path="/management-review" element={<ManagementReviewScreen />} />
            <Route path="/field-mode" element={<FieldModeScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
