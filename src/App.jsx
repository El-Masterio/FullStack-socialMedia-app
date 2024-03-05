import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Home from './Container/Home';
import { GoogleOAuthProvider } from '@react-oauth/google';
function App() {
  return (
    <GoogleOAuthProvider
      clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
      // clientId="76974650340-usrji97kqjq4fk9jtk8t76ju41tjtkbq.apps.googleusercontent.com"
    >
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </GoogleOAuthProvider>

    // <h1 className="text-3xl font-bold underline text-center">Hello world!</h1>
  );
}

export default App;
