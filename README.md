# Voosh-Backend-Node.js

## Summery 
This application is for registering a user, login, logout and getting the data from the database which is in encrypted form. I have also implemented a Google login option
This is s Backend project built on Node.js running on the port 5000. 
For storing the data MongDB is used.


POST requests
  1. /register - for registering the users.
  2. /login -  to log in to the user.
  3. /me - to update the data of the user.


GET request 
  1. /auth/google - to log in using Google.
  2. /logout - for logging out the user.
  3./me -  to get the users.
  4./profile - get the users that have kept their profile public.
  5./admin/users - to get the data on the user through admin.

## Steps to run

1. Clone this repo
2. run npm install
3. Use the .env.example file to store your environment variables (change the name to .env form .env.example)
