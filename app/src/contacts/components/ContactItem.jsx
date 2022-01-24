import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/FormElements/Button";
import "./ContactItem.css";
import FavoritesContext from "../../shared/context/FavouritesContext";
import { AuthContext } from "../../shared/context/auth-context";

const ContactItem = (props) => {
  const favouriteCtx = useContext(FavoritesContext);
  const itemIsFavourite = favouriteCtx.itemIsFavorite(props.id);

  function toggleFavoriteStatusHandler() {
    if (itemIsFavourite) {
      favouriteCtx.removeFavorite(props.id);
    } else {
      favouriteCtx.addFavorite({
        id: props.id,
        name: props.name,
        title: props.title,
        description: props.description,
        address: props.address,
        createrId: props.creator,
        image: props.imageUrl,
        coordinates: props.location,
      });
    }
  }
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = () => {
    setShowConfirmModal(false);
    console.log("DELETING...");
  };
  return (
    <React.Fragment>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="contact-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you want to proceed and delete this contact?</p>
      </Modal>
      <li className="contact-item">
        <Card className="contact-item__content">
          <div className="contact-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="contact-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="contact-item__actions">
            {auth.isLoggedIn && (
              <Button to={`/contacts/${props.id}`}>EDIT</Button>
            )}
            {auth.isLoggedIn && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
            {auth.isLoggedIn && (
              <Button onClick={toggleFavoriteStatusHandler}>
                {itemIsFavourite ? "Remove from Favorites" : "To Favorites"}
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default ContactItem;
