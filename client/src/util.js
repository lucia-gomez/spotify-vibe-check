const prod = "https://spotify-vibe-check.herokuapp.com";
const dev = "http://localhost:3000";
const client_url = (process.env.NODE_ENV ? prod : dev);

const port = process.env.PORT || 8888;
const server_url = (process.env.NODE_ENV === 'production' ? prod : "http://localhost:" + port);

export { client_url, server_url };