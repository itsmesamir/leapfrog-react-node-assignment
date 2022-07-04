import React, { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import UserLists from "../components/UserLists";

const Users = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState();

  useEffect(() => {
    try {
      setIsLoading(true);
      const fetchUsers = async () => {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + "/users"
        );
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error("Something went wrong");
        }

        setData(responseData);
      };

      fetchUsers();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleErrorModalClear = () => setError(null);

  return (
    <>
      <ErrorModal error={error} onClear={handleErrorModalClear} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && data && <UserLists items={data.users} />}
    </>
  );
};

export default Users;
