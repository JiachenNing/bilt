"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateUserMutation } from "@/store/services/userApi";
import { StyledButton } from "@/components/StyledButton";

export default function CreateUserPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [createUser, { isLoading }] = useCreateUserMutation();

  const validate = () => {
    if (!name.trim() || !email.trim()) {
      setErrorMessage("Name and email are required");
      return false;
    }
    const pattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!pattern.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createUser({ name: name.trim(), email: email.trim() }).unwrap();
      setSuccessMessage("User created successfully!");
      // clear fields
      setName("");
      setEmail("");
      // redirect back to home after a short delay
      setTimeout(() => router.push("/"), 1000);
    } catch (err: any) {
      // RTK Query error structure can be { status, data }
      if (err && err.status === 400 && err.data && typeof err.data.error === "string") {
        setErrorMessage(err.data.error);
      } else {
        setErrorMessage("Failed to create user");
      }
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Create New User</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ marginBottom: "0.5rem" }}>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: "0.5rem", fontSize: "1rem", width: "100%" }}
          />
        </label>
        <label style={{ marginBottom: "0.5rem" }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "0.5rem", fontSize: "1rem", width: "100%" }}
          />
        </label>
        {errorMessage && (
          <p style={{ color: "red", marginBottom: "0.5rem" }}>{errorMessage}</p>
        )}
        {successMessage && (
          <p style={{ color: "green", marginBottom: "0.5rem" }}>{successMessage}</p>
        )}
        <StyledButton type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create"}
        </StyledButton>
      </form>
    </main>
  );
}
