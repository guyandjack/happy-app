import axios from "axios";

import { storeSession } from "@utils/fonction/storeToken";

let refreshInFlight = null;

const refreshSession = (urlApi) => {
  if (!refreshInFlight) {
    refreshInFlight = axios
      .post(
        `${urlApi}/auth/refresh-token`,
        {},
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      )
      .then((response) => {
        if (response.data?.status !== "success" || !storeSession(response.data)) {
          throw new Error("The refreshed session is invalid.");
        }
        return response;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }

  return refreshInFlight;
};

/**
 * Retries one protected request after a single, shared refresh attempt. The
 * shared promise prevents concurrent dashboard requests from rotating the same
 * refresh token several times.
 */
const withSessionRefresh = async (urlApi, request) => {
  try {
    return await request();
  } catch (error) {
    if (error.response?.status !== 401) throw error;

    await refreshSession(urlApi);
    return request();
  }
};

export { refreshSession, withSessionRefresh };
