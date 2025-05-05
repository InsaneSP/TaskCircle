// src/pages/index.js

export default function Home() {
  return (
    <div className="container text-center mt-5">
      <h1 className="mb-3">Welcome to Task Manager</h1>
      <p>
        <a href="/login" className="btn btn-primary me-2">Login</a>
        <a href="/register" className="btn btn-secondary">Register</a>
      </p>
    </div>
  );
}
