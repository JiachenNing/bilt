"use client";

// "use client" tells Next’s compiler that the file is a client‑side React component.
// In the new app/ directory Next.js defaults to server components

import {useState, useEffect, useMemo} from 'react';
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  User
} from "@/store/services/userApi";
import { StyledButton } from "@/components/StyledButton";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectSearchQuery,
  setSearchQuery,
  clearSearchQuery,
} from "@/store/slices/userFilterSlice";
import Link from "next/link";

// In Next.js app router: The Home component is the default export from page.tsx.
export default function Home() {
  // RTK Query = Redux Toolkit’s data fetching + caching
  // Single hook replaces useEffect + useDispatch + useSelector
  const { data: users = [], isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [createUser, { isLoading: isCreating}] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // dispatch is to send an action to the Redux store
  const dispatch = useAppDispatch();
  // searchQuery lives in Redux global state, not local component state.
  const searchQuery = useAppSelector(selectSearchQuery);
  const [searchInput, setSearchInput] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Debounce search input to update Redux
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearchQuery(searchInput));
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput, dispatch]);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [users, searchQuery]);

  const handleRefresh = () => {
    refetch();
  };

  const handleEdit = (user: User) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  const handleSaveEdit = async () => {
    if (!editingUserId) return;
    try {
      await updateUser({ id: editingUserId, name: editName.trim(), email: editEmail.trim() }).unwrap();
      setEditingUserId(null);
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };
  const handleDelete = async (userId: number) => {
    try {
      await deleteUser(userId).unwrap();
      // Cache automatically refetches via tag invalidation
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const validate = () => {
    if (!name.trim() || !email.trim()) {
      setErrorMessage("Name and email are required");
      return false;
    }
    const pattern = /^[^@\s]+@[^@\s]+$/;
    if (!pattern.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }
    setErrorMessage(null);
    return true;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await createUser({name: name.trim(), email: email.trim()});
      setSuccessMessage("success");
      setName("");
      setEmail("");
    } catch (err: any) {
      if (err && err.status === 400 && err.data && typeof err.data.error === "string") {
        setErrorMessage(err.data.error);
      } else {
        setErrorMessage("Failed to create user");
      }
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginTop: "2rem" }}>
        <h2>Users from Backend</h2>

        {/* quick link to create page */}
        {/* <div style={{ marginBottom: "1rem" }}>
          <Link href="/create-user">
            <StyledButton>Create User</StyledButton>
          </Link>
        </div> */}

        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column" }}>
          <label style={{ marginBottom: "1rem" }}>
            Name
            <input 
            type="text"
            placeholder="Create user name"
            value={name}
            onChange={e=>setName(e.target.value)}
            style={{
              padding: "0.5rem",
              fontSize: "1rem",
              width: "300px",
              marginRight: "0.5rem",
            }}
            />
          </label>
          <label style={{ marginBottom: "1rem" }}>
            Email
            <input 
            type="text"
            placeholder="Create user email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            style={{
              padding: "0.5rem",
              fontSize: "1rem",
              width: "300px",
              marginRight: "0.5rem",
            }}
            />
          </label>
          {errorMessage && (
            <p style={{ color: "red", marginBottom: "0.5rem" }}>{errorMessage}</p>
          )}
          {successMessage && (
            <p style={{ color: "green", marginBottom: "0.5rem" }}>{successMessage}</p>
          )}
          <div style={{ marginBottom: "1rem" }}>
            <StyledButton type="submit" disabled={isCreating || !name || !email}>
              Create User
            </StyledButton>
          </div>
        </form>

        {/* Search filter UI */}
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              padding: "0.5rem",
              fontSize: "1rem",
              width: "300px",
              marginRight: "0.5rem",
            }}
          />
          <StyledButton
            onClick={() => dispatch(clearSearchQuery())}
            disabled={!searchQuery}
          >
            Clear
          </StyledButton>
        </div>

        <StyledButton onClick={handleRefresh} disabled={isLoading}>
          {isLoading ? "Loading..." : "Refresh Users"}
        </StyledButton>

        {error && (
          <p style={{ color: "red" }}>
            {"status" in error
              ? `Error: ${error.status}`
              : "Failed to fetch users"}
          </p>
        )}

        {/* Display filtered user count */}
        {users.length > 0 && (
          <p style={{ marginTop: "1rem", color: "#666" }}>
            Showing {filteredUsers.length} of {users.length} users
          </p>
        )}

        {/* Show filtered users */}
          {filteredUsers.length > 0 ? (
            <ul style={{ marginTop: "1rem" }}>
              {filteredUsers.map((user) => (
                <li key={user.id} style={{ marginBottom: "0.5rem" }}>
                  {editingUserId === user.id ? (
                    <>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Name"
                        style={{ marginRight: "0.5rem", padding: "0.25rem" }}
                      />
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="Email"
                        style={{ marginRight: "0.5rem", padding: "0.25rem" }}
                      />
                      <StyledButton onClick={handleSaveEdit} disabled={isUpdating}>
                        {isUpdating ? "Saving..." : "Save"}
                      </StyledButton>
                      <StyledButton onClick={handleCancelEdit} style={{ marginLeft: "0.5rem" }}>
                        Cancel
                      </StyledButton>
                    </>
                  ) : (
                    <>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Link href={`/${user.id}`}>
                          {user.name}
                        </Link>
                        <span>{user.email}</span>
                        <StyledButton onClick={() => handleEdit(user)} style={{ marginLeft: "0.5rem" }}>
                          Edit
                        </StyledButton>
                        <StyledButton onClick={() => handleDelete(user.id)} style={{ marginLeft: "0.5rem" }}>
                          Delete
                        </StyledButton>
                       </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            users.length > 0 && (
              <p style={{ marginTop: "1rem", color: "#999" }}>
                No users found matching &quot;{searchQuery}&quot;
              </p>
            )
          )}
      </div>
    </main>
  );
}
