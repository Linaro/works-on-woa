import { lazy } from "react";
import { createBrowserRouter, redirect } from "react-router-dom";
import { RootLayout } from "@/components/Layout/RootLayout";
import i18n from "@/lib/i18n";

const HomePage = lazy(() => import("@/pages/HomePage"));
const AppsPage = lazy(() => import("@/pages/AppsPage"));
const AppDetailPage = lazy(() => import("@/pages/AppDetailPage"));
const GamesPage = lazy(() => import("@/pages/GamesPage"));
const GameDetailPage = lazy(() => import("@/pages/GameDetailPage"));
const FAQPage = lazy(() => import("@/pages/FAQPage"));
const CustomReportPage = lazy(() => import("@/pages/CustomReportPage"));
const PublishersPage = lazy(() => import("@/pages/PublishersPage"));
const PublisherDetailPage = lazy(() => import("@/pages/PublisherDetailPage"));
const ContributingPage = lazy(() => import("@/pages/ContributingPage"));
const TakedownPage = lazy(() => import("@/pages/TakedownPage"));
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
      { path: "custom-report", element: <CustomReportPage /> },
      { path: "contributing", element: <ContributingPage /> },
      { path: "takedown", element: <TakedownPage /> },
      {
        path: ":lang/*",
        loader: ({ params }) => {
          const supported = ["en", "ja", "ko", "zh"];
          if (params.lang && supported.includes(params.lang)) {
            i18n.changeLanguage(params.lang);
            const rest = params["*"] || "";
            return redirect(rest ? `/${rest}` : "/");
          }
          i18n.changeLanguage("en");
          throw new Response("Not Found", { status: 404 });
        },
        errorElement: <NotFoundPage />,
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
