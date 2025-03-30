import { useState, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      auth?.login(data.token);
      navigate("/dashboard");
    },
  });

  return (
    <div>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => mutation.mutate()} disabled={mutation.isLoading}>
        {mutation.isLoading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
};

export default Login;
