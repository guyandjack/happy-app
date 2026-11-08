/**
 * Stores only non-sensitive session metadata for the UI. Authentication tokens
 * are deliberately kept in HttpOnly cookies and must never enter web storage.
 */
function storeSession(responseData) {
  try {
    const user = responseData?.data?.user;
    const accessExpiresAt = Number(responseData?.session?.accessExpiresAt);

    if (!user || !Number.isFinite(accessExpiresAt) || accessExpiresAt <= Date.now()) {
      return false;
    }

    // Remove data left by the previous bearer-token implementation.
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("user");

    sessionStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("accessExpiresAt", accessExpiresAt.toString());
    return true;
  } catch (error) {
    console.error("Error storing session metadata:", error);
    return false;
  }
}

export { storeSession };
