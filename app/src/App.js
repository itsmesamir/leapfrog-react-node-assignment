import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import NewContact from "./contacts/pages/NewContact";
import UpdateContact from "./contacts/pages/UpdateContact";
import UserContacts from "./contacts/pages/UserContacts";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Auth from "./user/pages/Auth";
import Users from "./user/pages/Users";
import FavoritesContact from "./contacts/pages/Favourites";
import { AuthContext } from "./shared/context/auth-context";
import { FavoritesContextProvider } from "./shared/context/FavouritesContext";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(false);

  const login = useCallback((id) => {
    setIsLoggedIn(true);
    setUserId(id);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/contacts" exact>
          <UserContacts />
        </Route>
        <Route path="/contacts/new" exact>
          <NewContact />
        </Route>
        <Route path="/contacts/:contactId" exact>
          <UpdateContact />
        </Route>
        <Route path="/favourites" exact>
          <FavoritesContact />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/contacts" exact>
          <UserContacts />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        login: login,
        userId: userId,
        logout: logout,
      }}
    >
      <FavoritesContextProvider>
        <Router>
          <MainNavigation />
          <main>{routes}</main>
        </Router>
      </FavoritesContextProvider>
    </AuthContext.Provider>
  );
};

export default App;
