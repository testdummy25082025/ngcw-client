<!-- ## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-link> or zip file path 
cd blog
```

### 2. Frontend Setup

```bash
npx create-react-app blog
cd blog
npm start

# Install required dependencies
npm i react-router-dom
npm i react-icons
npm install @emailjs/browser
npm install axios
npm init -y
npm install @fortawesome/fontawesome-free
npm install react-icons
npm install lucide-react
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install multer
npm install cloudinary multer-storage-cloudinary dotenv pg
```

### 4. Database Configuration

Navigate to backend `config/db.js` and update PostgreSQL details:

```js
user: process.env.PGUSER || '<user>',
host: process.env.PGHOST || '<hostname>',
database: process.env.PGDATABASE || '<database>',
password: process.env.PGPASSWORD || '<password>',
port: process.env.PGPORT ? parseInt(process.env.PGPORT) : <port>,
```

Run the backend:

```bash
cd ../
node server.js
``` -->





## Frontend Setup

## 1. Create and Run React App

```bash
npx create-react-app blog
cd blog
npm start
```

`npx create-react-app blog`: Bootstraps a new React project named `blog`.
`cd blog`: Navigates into the project folder.
`npm start`: Starts the development server (usually on `http://localhost`).

## 2. Install Frontend Dependencies


```bash
npm i react-router-dom
npm i react-icons
npm install @emailjs/browser
npm install axios
npm install @fortawesome/fontawesome-free
npm install lucide-react
npm install react-scroll-to-top
npm install react-toastify
```

| Package                             | Description                                                          |
| ----------------------------------- | -------------------------------------------------------------------- |
| `react-router-dom`                  | Enables navigation between different components/pages.               |
| `react-icons`                       | Provides popular icon libraries (FontAwesome, Material Icons, etc.). |
| `@emailjs/browser`                  | Used to send emails directly from the frontend without a backend.    |
| `axios`                             | Promise-based HTTP client for API requests.                          |
| `@fortawesome/fontawesome-free`     | Font Awesome icon library.                                           |
| `lucide-react`                      | A modern icon library with beautiful, consistent icons.              |
| `react-scroll-to-top`               | Adds a smooth "scroll to top" button.                                |
| `react-toastify`                    | Provides easy-to-use toast notifications.                            |



##  Backend Setup

## 1. Initialize Node.js Project

* node server.js //for backend running 

```bash
npm init -y
```

`npm init -y`: Creates a default `package.json` file for the backend.

### 2. Install Backend Dependencies

```bash
npm install multer
npm install cloudinary multer-storage-cloudinary dotenv pg
npm install bcryptjs
npm install csv-writer nodemailer node-cron
```

| Package                         | Description                                                       |
| ------------------------------- | ----------------------------------------------------------------- |
| `multer`                        | Middleware for handling file uploads.                             |
| `cloudinary`                    | Cloud-based image and video management service.                   |
| `multer-storage-cloudinary`     | Integration between `multer` and `cloudinary`.                    |
| `dotenv`                        | Loads environment variables from `.env` into `process.env`.       |
| `pg`                            | PostgreSQL client for Node.js.                                    |
| `bcryptjs`                      | Library to hash passwords securely.                               |
| `csv-writer`                    | Allows creation of CSV files (useful for exporting data).         |
| `nodemailer`                    | Enables sending emails from the backend.                          |
| `node-cron`                     | Allows scheduling tasks (like sending emails or running backups). |


📁 Folder Structure Recommendation

blog/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   └── App.js
└── backend/
    ├── controllers/
    ├── routes/
    ├── models/
    ├── utils/
    ├── .env
    ├── server.js



username,email,password and role

*  owner owner@gmail.com abc123 Owner
*  admin admin@gmail.com abc123 Admin
*  blogger blogger@gmail.com abc123 Blogger



sql file

SELECT * FROM public.event
ORDER BY id ASC 


SELECT * FROM public.users
ORDER BY id ASC 


SELECT * FROM public.blogs
ORDER BY id ASC 