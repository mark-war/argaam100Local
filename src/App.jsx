import "./App.css";
import AppRoutes from "./components/routes/AppRoutes";

function App() {
  // Example function to clear localStorage and sessionStorage
  const clearStorage = () => {
    console.log("CLEAR STORAGE");
    localStorage.clear();
    sessionStorage.clear();
  };

  // Call this function at the appropriate time
  clearStorage();
  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
