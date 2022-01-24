import React from "react";
import { useParams } from "react-router-dom";

import ContactList from "../components/ContactList";

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
  {
    id: "c3",
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

const UserContacts = () => {
  const userId = useParams().userId;
  const loadedContacts = DUMMY_CONTACTS.filter(contact => contact.creator === userId);
  return <ContactList items={loadedContacts} />;
};

export default UserContacts;
