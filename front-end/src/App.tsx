import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import AppRoute from './routes';

function App() {
  return (
    <AuthProvider>
        <div className="App">
          <AppRoute />
        </div>
    </AuthProvider>
  );
}

export default App;
