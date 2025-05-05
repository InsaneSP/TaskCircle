import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from '../context/AuthContext'; // Import the UserProvider
import Navbar from "../components/Navbar";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
