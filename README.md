# Digital Menu - Frontend

### Description
**Digital Menu** is a web-based application that allows restaurant owners to manage their menu and restaurant details through a user-friendly interface. This project is part of a full-stack solution built using React for the frontend and Django for the backend.

### Features:
- User Authentication (Login/Register).
- Dashboard to manage categories and menu items:
  - Add, edit, delete, and filter menu items by category.
  - Validate inputs for duplicate items, invalid prices, and required fields.
- Toggle item availability with a switch.
- Profile section to update restaurant information (name, logo, address, hours, and contact).
- Preview mode to view the menu page with restaurant details and items.
- Logout functionality for account security.

### Deployed URL

Visit the deployed application: [Digital Menu Frontend](https://digitalmenu-khaki.vercel.app)

## Project Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v14 or later)
- **npm** (v6 or later)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/bereverte/digital-menu-FE.git
   cd digital-menu-FE

2. Install dependencies:
   ```bash
   npm install

3. Create a .env file in the root directory and add the following:
   ```bash
   REACT_APP_API_BASE_URL=https://digital-menu-backend-hfa5.onrender.com

4. Start the development server:
   ```bash
   npm start

The app will be accessible at `http://localhost:3000`.

## Technologies Used:

- **React** for the frontend framework.
- **React-Router** for navigation.
- **Axios** for API requests.
- **SCSS** for styling.
