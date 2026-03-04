import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/Layout/RootLayout";

const HomePage = lazy(() => import("@/pages/HomePage"));
const AppsPage = lazy(() => import("@/pages/AppsPage"));
const AppDetailPage = lazy(() => import("@/pages/AppDetailPage"));
const GamesPage = lazy(() => import("@/pages/GamesPage"));
const GameDetailPage = lazy(() => import("@/pages/GameDetailPage"));
const FAQPage = lazy(() => import("@/pages/FAQPage"));
const LearnPage = lazy(() => import("@/pages/LearnPage"));
const GettingStartedPage = lazy(() => import("@/pages/GettingStartedPage"));
const PrismPage = lazy(() => import("@/pages/PrismPage"));
const WindowsOnArmPage = lazy(() => import("@/pages/WindowsOnArmPage"));
const BulkReportPage = lazy(() => import("@/pages/BulkReportPage"));
const PublishersPage = lazy(() => import("@/pages/PublishersPage"));
const PublisherDetailPage = lazy(() => import("@/pages/PublisherDetailPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "apps", element: <AppsPage /> },
      { path: "apps/:slug", element: <AppDetailPage /> },
      { path: "games", element: <GamesPage /> },
      { path: "games/:slug", element: <GameDetailPage /> },
      { path: "publishers", element: <PublishersPage /> },
      { path: "publishers/:slug", element: <PublisherDetailPage /> },
      { path: "faq", element: <FAQPage /> },
      { path: "learn", element: <LearnPage /> },
      { path: "learn/getting-started", element: <GettingStartedPage /> },
      { path: "learn/prism", element: <PrismPage /> },
      { path: "learn/windows-on-arm", element: <WindowsOnArmPage /> },
      { path: "bulk-report", element: <BulkReportPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
