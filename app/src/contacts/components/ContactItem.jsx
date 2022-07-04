import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/FormElements/Button";
import "./ContactItem.css";
import FavoritesContext from "../../shared/context/FavouritesContext";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const ContactItem = (props) => {
  const favouriteCtx = useContext(FavoritesContext);
  const itemIsFavourite = favouriteCtx.itemIsFavorite(props.id);
  const auth = useContext(AuthContext);

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
        image: props.image,
      });
    }
  }
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/contacts/${props.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      props.onDelete(props.id);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClear = () => setError(null);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={handleModalClear} />
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
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="contact-item__image">
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="contact-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <h3>{props.phone}</h3>
            <p>{props.description}</p>
          </div>
          <div className="contact-item__actions">
            {auth.userId === props.createrId && (
              <Button to={`/contacts/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.createrId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
            {auth.userId === props.createrId && (
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
