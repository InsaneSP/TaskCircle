import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // ✅ updated import

export default function Login() {
  const { setUser, login } = useAuth(); // ✅ updated usage
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Send data to backend after login
      const response = await axios.post("http://localhost:5000/api/users/auth", {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "No Name",  // If Firebase returns the displayName, use it
      });
  
      const userData = response.data;
  
      // Call the login function from AuthContext to update the user state
      login(user.uid);  // Set user with UID or any other necessary details
  
      // Optionally, you can store the token or other info if needed
      setUser({
        id: user.uid,
        name: userData.name,
        email: user.email,
        token: userData.token,  // Optional, if your backend returns a token
      });
  
      router.push("/dashboard");  // Redirect to dashboard after successful login
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    }
  };  

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <div className="mt-3 text-center">
          <p>Don't have an account? <a href="/register"> Sign up</a></p>
        </div>
      </div>
    </div>
  );
}
