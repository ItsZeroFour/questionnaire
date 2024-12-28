import { Route, Routes } from "react-router-dom";
import Register from "./pages/register/Register";

function App() {
  return (
    <div className="page">
      <div className="container">
        <main>
          <Routes>
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
