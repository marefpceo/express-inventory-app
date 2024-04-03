# Express Inventory App

### Introduction
Express Inventory App is an inventory management web application designed for a ficticous grocery store. The app makes use of CRUD methods for managing, maintaining and updating the store's inventory. The app aims to give users a quick and efficient way view and manage inventories, by organizing items by categories and subcategories. 

Express Inventory App is from the The Odin Project course's NodeJS Module, Project: Inventory Application. 

### Project Support Features
* Public users can create, read, and update Categories, Subcategories, and Items
* Administrative password is required for deletions
* Images can be added and uploaded to Items (Optional)

### Installation Guide
[Click here for live demo](https://highfalutin-cat-avenue.glitch.me)

#### Local Install
* Clone this repository [here](https://github.com/marefpceo/express-inventory-app)
* The main branch will be the most stable branch at any given time, so ensure you are working from it

  > *Deployment branches are specific to a deployment and based on the platform being deployed to (ie. main branch uses node version lts, glitch_deployment_branch uses node v16.14.2)*

* Run `npm install` to install all dependencies
* Create an ***.env*** file in the project's root directory and add project variables

  >`MONGODB_URI` and `ADMIN_PASSWORD` are the only two variables currently used. Use this file to adjust or add more variables if needed.
  >
  >* `MONGODB_URI` stores database connection.
  >* `ADMIN_PASSWORD` stores password for deleting items, categories and subcategories

### Usage
* Run `npm run serverstart` to start the application
* Open web browser and navigate to `https://localhost:3000` 

### Technologies Used
* [NodeJS](https://www.nodejs.org/) is a cross-platform, open-source JavaScript runtime environment that runs on the V8 JavaScript engine. Node.js lets developers use JavaScript to write command line tools and for server-side scripting
* [ExpressJS](https://www.expressjs.org/) is a back end web application framework for building web applications and APIs.
* [Mongoose ODM](https://mongoosejs.com/) provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.
* [Express Validator](https://express-validator.github.io/)
* [Less](https://lesscss.org/) is a dynamic preprocessor style sheet language that can be compiled into Cascading Style Sheets and run on the client side or server side. 
* [EJS](https://ejs.co/) is a simple templating language that lets you generate HTML markup with plain JavaScript. 
