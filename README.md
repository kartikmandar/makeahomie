# Make a Homie

Make a Homie is an innovative platform designed to connect like-minded individuals for study partnerships and friendship. The application uses advanced matching algorithms based on user profiles, interests, and preferences to suggest compatible connections.

## Table of Contents

- [Make a Homie](#make-a-homie)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Project Structure](#project-structure)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [Running the Application](#running-the-application)
  - [Utility Scripts](#utility-scripts)
    - [check\_users.js](#check_usersjs)
  - [Matching Algorithm](#matching-algorithm)
    - [Data Used for Matching](#data-used-for-matching)
    - [Algorithm Steps](#algorithm-steps)
  - [Technology Stack](#technology-stack)
    - [Backend](#backend)
    - [Frontend](#frontend)
    - [Optional Hardware](#optional-hardware)
  - [Future Improvements](#future-improvements)
  - [Contributing](#contributing)
  - [License](#license)

## Overview

Make a Homie helps users find study buddies and friends with similar interests, academic backgrounds, and social preferences. The platform collects user data through a profile form and uses this information to generate matches based on compatibility. Users can view their matches, chat with them, and receive motivational quotes while waiting for matches.

The application features a unique presence tracking system that uses MAC addresses to identify when users are in the same physical location, enhancing the possibility of in-person connections.

## Features

- **User Authentication**: Secure login and registration system
- **Detailed User Profiles**: Collect information about user preferences, academic interests, and social habits
- **Advanced Matching Algorithm**: Uses natural language processing and cosine similarity to find compatible connections
- **Real-time Chat**: Direct messaging between matched users
- **Presence Detection**: Tracks user presence through MAC addresses to facilitate in-person meetings
- **Motivational Content**: Displays inspirational quotes for users while waiting for matches
- **Raspberry Pi Integration**: Optional hardware component for enhanced matching capabilities
- **Responsive UI**: Built with Material UI for a clean, modern user experience

## Project Structure

```
makeahomie/
├── check_users.js                 # Utility script to check database users
├── package.json                   # Root project configuration
├── backend/
│   ├── database.sqlite            # SQLite database file
│   ├── package.json               # Backend dependencies
│   ├── server.js                  # Express server configuration
│   ├── models/                    # Database models
│   │   ├── Match.js               # Match data model
│   │   ├── Message.js             # Chat messages model
│   │   ├── PresenceLog.js         # User presence tracking model
│   │   └── User.js                # User profile model
│   ├── routes/                    # API endpoints
│   │   ├── auth.js                # Authentication routes
│   │   ├── chat.js                # Chat functionality routes
│   │   ├── match.js               # Match generation/retrieval routes
│   │   ├── presence.js            # Presence tracking routes
│   │   ├── profile.js             # User profile management routes
│   │   └── raspberry_pi.js        # Raspberry Pi integration routes
│   └── utils/                     # Helper utilities
│       ├── cosine_similarity.js   # Implementation of cosine similarity algorithm
│       ├── database.js            # Database connection setup
│       └── match_generation.js    # Match generation algorithm
├── frontend/
│   ├── App.jsx                    # Main application component
│   ├── Chat.jsx                   # Chat interface component
│   ├── index.css                  # Global styles
│   ├── index.html                 # HTML entry point
│   ├── Login.jsx                  # Login page component
│   ├── main.jsx                   # React entry point
│   ├── package.json               # Frontend dependencies
│   ├── ProfileForm.jsx            # User profile form component
│   ├── Register.jsx               # User registration component
│   ├── SwipeView.jsx              # Match display and interaction component
│   ├── theme.jsx                  # Material UI theme configuration
│   └── vite.config.js             # Vite bundler configuration
```

## Installation

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- SQLite
- (Optional) Raspberry Pi for enhanced functionality

### Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd makeahomie
   ```

2. Install dependencies for backend and frontend:
   ```bash
   npm run install-all
   ```
   
   This command will install dependencies for both the backend and frontend.

## Running the Application

1. Start both backend and frontend in development mode:
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server at http://localhost:8000
   - Frontend development server at http://localhost:5173

2. For production:
   ```bash
   # Start only the backend server
   npm start
   
   # For the frontend, first build and then serve
   cd frontend
   npm run build
   ```

## Utility Scripts

### check_users.js

The `check_users.js` script is a utility tool that allows developers and administrators to inspect the contents of the database directly. It provides a quick way to debug and monitor the application data without needing to use external database management tools.

**Functionality:**
- Connects directly to the SQLite database file
- Lists all users stored in the database with their key profile information
- Shows all matches that have been generated
- Displays match scores between users

**How to run:**
```bash
node check_users.js
```

**Example output:**
```
Using database at: /path/to/makeahomie/backend/database.sqlite
Database connection established successfully.

Found 3 users in the database:

--- User 1 ---
UserID: user123
Name: John Doe
Department: Computer Science
Join reason: Looking for study partners
Combined text: present
-------------------

--- User 2 ---
UserID: user456
Name: Jane Smith
Department: Engineering
Join reason: Want to make friends
Combined text: present
-------------------

Found 1 matches in the database:

--- Match 1 ---
User1: user123
User2: user456
Score: 0.78
-------------------

Database connection closed.
```

This script is particularly useful for:
- Troubleshooting matching issues
- Verifying user registration and profile creation
- Checking if the matching algorithm is working properly
- Data audit and quality control

## Matching Algorithm

Make a Homie uses a sophisticated matching algorithm based on several user attributes:

### Data Used for Matching
- **Text Data**: Combined textual information from user profiles
- **Categorical Data**: Gender, department, study preferences, socialization preferences, meeting preferences, and reasons for joining
- **Numeric Data**: Age, introvert scale, and discussion level preference

### Algorithm Steps

1. **Text Processing**:
   - The algorithm uses Term Frequency-Inverse Document Frequency (TF-IDF) to analyze textual data from user profiles
   - This converts text into numerical vectors that represent the importance of different terms in each profile

2. **Vector Comparison**:
   - Cosine similarity is used to compare the TF-IDF vectors between different users
   - This measures the similarity between two users based on their text data
   - The value ranges from 0 (completely different) to 1 (identical)

3. **Match Generation**:
   - Pairs with a similarity score above a defined threshold (0.5 by default) are considered potential matches
   - Self-matches are excluded from the results
   - The final match score represents how compatible two users are

4. **Presence Enhancement**:
   - Optionally, the system can factor in physical proximity through MAC address detection
   - This helps identify when potential matches are in the same physical location

## Technology Stack

### Backend
- **Node.js** and **Express.js**: Server framework
- **Sequelize**: ORM for database interactions
- **SQLite**: Database for storing user data and matches
- **Natural**: NLP library for text processing
- **CORS**: Cross-Origin Resource Sharing middleware

### Frontend
- **React**: UI library
- **Material UI**: Component library for design
- **Axios**: HTTP client for API requests
- **React Router**: Client-side routing

### Optional Hardware
- **Raspberry Pi**: For enhanced presence detection and match processing

## Future Improvements

The following features and improvements are planned for future development:

1. **Enhanced Privacy Features**:
   - Implement more robust user data protection
   - Add options to control profile visibility

2. **Advanced Matching Algorithms**:
   - Incorporate machine learning models for better match prediction
   - Add feedback-based learning to improve match quality over time

3. **Integration Improvements**:
   - Enhance Raspberry Pi functionality for better presence detection
   - Add support for other IoT devices

4. **UI/UX Enhancements**:
   - Implement profile pictures
   - Add more customizable user profiles
   - Create a more interactive matching interface

5. **Scalability**:
   - Migrate from SQLite to a more scalable database like PostgreSQL
   - Implement caching mechanisms for faster match retrieval
   - Add API rate limiting for security

6. **Additional Features**:
   - Group matching for study groups
   - Event scheduling and calendar integration
   - Academic resource sharing between matches

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.