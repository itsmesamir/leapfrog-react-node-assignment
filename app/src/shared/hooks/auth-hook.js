import React, { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(false);
  const [expirationDate, setExpirationDate] = useState();

  const login = useCallback((id, token, expirationDate) => {
    setToken(token);
    setUserId(id);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: id,
        token,
        expirationDate: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));

    if (storedData?.token && new Date(storedData.expirationDate) > new Date()) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expirationDate)
      );
    }
  }, [login]);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setExpirationDate(null);

    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && expirationDate) {
      const remainingTime = expirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout]);

  return { token, login, logout, userId };
};
