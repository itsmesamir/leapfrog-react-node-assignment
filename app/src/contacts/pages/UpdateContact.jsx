import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './ContactForm.css';

const DUMMY_CONTACTS = [
  {
    id: "c1",
    title: "Itahari",
    description: "One of the most famous place in Nepal.",
    imageUrl: "https://www.peoplecontact.com.co/images/peoplecontact-1.png",
    address: "Itahari, Sunsari",
    location: {
      lat: 26.6646,
      lng: 87.2718,
    },
    creator: "u1",
  },
  {
    id: "c2",
    title: "Biratnagar",
    description: "One of the most famous place in Nepal.",
    imageUrl:
      "https://www.holidify.com/images/bgImages/BIRATNAGAR.jpg",
    address: "Biratnagar, Morang",
    location: {
      lat: 26.6646,
      lng: 87.2718,
    },
    creator: "u2",
  },
];

const UpdateContact = () => {
  const [isLoading, setIsLoading] = useState(true);
  const contactId = useParams().contactId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const indentifiedContact =DUMMY_CONTACTS.find(p => p.id === contactId);

  useEffect(() => {
    if (indentifiedContact) {
      setFormData(
        {
          title: {
            value: indentifiedContact.title,
            isValid: true
          },
          description: {
            value: indentifiedContact.description,
            isValid: true
          }
        },
        true
      );
    }
    setIsLoading(false);
  }, [setFormData, indentifiedContact]);

  const contactUpdateSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (!indentifiedContact) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find Contact!</h2>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={contactUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (min. 5 characters)."
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        EDIT CONTACT
      </Button>
    </form>
  );
};

export default UpdateContact;
