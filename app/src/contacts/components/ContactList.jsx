import React from "react";
import Button from "../../shared/components/FormElements/Button";

import Card from "../../shared/components/UIElements/Card";
import ContactItem from "./ContactItem";
import "./ContactList.css";

const ContactList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="contact-list center">
        <Card>
          <h2>No Contacts found</h2>
          <Button to="/contacts/new">Share Contact</Button>
        </Card>
      </div>
    );
  }
  return (
    <ul className="contact-list">
      {props.items.map((contact) => {
        return (
          <ContactItem
            key={contact.id}
            id={contact.id}
            name={contact.name}
            title={contact.title}
            description={contact.description}
            address={contact.address}
            phone={contact.phone}
            createrId={contact.creator}
            image={contact.imageUrl}
            onDelete={props.onDeleteContact}
          />
        );
      })}
    </ul>
  );
};

export default ContactList;
