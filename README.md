⬛️ Alzikrayat (MERN Edition)

A full-stack photo sharing app for campus life. Members register, upload photos with a title and story, browse a responsive gallery (grid or list), open a photo to read and add comments, and delete their own photos.

Built for the Advanced Web Technologies course, Project 3.

⬛️ Tech stack

| Tier | Technology |
|---|---|
| Presentation | React 18, Vite, React Router 6 (hand-written components, no UI kit) |
| Application | Node.js, Express 4 REST API, Joi validation, multer uploads |
| Data | MongoDB with Mongoose schemas, bcrypt password hashing |

⬛️ Project structure

```
alzikrayat-mern/
├── server/
│   ├── models/         User.js, Photo.js, Comment.js
│   ├── routes/         authRoutes.js, photoRoutes.js, commentRoutes.js
│   ├── controllers/    authController.js, photoController.js, commentController.js, statsController.js
│   ├── middleware/     validation.js (Joi), requireUser.js, upload.js (multer), errorHandler.js
│   ├── uploads/        stored image files
│   └── server.js       Express entry point
└── client/
    └── src/
        ├── components/ Navbar, PhotoCard, CommentForm, Feedback, Footer
        ├── pages/      Home, Gallery, PhotoDetail, LoginRegister, Upload, NotFound
        ├── context/    AuthContext (logged-in user)
        ├── utils/      api.js (fetch wrapper), useFetch.js, format.js
        ├── App.jsx     route configuration
        └── main.jsx    entry point
```

⬛️ Requirements

- Node.js 18 or newer
- A MongoDB database: a free MongoDB Atlas cluster, or MongoDB Community Server running locally

⬛️ Setup

### 1. Server

```bash
cd server
npm install
cp .env.example .env      # on Windows PowerShell: Copy-Item .env.example .env
```

Open `server/.env` and set your values:

| Variable | Meaning | Example |
|---|---|---|
| `PORT` | Port for the API | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/alzikrayat` or your Atlas URI |

Start the API:

```bash
npm run dev
```

You should see `MongoDB connected`. Check `http://localhost:5000/api/health`.

### 2. Client

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server forwards `/api` and `/uploads` to the Express server (see `client/vite.config.js`), so no extra configuration is needed.

## REST API

| Method | Route | Auth | Description | Success |
|---|---|---|---|---|
| POST | `/api/auth/register` | no | Create an account | 201 |
| POST | `/api/auth/login` | no | Log in, returns the public profile | 200 |
| GET | `/api/photos` | no | List photos, newest first, with comment counts | 200 |
| GET | `/api/photos/:id` | no | One photo with its owner | 200 |
| POST | `/api/photos` | yes | Upload a photo (multipart: `image`, `title`, `description`) | 201 |
| DELETE | `/api/photos/:id` | yes, owner only | Delete a photo, its file and its comments | 204 |
| GET | `/api/photos/:id/comments` | no | Comments for a photo, oldest first | 200 |
| POST | `/api/photos/:id/comments` | yes | Add a comment | 201 |
| GET | `/api/stats` | no | Counts of users, photos and comments | 200 |
| GET | `/api/health` | no | Server and database status | 200 |

Error codes: `400` validation failed, `401` not logged in or wrong credentials, `403` not the owner, `404` not found, `409` email already registered.

⬛️ Authentication (basic)

As required by Project 3, authentication is basic:

- Passwords are hashed with bcrypt and the hash is never returned by the API.
- After login the client keeps the user in React state (mirrored in `localStorage`).
- For write operations (upload, delete, comment) the client sends the user's id in an `x-user-id` header and the server checks that the user exists. Ownership for deletion is verified on the server.
- This header approach is not tamper-proof. JWT-based authentication (Bonus Project 4) is the proper replacement.

⬛️ Features checklist

- Register and login with bcrypt; toolbar shows "Hi <firstName>" with Logout, or "Please Login"
- Photo upload with file stored in `server/uploads/` and metadata saved in MongoDB
- Responsive gallery with grid and list layouts, plus title search
- Photo detail route `/photos/:id` using `useParams`
- Comments appear instantly without reloading the page
- Owner-only deletion, validated on the server
- Joi validation, central error handler, loading and error states on every page
