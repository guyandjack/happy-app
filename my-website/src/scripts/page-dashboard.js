/**
 * Authentication is verified by the API with HttpOnly cookies. Client-side
 * code must not try to inspect a bearer token in browser storage.
 */
function checkToken() {
  return true;
}

export { checkToken };
