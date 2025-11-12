// getSpotifyToken.js
import fetch from "node-fetch";

const CLIENT_ID = "35ac290b2c2d41688fe2330ac4186b10";        // <-- replace this
const CLIENT_SECRET = "e76b8afc04b740d09a77a33686ff1fb3"; // <-- replace this

async function getSpotifyToken() {
  const authString = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authString}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Error fetching token:", data);
    return;
  }

  console.log("Access Token:", data.access_token);
  console.log("Expires In:", data.expires_in, "seconds");
}

getSpotifyToken();
