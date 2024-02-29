import './App.css';
import NavBar from './components/NavBar';
import Home from './Pages/Homepage/Home';

function App() {
  return (
    <>
    <div className="navcontainer">
      <NavBar/>
    </div>
    <div>
      <Home></Home>
    </div>
    </>
  );
}

export default App;
