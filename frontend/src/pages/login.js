import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

// Initialize Google Provider
const googleProvider = new GoogleAuthProvider();

export default function Login() {
  const { setUser, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/auth`, {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "No Name",
      });

      const userData = response.data;

      // Set user in context
      login(user.uid);
      setUser({
        id: user.uid,
        name: userData.name,
        email: user.email,
        token: userData.token || "",
      });

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/auth`, {
        uid: user.uid,
        name: user.displayName || "Google User",
        email: user.email,
      });

      const userData = response.data;

      // Call the login function to update context
      login(userData.name, userData.uid);

      // Update the user state from response data
      setUser({
        id: userData.uid,
        name: userData.name,
        email: userData.email,
        token: userData.token || "",
      });

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Google Sign-In Failed");
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

        <div className="text-center mt-3">
          ------------- OR -------------
        </div>

        <div className="text-center mt-3">
          <button className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleGoogleLogin}>
            Continue with Google
          </button>
        </div>

        <div className="mt-3 text-center">
          <p>Don't have an account? <a href="/register">Sign up</a></p>
        </div>

        <div className="text-end mb-2">
          <Link href="/forgot" className="text-decoration-none" style={{ fontSize: "0.9rem" }}>
            Forgot Password?
          </Link>
        </div>

      </div>
    </div>
  );
}
