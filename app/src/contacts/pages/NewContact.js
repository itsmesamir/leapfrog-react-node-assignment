import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import "./ContactForm.css";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewContact = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [formState, inputHandler] = useForm(
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
      imageUrl: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const contactSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("phone", formState.inputs.phone.value);
      formData.append("creator", auth.userId);
      formData.append("imageUrl", formState.inputs.imageUrl.value);

      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/contacts", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }

      setIsLoading(false);
      auth.login();

      history.push("/");
    } catch (error) {
      setIsLoading(false);
      setError(error?.message || "Something went wrong, please try again.");
    }
  };

  const handleClearModal = () => setError(null);

  return (
    <>
      <ErrorModal error={error} onClear={handleClearModal} />
      <form className="contact-form" onSubmit={contactSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <Input
          id="phone"
          element="input"
          label="Phone"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid phone."
          onInput={inputHandler}
        />
        <ImageUpload
          id="imageUrl"
          onInput={inputHandler}
          errorText="Please select image."
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD CONTACT
        </Button>
      </form>
    </>
  );
};

export default NewContact;
