// pages/forgot-password.js

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("If an account with that email exists, a reset link has been sent.");
    } catch (err) {
      console.error("Reset error:", err);
      // Firebase provides specific errors, you can customize based on err.code if desired
      setError("Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="mb-4 text-center">Reset Password</h2>
        <form onSubmit={handleReset}>
          <div className="mb-3">
            <label htmlFor="resetEmail" className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              id="resetEmail"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">Send Reset Link</button>
        </form>

        <div className="mt-3 text-center">
          <p>Remembered your password? <Link href="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}
