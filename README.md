README.md
Project Overview
This is a full-stack application built for a P2P package delivery platform. The project includes a robust backend with user authentication (signup, login, forgot/reset password) and a basic frontend to handle user interactions. It uses a modern tech stack to ensure the application is secure, scalable, and easy to maintain.

Key Features
User Authentication: Secure user registration and login using bcrypt for password hashing and JSON Web Tokens (JWT) for session management.

Forgot/Reset Password: Users can reset their passwords via email using a secure token, implemented with nodemailer.

Email Notifications: The application sends welcome emails on registration and login alerts to notify users of successful sign-ins.

Role-Based Access: Supports different user roles (e.g., user and admin) to manage access to different parts of the application.

Login/Register UI: A responsive frontend component (Login.jsx) for user signup and login.

Show/Hide Password: An added feature to toggle password visibility for better user experience.

Technologies Used
Backend
Node.js: JavaScript runtime environment.

Express.js: Web application framework for building RESTful APIs.

MongoDB: NoSQL database for data storage.

Mongoose: ODM (Object Data Modeling) library for MongoDB.

Bcrypt.js: Library for hashing passwords.

jsonwebtoken (JWT): For creating secure access tokens.

Nodemailer: For sending emails (login alerts, password reset links).

Dotenv: To manage environment variables.

Frontend
React: JavaScript library for building the user interface.

React Router DOM: For handling routing and navigation.

Axios: Promise-based HTTP client for making API requests.

Tailwind CSS: A utility-first CSS framework for styling.

React Hot Toast: For displaying notifications and alerts.

