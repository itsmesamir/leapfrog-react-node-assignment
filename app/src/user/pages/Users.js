import React from "react";
import UserLists from "../components/UserLists";

const Users = () => {
    const USERS = [{
            id: "u1",
            name: "Samir Alam",
            placeCount: 3,
            image: "https://static0.cbrimages.com/wordpress/wp-content/uploads/2021/10/spider-man-no-way-home-header.jpg",
        },
        {
            id: "u1",
            name: "Samir Alam",
            placeCount: 3,
            image: "https://static0.cbrimages.com/wordpress/wp-content/uploads/2021/10/spider-man-no-way-home-header.jpg",
        },
        {
            id: "u2",
            name: "Samir Alam",
            placeCount: 3,
            image: "https://static0.cbrimages.com/wordpress/wp-content/uploads/2021/10/spider-man-no-way-home-header.jpg",
        },
    ];
    return <UserLists items = { USERS }
    />;
};

export default Users;