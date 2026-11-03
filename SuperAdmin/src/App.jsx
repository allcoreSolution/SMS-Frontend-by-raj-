import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import { AuthProvider, useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from './i18n/LanguageContext';
// Core Pages
import Dashboard from './pages/Dashboard';
import MyProfile from './pages/MyProfile';
import Notifications from './pages/Notifications';
import Reports from './pages/reports/Reports';

// Platform - Schools
import Schools from './pages/schools/Schools';
import AddSchool from './pages/schools/AddSchool';
import SchoolDetail from './pages/schools/SchoolDetail';
import SchoolsReport from './pages/platform/SchoolsReport';
import AttendanceReport from './pages/platform/AttendanceReport';
import OnboardingTemplates from './pages/platform/OnboardingTemplates';
import NewOnboardingTemplate from './pages/platform/NewOnboardingTemplate';

// Platform - Billing
import Plans from './pages/plans/Plans';
import PlanAddons from './pages/plans/PlanAddons';
import Payments from './pages/payments/Payments';
import PaymentGateways from './pages/billing/PaymentGateways';
import WalletOversight from './pages/comms/WalletOversight';
import RateCards from './pages/comms/RateCards';
import MetaDltConfig from './pages/comms/MetaDltConfig';
import CommsRates from './pages/billing/CommsRates';
import SMSGateways from './pages/billing/SMSGateways';
import SMSReport from './pages/billing/SMSReport';

// Platform - Team & Support
import Team from './pages/team/Team';
import SupportTickets from './pages/SupportTickets';

// Platform - Reports & Settings
import LoginLogs from './pages/reports/LoginLogs';
import SchoolsUsage from './pages/reports/SchoolsUsage';
import FeeCollections from './pages/reports/FeeCollections';
import AttendanceTrends from './pages/reports/AttendanceTrends';
import EngagementAudit from './pages/reports/EngagementAudit';
import Communications from './pages/reports/Communications';

import SettingsCenter from './pages/settings/SettingsCenter';
import AppearanceSettings from './pages/settings/AppearanceSettings';
import AppBrandingSettings from './pages/settings/AppBrandingSettings';
import AcademicWordingSettings from './pages/settings/AcademicWordingSettings';
import DashboardThemesSettings from './pages/settings/DashboardThemesSettings';
import GeneralSettings from './pages/settings/GeneralSettings';
import RegistrationSettings from './pages/settings/RegistrationSettings';
import SubscriptionsSettings from './pages/settings/SubscriptionsSettings';
import AppDistributionSettings from './pages/settings/AppDistributionSettings';
import PaymentSettingsPage from './pages/settings/PaymentSettingsPage';
import PaymentGatewaysSettings from './pages/settings/PaymentGatewaysSettings';
import WhatsAppGatewaySettings from './pages/settings/WhatsAppGatewaySettings';
import SmsGatewaysSettings from './pages/settings/SmsGatewaysSettings';
import MailSmtpSettings from './pages/settings/MailSmtpSettings';
import PushNotificationsSettings from './pages/settings/PushNotificationsSettings';
import TelegramBotSettings from './pages/settings/TelegramBotSettings';
import NotificationTypesSettings from './pages/settings/NotificationTypesSettings';
import MetaDltConfigSettings from './pages/settings/MetaDltConfigSettings';
import CommsWalletSettings from './pages/settings/CommsWalletSettings';
import MenuBuilderSettings from './pages/settings/MenuBuilderSettings';
import AiManagementSettings from './pages/settings/AiManagementSettings';
import FaceVectorsSettings from './pages/settings/FaceVectorsSettings';
import ApiDocumentationSettings from './pages/settings/ApiDocumentationSettings';
import ServerHealthSettings from './pages/settings/ServerHealthSettings';
import SettingsPayments from './pages/settings/SettingsPayments';
import SettingsSms from './pages/settings/SettingsSms';
import SettingsNotifications from './pages/settings/SettingsNotifications';
import LoginPageDesignsSettings from './pages/settings/LoginPageDesignsSettings';
import DummySettings from './pages/settings/DummySettings';
import ApiDocs from './pages/ApiDocs';
import Templates from './pages/Templates';

// Website
import LandingPage from './pages/website/LandingPage';
import LandingTemplates from './pages/website/LandingTemplates';
import WebsitePages from './pages/website/WebsitePages';
import WebsiteMenu from './pages/website/WebsiteMenu';
import Sitemap from './pages/website/Sitemap';
import VisualBuilder from './pages/website/VisualBuilder';
import FullTemplates from './pages/website/FullTemplates';
import SchoolSiteTemplates from './pages/website/SchoolSiteTemplates';
import PreviewSite from './pages/website/PreviewSite';

// Content & AI
import BlogPosts from './pages/content/BlogPosts';
import BlogCategories from './pages/content/BlogCategories';
import KnowledgeBase from './pages/content/KnowledgeBase';
import CanvasDesigner from './pages/content/CanvasDesigner';
import AIAnalytics from './pages/content/AIAnalytics';
import FaceVectors from './pages/content/FaceVectors';
import ContentSafety from './pages/content/ContentSafety';
import AppDistribution from './pages/content/AppDistribution';

// Server
import ServerHealth from './pages/server/ServerHealth';
import SoftwareUpdates from './pages/server/SoftwareUpdates';
import BackupCenter from './pages/server/BackupCenter';
import StorageCenter from './pages/server/StorageCenter';
import CronMonitor from './pages/server/CronMonitor';
import Infrastructure from './pages/server/Infrastructure';
import ServerSettings from './pages/server/ServerSettings';

// Admin
import MasterMenus from './pages/admin/MasterMenus';
import AlertsNotifications from './pages/admin/AlertsNotifications';
import LoginReport from './pages/admin/LoginReport';
import EngagementReport from './pages/admin/EngagementReport';
import ThemeEngine from './pages/admin/ThemeEngine';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-96 text-center">
    <div className="text-6xl mb-4">🔍</div>
    <h2 className="text-2xl font-bold text-gray-700 mb-2">Page Not Found</h2>
    <p className="text-gray-400 text-sm">The page you're looking for doesn't exist.</p>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <Layout>
            <Routes>
              {/* Core */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<MyProfile />} />
              <Route path="/notifications" element={<Notifications />} />

              {/* Schools — add before :id to avoid conflict */}
              <Route path="/schools" element={<Schools />} />
              <Route path="/schools/add" element={<AddSchool />} />
              <Route path="/schools/:id" element={<SchoolDetail />} />
              <Route path="/schools-report" element={<SchoolsReport />} />
              <Route path="/attendance-report" element={<AttendanceReport />} />
              <Route path="/onboarding-templates" element={<OnboardingTemplates />} />
              <Route path="/onboarding-templates/new" element={<NewOnboardingTemplate />} />

              {/* Billing */}
              <Route path="/plans" element={<Plans />} />
              <Route path="/plan-addons" element={<PlanAddons />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/payment-gateways" element={<PaymentGateways />} />
              <Route path="/comms/wallets" element={<WalletOversight />} />
              <Route path="/comms/rate-cards" element={<RateCards />} />
              <Route path="/comms/meta-dlt" element={<MetaDltConfig />} />
              <Route path="/comms-rates" element={<CommsRates />} />
              <Route path="/sms-gateways" element={<SMSGateways />} />
              <Route path="/sms-report" element={<SMSReport />} />

              {/* Team & Support */}
              <Route path="/team" element={<Team />} />
              <Route path="/support" element={<SupportTickets />} />

              {/* Reports & Settings */}
              <Route path="/reports" element={<Reports />} />
              <Route path="/blog" element={<Navigate to="/blog/posts" replace />} />
              <Route path="/comms-wallet" element={<Navigate to="/comms/wallets" replace />} />
              <Route path="/settings-menu-builder" element={<MenuBuilderSettings />} />
              <Route path="/reports/login-logs" element={<LoginLogs />} />
              <Route path="/reports/schools-usage" element={<SchoolsUsage />} />
              <Route path="/reports/fee-collections" element={<FeeCollections />} />
              <Route path="/reports/attendance-trends" element={<AttendanceTrends />} />
              <Route path="/reports/engagement-audit" element={<EngagementAudit />} />
              <Route path="/reports/communications" element={<Communications />} />
              <Route path="/settings-center" element={<SettingsCenter />} />
              <Route path="/settings" element={<Navigate to="/settings-center" replace />} />
              <Route path="/settings-general" element={<GeneralSettings />} />
                            <Route path="/settings-menu" element={<MenuBuilderSettings />} />
              <Route path="/menu-builder" element={<MenuBuilderSettings />} />
              <Route path="/settings-payments" element={<PaymentGatewaysSettings />} />
              <Route path="/settings-sms" element={<SmsGatewaysSettings />} />
              <Route path="/settings-notifications" element={<NotificationTypesSettings />} />
              <Route path="/settings-login-designs" element={<LoginPageDesignsSettings />} />

              <Route path="/settings-appearance" element={<AppearanceSettings />} />
              <Route path="/theme" element={<AppearanceSettings />} />
              <Route path="/appearance" element={<AppearanceSettings />} />
              <Route path="/settings-branding" element={<AppBrandingSettings />} />
              <Route path="/settings-terminology" element={<AcademicWordingSettings />} />
              <Route path="/settings-dashboard-themes" element={<DashboardThemesSettings />} />

              <Route path="/settings-registration" element={<RegistrationSettings />} />
              <Route path="/settings-subscriptions" element={<SubscriptionsSettings />} />
              <Route path="/settings-app-distribution" element={<AppDistributionSettings />} />
              <Route path="/settings-payment-settings" element={<PaymentSettingsPage />} />

              <Route path="/settings-payment-gateways" element={<PaymentGatewaysSettings />} />
              <Route path="/gateways" element={<PaymentGatewaysSettings />} />
              <Route path="/payment-gateways" element={<PaymentGatewaysSettings />} />
              <Route path="/settings-whatsapp" element={<WhatsAppGatewaySettings />} />
              <Route path="/settings-sms-gateways" element={<SmsGatewaysSettings />} />
              <Route path="/sms-gateways" element={<SmsGatewaysSettings />} />
              <Route path="/settings-mail-smtp" element={<MailSmtpSettings />} />
              <Route path="/settings-push-notif" element={<PushNotificationsSettings />} />

              <Route path="/settings-telegram" element={<TelegramBotSettings />} />
              <Route path="/settings-notif-types" element={<NotificationTypesSettings />} />
              <Route path="/notification-types" element={<NotificationTypesSettings />} />
              <Route path="/settings-meta-dlt" element={<MetaDltConfigSettings />} />
              <Route path="/settings-comms-wallet" element={<CommsWalletSettings />} />
              <Route path="/settings-comms-wallet/overview" element={<Navigate to="/settings-comms-wallet" replace />} />
              <Route path="/settings-comms-wallet/rate-cards" element={<Navigate to="/comms/rate-cards" replace />} />
              <Route path="/settings-comms-wallet/meta-dlt" element={<Navigate to="/settings-meta-dlt" replace />} />


              <Route path="/settings-ai-mgmt" element={<AiManagementSettings />} />
              <Route path="/settings-face-vectors" element={<FaceVectorsSettings />} />
              <Route path="/face-vectors" element={<FaceVectorsSettings />} />
              <Route path="/settings-api-docs" element={<ApiDocumentationSettings />} />
              <Route path="/settings-server-health" element={<ServerHealthSettings />} />
              
              <Route path="/api-docs" element={<ApiDocs />} />
              <Route path="/templates" element={<Templates />} />

              {/* Website */}
              <Route path="/landing-page" element={<LandingPage />} />
              <Route path="/landing-templates" element={<LandingTemplates />} />
              <Route path="/website-pages" element={<WebsitePages />} />
              <Route path="/website-menu" element={<WebsiteMenu />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/landing-page/visual-builder" element={<VisualBuilder />} />
              <Route path="/landing-page/full-templates" element={<FullTemplates />} />
              <Route path="/landing-page/school-templates" element={<SchoolSiteTemplates />} />
              <Route path="/landing-page/preview" element={<PreviewSite />} />

              {/* Content & AI */}
              <Route path="/blog/posts" element={<BlogPosts />} />
              <Route path="/blog/categories" element={<BlogCategories />} />
              <Route path="/knowledge-base" element={<KnowledgeBase />} />
              <Route path="/knowledge-base/articles" element={<KnowledgeBase />} />
              <Route path="/knowledge-base/categories" element={<KnowledgeBase />} />
              <Route path="/canvas-designer" element={<CanvasDesigner />} />
              <Route path="/ai-analytics" element={<AIAnalytics />} />
              <Route path="/content-safety" element={<ContentSafety />} />
              <Route path="/app-distribution" element={<AppDistribution />} />

              {/* Server */}
              <Route path="/server" element={<ServerHealth />} />
              <Route path="/software-updates" element={<SoftwareUpdates />} />
              <Route path="/backup-center" element={<BackupCenter />} />
              <Route path="/storage-center" element={<StorageCenter />} />
              <Route path="/server-settings" element={<ServerSettings />} />
              <Route path="/cron-monitor" element={<CronMonitor />} />
              <Route path="/infrastructure" element={<Infrastructure />} />

              {/* Admin */}
              <Route path="/master-menus" element={<MasterMenus />} />
              <Route path="/alerts" element={<AlertsNotifications />} />
              <Route path="/login-report" element={<LoginReport />} />
              <Route path="/engagement-report" element={<EngagementReport />} />
              <Route path="/theme-engine" element={<ThemeEngine />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
