"use client";

import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "@/store/services/userApi";
import { StyledButton } from "@/components/StyledButton";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectSearchQuery,
  setSearchQuery,
  clearSearchQuery,
} from "@/store/slices/userFilterSlice";
import Link from "next/link";

export default function Home() {
  // Single hook replaces useEffect + useDispatch + useSelector
  const { data: users = [], isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Redux slice for search filter
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleRefresh = () => {
    refetch();
  };

  const handleDelete = async (userId: number) => {
    try {
      await deleteUser(userId).unwrap();
      // Cache automatically refetches via tag invalidation
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginTop: "2rem" }}>
        <h2>Users from Backend</h2>

        {/* quick link to create page */}
        <div style={{ marginBottom: "1rem" }}>
          <Link href="/create-user">
            <StyledButton>Create User</StyledButton>
          </Link>
        </div>

        {/* Search filter UI */}
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
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
                  <Link href={`/users/${user.id}`} style={{ marginRight: "0.5rem" }}>
                    {user.name}
                  </Link>
                  - {user.email}
                  <button
                    onClick={() => handleDelete(user.id)}
                    disabled={isDeleting}
                    style={{ marginLeft: "1rem", fontSize: "0.8rem" }}
                  >
                    Delete
                  </button>
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
