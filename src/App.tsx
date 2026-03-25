import { BrowserRouter } from "react-router";

import "./App.css";
import Header from "./shared/components/Header/Header";
import AppRoutes from "./routes/routes";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        {/* Header is outside Routes so renders on every page */}
        <Header />
        <main className="max-w-7xl mx-auto p-6 md:p-8">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
