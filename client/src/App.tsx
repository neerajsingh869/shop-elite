import { BrowserRouter } from "react-router";

import "./App.css";
import { store } from "./store";
import { Provider } from "react-redux";
import AppRoutes from "./routes/routes";
import { useInitAuth } from "./features/auth/hooks";
import Header from "./shared/components/Header/Header";

function AppContent() {
  useInitAuth();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header is outside Routes so renders on every page */}
      <Header />
      <main className="max-w-7xl mx-auto p-6 md:p-8">
        <AppRoutes />
      </main>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
