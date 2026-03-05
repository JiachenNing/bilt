"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetUserByIdQuery } from "@/store/services/userApi";
import { StyledButton } from "@/components/StyledButton";

// User navigates to /users/42 (e.g. via <Link href="/users/42" />).
// Next’s router resolves the folder app/users/[id] and renders the default export from page.tsx with params = { id: "42" }.
// In the component you use useParams() and the RTK Query hook to fetch and display the user.
export default function UserInfo() {
  const params = useParams();
  const router = useRouter();
  // params.id might be string or array (Next.js types)
  let idStr = params?.id;
  if (Array.isArray(idStr)) {
    idStr = idStr[0];
  }
  const id =  idStr ? parseInt(idStr, 10) : NaN;
  const { data: user, isLoading, error } = useGetUserByIdQuery(id, {
    skip: isNaN(id),
  });

  const handleBack = () => {
    router.push("/");
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
        <p style={{ color: "red" }}>
          {"status" in error
            ? `Error: ${error.status}`
            : "Failed to fetch user"}
        </p>
        <StyledButton onClick={handleBack}>Back</StyledButton>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
        <p>User not found.</p>
        <StyledButton onClick={handleBack}>Back</StyledButton>
      </div>
    );
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>User Details</h2>
      <p>
        <strong>ID:</strong> {user.id}
      </p>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      {user.created_at && (
        <p>
          <strong>Created:</strong> {user.created_at}
        </p>
      )}
      {user.updated_at && (
        <p>
          <strong>Updated:</strong> {user.updated_at}
        </p>
      )}
      <StyledButton onClick={handleBack} style={{ marginTop: "1rem" }}>
        Back
      </StyledButton>
    </main>
  );
}
