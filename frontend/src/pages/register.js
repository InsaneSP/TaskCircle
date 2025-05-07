import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { setUser } = useAuth(); // ✅ get setUser from context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // New state for username or name
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with user name
      await updateProfile(user, { displayName: name });

      // Send data to backend
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/auth`, {
        uid: user.uid,
        name: name, // Use the entered name here
        email: user.email,
      });

      const userData = response.data;

      // Set user in context globally
      setUser({
        id: user.uid,
        name: name,
        email: user.email,
        token: userData.token, // Optional if backend returns token
      });

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="mb-4 text-center">Register</h2>
        <form onSubmit={handleRegister}>
          {/* New Name Input Field */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)} // Handle name change
              required
            />
          </div>

          {/* Email Input Field */}
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

          {/* Password Input Field */}
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

          {/* Display errors */}
          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-success w-100">Sign Up</button>
        </form>
        <div className="mt-3 text-center">
          <p>Already have an account? <a href="/login"> Login</a> </p>
        </div>
      </div>
    </div>
  );
}
