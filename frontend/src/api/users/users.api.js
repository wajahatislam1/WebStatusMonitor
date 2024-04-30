const BASE_URL = "http://localhost:4000";
const API_URL = "/api/v1";
const SIGNUP_URL = `${BASE_URL}${API_URL}/users/signup`;
const SIGNIN_URL = `${BASE_URL}${API_URL}/users/signin/local`;
const GOOGLE_AUTH_URL = `${BASE_URL}${API_URL}/users/signin/google/callback`;
const TOKEN_VALID_URL = `${BASE_URL}${API_URL}/users/tokenvalid`;

const userSignup = async (user) => {
  try {
    let response = await fetch(SIGNUP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return response;
  } catch (error) {
    console.error("An error occurred: ", error);
    throw new Error("An error occurred while signing up");
  }
};

const userSignIn = async (user) => {
  try {
    let response = await fetch(SIGNIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return response;
  } catch (error) {
    console.error("An error occurred: ", error);
    throw new Error("An error occurred while signing in");
  }
};

const googleAuth = async () => {
  window.open(`${GOOGLE_AUTH_URL}`, "_self");
};

const tokenValid = async (token) => {
  try {
    let response = await fetch(`${TOKEN_VALID_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error("An error occurred: ", error);
    return false;
  }
};

export { userSignup, userSignIn, googleAuth, tokenValid };
