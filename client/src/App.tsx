import { BrowserRouter } from "react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./App.css";
import { store } from "./store";
import { Provider } from "react-redux";
import AppRoutes from "./routes/routes";
import { useInitAuth } from "./features/auth/hooks";
import Header from "./shared/components/Header/Header";
import RouteAnnouncer from "./shared/components/RouteAnnouncer/RouteAnnouncer";

function AppContent() {
  useInitAuth();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/*
        Skip link - first thing in the tab order, so a keyboard user can jump
        straight to the content instead of tabbing through the whole header on
        every single page (WCAG 2.4.1 Bypass Blocks).
        It stays invisible until focused, that's what sr-only-focusable does.
      */}
      <a
        href="#main-content"
        className="sr-only sr-only-focusable top-4 left-4 z-50 bg-yellow-500 text-zinc-950 text-sm font-semibold rounded-lg"
      >
        Skip to main content
      </a>
      {/* Header is outside Routes so renders on every page */}
      <Header />
      {/*
        tabIndex={-1} lets the skip link actually move focus here. Without it
        the browser only scrolls to the target and focus stays on the link, so
        the next Tab drops you back into the header again.
      */}
      <main
        id="main-content"
        tabIndex={-1}
        className="max-w-7xl mx-auto p-6 md:p-8"
      >
        <AppRoutes />
      </main>
      {/* Announces every route change to screen readers */}
      <RouteAnnouncer />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Provider>
  );
}

export default App;
