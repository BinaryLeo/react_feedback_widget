

<div align="center" style="margin: 20px; text-align: center">
  <p> A Feedback widget built using React JS and Tailwind CSS</p>
  
  [![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](https://github.com/BinaryLeo/react_feedback_widget_web/blob/main/LICENSE)
  ![GitHub last commit](https://img.shields.io/github/last-commit/BinaryLeo/react_feedback_widget_web?style=flat-square)
  ![GitHub top language](https://img.shields.io/github/languages/top/BinaryLeo/react_feedback_widget_web?style=flat-square)
  
</div>

<p align="center">
  <a href="#-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-how-it-works">How it works</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-license">License</a>
</p>

## 🧪 technologies

* [Frontend](https://github.com/BinaryLeo/react_feedback_widget_web/tree/main/web)  - [ReactJS](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Typescript](https://www.typescriptlang.org/), [ViteJS](https://vitejs.dev/), [Phosphor Icons](https://phosphoricons.com/).
* [Backend](https://github.com/BinaryLeo/react_feedback_widget_web/tree/main/server) - [Express](https://expressjs.com/), [Typescript](https://www.typescriptlang.org/), [Prisma](https://www.prisma.io/), [Mailtrap](https://mailtrap.io/), [Nodemailer](https://nodemailer.com/), [Jest](https://jestjs.io/), [PosgreSQL](https://www.postgresql.org/), [Postman](https://www.postman.com/).
* [Mobile application](https://github.com/BinaryLeo/react_feedback_widget_web/tree/main/mobile) - [React native](https://reactnative.dev/), [Expo](https://expo.dev/expo-go), [Bottom Sheet](https://gorhom.github.io/react-native-bottom-sheet/).

## 💡 how it works

Requirements:
* [NodeJs](https://nodejs.org/en/)
* [Yarn](https://classic.yarnpkg.com/) or [npm](https://www.npmjs.com/package/npm)
* [Expo CLI](https://docs.expo.dev/workflow/expo-cli)

 Clone the repository.
- Open the project from your IDE.
- Follow the steps below:

Web application

**Make sure to have the server running**

```bash
# From the project root folder access the 'web' folder
$ cd web

# Install the dependencies
$ npm install or yarn

# Start the application
$ npm run dev
```

Server
```bash
# From the project root folder access the 'server' folder
$ cd server

# Install the dependencies
$ npm install or yarn

# Edit your '.env.example' to '.env' and add your credentials
DATABASE_URL="postgresql://server:password@localhost:5432/databasename?schema=public"
SMTP="smtp.mailtrap.io"
USERMAIL="mailtrap username"
USERPASS="mailtrap password"


# With a PostgreSQL running, run the migrations
$ npx prisma migrate dev

# You can access Prisma Studio from:
$ npx prisma studio

# Start the server
$ npm run dev

# Routes 
 Post: http://localhost:3333/feedbacks

```

Mobile
```bash
... under development
```

## 📄 License

This project was built under MIT. See the file [LICENSE](LICENSE) for more details.

---
