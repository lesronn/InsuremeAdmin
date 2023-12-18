import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { AuthWrapper } from "./auth/AuthWrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer />
        <AuthWrapper />
      </BrowserRouter>
    </div>
  );
}

export default App;
