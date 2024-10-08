import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import JobApplications from './components/JobApplications';
import AddJobApplication from './components/AddJobApplication';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/applications" element={<JobApplications />} />
          <Route path="/add-application" element={<AddJobApplication />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
