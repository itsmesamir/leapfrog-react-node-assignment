import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "./shared/context/auth-context";
import { FavoritesContextProvider } from "./shared/context/FavouritesContext";
import { useAuth } from "./shared/hooks/auth-hook";

const Users = React.lazy(() => import("./user/pages/Users"));
const Auth = React.lazy(() => import("./user/pages/Auth"));
const NewContact = React.lazy(() => import("./contacts/pages/NewContact"));
const UpdateContact = React.lazy(() =>
  import("./contacts/pages/UpdateContact")
);
const UserContacts = React.lazy(() => import("./contacts/pages/UserContacts"));
const FavoritesContact = React.lazy(() =>
  import("./contacts/pages/Favourites")
);

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
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
        isLoggedIn: !!token,
        token: token,
        login: login,
        userId: userId,
        logout: logout,
      }}
    >
      <FavoritesContextProvider>
        <Router>
          <MainNavigation />
          {/* <main>{routes}</main> */}
          <main>
            <Suspense
              fallback={
                <div classname="center">
                  <LoadingSpinner asOverlay />
                </div>
              }
            >
              {routes}
            </Suspense>
          </main>
        </Router>
      </FavoritesContextProvider>
    </AuthContext.Provider>
  );
};

export default App;
