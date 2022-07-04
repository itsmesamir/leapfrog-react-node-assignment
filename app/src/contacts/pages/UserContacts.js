import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import ContactList from "../components/ContactList";

const UserContacts = () => {
  const [loadedContacts, setLoadedContacts] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const userId = useParams().userId;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/contacts/user/${userId}`
        );
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error("Something went wrong");
        }

        setLoadedContacts(responseData.contacts);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleErrorModalClear = () => setError(null);

  const contactDeleteHandler = (contactId) => {
    setLoadedContacts((prevobj) =>
      prevobj.filter((contact) => contact.id !== contactId)
    );
  };

  return (
    <>
      <ErrorModal error={error} onClear={handleErrorModalClear} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedContacts && (
        <ContactList
          items={loadedContacts}
          onDeleteContact={contactDeleteHandler}
        />
      )}
    </>
  );
};

export default UserContacts;
