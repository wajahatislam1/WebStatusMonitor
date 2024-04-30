import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const HomePage = () => {
  const user = useSelector((state) => state.user);
  return (
    <>
      <h2>Welcome to Web Status Monitor</h2>
      {user.jwtToken ? (
        <h3>Welcome, You are signed in. </h3>
      ) : (
        <h2>
          Please sign in to continue. <Link to="/users/auth">Sign In</Link>
        </h2>
      )}
    </>
  );
};

export default HomePage;
