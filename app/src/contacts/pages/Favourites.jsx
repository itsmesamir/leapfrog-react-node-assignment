import React, { useContext } from "react";
import ContactList from "../components/ContactList";
import FavoritesContext from "../../shared/context/FavouritesContext";
import Card from "../../shared/components/UIElements/Card";
import "../components/ContactList.css";
import Button from "../../shared/components/FormElements/Button";

const FavoritesContact = () => {
  const favoritesCtx = useContext(FavoritesContext);
  let content;

  if (favoritesCtx.totalFavorites === 0) {
    content = (
      <div className="contact-list center">
        <Card>
          <h2>No Contacts found</h2>
          <Button to="/contacts">ADD Contact</Button>
        </Card>
      </div>
    );
  } else {
    content = <ContactList items={favoritesCtx.favorites} />;
  }

  console.log("content", content);
  return (
    <React.Fragment>
      <Card className="contact-list center">
        <h2>My Favorites</h2>
      </Card>
      {/* <Card className="contact-list center"> */}
      {content}
    </React.Fragment>
  );
};

export default FavoritesContact;
