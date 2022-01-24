import React, { createContext, useState } from 'react';

const FavoritesContext = createContext({
  favorites: [],
  totalFavorites: 0,
  addFavorite: (favoritecontact) => {},
  removeFavorite: (contactId) => {},
  itemIsFavorite: (contactId) => {}
});

export function FavoritesContextProvider(props) {
  const [userFavorites, setUserFavorites] = useState([]);

  function addFavoriteHandler(favoritecontact) {
    setUserFavorites((prevUserFavorites) => {
      return prevUserFavorites.concat(favoritecontact);
    });
  }

  function removeFavoriteHandler(contactId) {
    setUserFavorites(prevUserFavorites => {
      return prevUserFavorites.filter(contact => contact.id !== contactId);
    });
  }

  function itemIsFavoriteHandler(contactId) {
    return userFavorites.some(contact => contact.id === contactId);
  }
  
  const context = {
    favorites: userFavorites,
    totalFavorites: userFavorites.length,
    addFavorite: addFavoriteHandler,
    removeFavorite: removeFavoriteHandler,
    itemIsFavorite: itemIsFavoriteHandler
  };

  return (
    <FavoritesContext.Provider value={context}>
      {props.children}
    </FavoritesContext.Provider>
  );
}

export default FavoritesContext;