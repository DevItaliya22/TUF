import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Admin from './components/Admin';
import { BackgroundBeams } from './components/BackgroundBeams';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/f" element={<BackgroundBeams />} />
        <Route path='/' element={<Home/>}></Route>
        <Route path='/admin' element={<Admin/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;