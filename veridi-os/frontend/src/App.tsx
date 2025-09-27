import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import ReportGenerator from "./components/ReportGenerator";
import MockDataToggle from "./components/MockDataToggle";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <ErrorBoundary>
          <Dashboard />
        </ErrorBoundary>
        <ErrorBoundary>
          <ReportGenerator />
        </ErrorBoundary>
        <MockDataToggle />
      </div>
    </ErrorBoundary>
  );
}

export default App;
