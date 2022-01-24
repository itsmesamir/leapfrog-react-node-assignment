import React from "react";

import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";
import './UserLists.css';

const UserLists = (props) => {
  if (props.items.length === 0) {
    return <div className="center">
      <Card>
      <h1>No users found</h1>
      </Card>
    </div>;
  }
  return (
    <ul className="users-list">
      {props.items.map((item) => {
        return (
          <UserItem
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
            placeCount={item.contacts}
          />
        );
      })}
    </ul>
  );
};

export default UserLists;