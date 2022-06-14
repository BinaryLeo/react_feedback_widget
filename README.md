
<div align="center" style="margin: 20px; text-align: center">
  <p> A Feedback widget built using React JS and Tailwind CSS</p>
  <p>Get feedback from your customers with screenshots directly from your app. Fast, easy and built-in</p>
  
  [![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](https://github.com/BinaryLeo/react_feedback_widget_web/blob/main/LICENSE)
  ![GitHub last commit](https://img.shields.io/github/last-commit/BinaryLeo/react_feedback_widget_web?style=flat-square)
  ![GitHub top language](https://img.shields.io/github/languages/top/BinaryLeo/react_feedback_widget_web?style=flat-square)
  
</div>
<p align="center">
  <a href="#-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-how-it-works">How it works</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-how-to-use">How to use</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-license">License</a>

</p>
<div>

  ![binary_mockup](https://user-images.githubusercontent.com/72607039/172846428-f16e66f6-4d23-4a46-a3b8-0f82a82e0ff7.png)

</div>  

<div align="center" style="margin: 20px; text-align: center">
 
  ![feedback_web](https://user-images.githubusercontent.com/72607039/166928087-e342a37b-c747-4b28-8833-f0583cc3d608.gif)
 
  </div>

## 🧪 technologies

* [Frontend](https://github.com/BinaryLeo/react_feedback_widget_web/tree/main/web)  - [ReactJS](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Typescript](https://www.typescriptlang.org/), [ViteJS](https://vitejs.dev/), [Phosphor Icons](https://phosphoricons.com/).
* [Backend](https://github.com/BinaryLeo/react_feedback_widget_web/tree/main/server) - [Express](https://expressjs.com/), [Typescript](https://www.typescriptlang.org/), [Prisma](https://www.prisma.io/), [Mailtrap](https://mailtrap.io/), [Nodemailer](https://nodemailer.com/), [Jest](https://jestjs.io/), [PostgreSQL](https://www.postgresql.org/), [Postman](https://www.postman.com/).
* [Mobile application](https://github.com/BinaryLeo/react_feedback_widget_web/tree/main/mobile) - [React native](https://reactnative.dev/), [Expo](https://expo.dev/expo-go), [Bottom Sheet](https://gorhom.github.io/react-native-bottom-sheet/).

## 💡 how it works
This is a feedback widget built with React to be applied on any website for a simple interaction between the customer and the company.

## 💡 how to use

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
**Make sure to have the server running**
```bash
# From the project root folder access the 'mobile' folder
$ cd mobile

# Install the dependencies
$ npm install

# If you are going to emulate with android, run this command
$ npm run android

# If you are going to emulate with ios, run this command
$ npm run ios

# Or just start the bundle
$ npm run start
```

## 📄 License

This project was built under MIT. See the file [LICENSE](LICENSE) for more details.

---
