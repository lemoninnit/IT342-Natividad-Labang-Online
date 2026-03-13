import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = sessionStorage.getItem("labangonline_session");
    if (!session) {
      window.location.href = "/login";
      return;
    }
    const sessionData = JSON.parse(session);
    setUser(sessionData);
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to LabangOnline Dashboard</h1>
      <p>Hello, {user.firstName} {user.lastName}!</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <button onClick={() => {
        sessionStorage.removeItem("labangonline_session");
        window.location.href = "/login";
      }}>Logout</button>
    </div>
  );
}