import './App.css';
import { Home } from './pages';

function App() {
  return (
    <div className="app">
      <div className="logo">
        <img src={window.location.origin + '/Ps_Logo.png'} alt="logo" />
      </div>
      <div className='content'>
        <Home />
      </div>
    </div>
  );
}

export default App;

