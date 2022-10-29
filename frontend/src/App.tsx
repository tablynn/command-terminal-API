import React from 'react';
import Terminal, {registerCommand, REPLFunction} from './Terminal';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <Terminal />      
    </div>
  );
}

export default App;