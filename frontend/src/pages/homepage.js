import { useHistory } from "react-router-dom";
import React, { useEffect } from "react";

function Home() {
  const history = useHistory();
  
  useEffect(() => {
    // check session
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      history.push("/");
    }
  }, [history]);


  const handleLogout = () => {
    // sessiion logout
    localStorage.removeItem("isLoggedIn");
    history.push("/");
  };

  return (
    <div className="home-container">
      <h1>Homepage!</h1>
      <h1>Butuh 2 button untuk managemen admin & management dokument, button account profile stting</h1>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

export default Home;
