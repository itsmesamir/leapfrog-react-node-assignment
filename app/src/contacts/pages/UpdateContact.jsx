import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./ContactForm.css";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";

const UpdateContact = () => {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedContact, setLoadedContact] = useState();
  const [error, setError] = useState();
  const contactId = useParams().contactId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      phone: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const fetchContact = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/contacts/${contactId}`
      );
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      setLoadedContact(responseData.contact);
      setFormData(
        {
          title: {
            value: responseData.contact.title,
            isValid: true,
          },
          description: {
            value: responseData.contact.description,
            isValid: true,
          },
          address: {
            value: responseData.contact.address,
            isValid: true,
          },
          phone: {
            value: responseData.contact.phone,
            isValid: true,
          },
        },
        true
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  const contactUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/contacts/${contactId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formState.inputs.title.value,
            description: formState.inputs.description.value,
            address: formState.inputs.address.value,
            phone: formState.inputs.phone.value,
          }),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }

      setIsLoading(false);
      auth.login();

      history.push("/" + auth.userId + "/contacts");
    } catch (error) {
      setIsLoading(false);
      setError(error?.message || "Something went wrong, please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isLoading && !loadedContact && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find Contact!</h2>
        </Card>
      </div>
    );
  }

  const clearErrorHandler = () => setError(null);

  return (
    <>
      <ErrorModal error={error} onClear={clearErrorHandler} />
      {!isLoading && loadedContact && (
        <form className="contact-form" onSubmit={contactUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedContact.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedContact.description}
            initialValid={true}
          />
          <Input
            id="phone"
            element="textarea"
            label="Phone"
            validators={[VALIDATOR_MINLENGTH(10)]}
            errorText="Please enter a valid phone (min. 10 characters)."
            onInput={inputHandler}
            initialValue={loadedContact.phone}
            initialValid={true}
          />
          <Input
            id="address"
            element="textarea"
            label="Address"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid address (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedContact.address}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            EDIT CONTACT
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdateContact;
