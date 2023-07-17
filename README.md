# Blogging Platform CRUD Web Application


This project aims to create a CRUD web application for a blogging platform using Sequelize to manage the database relationships and implement user authentication and authorization. The application allows users to register, log in, create, view, update, and delete posts and comments. Additionally, it includes advanced querying and manipulation operations to retrieve posts with their associated users and comments, retrieve comments for a specific user or post, add comments to a post, and remove comments from a post.


## Task 1: Database Setup and Relationships

Set up a PostgreSQL database for the project.

Create the necessary tables: Users, Posts, and Comments, with appropriate columns and relationships.

Generate the models, migrations, and database tables using Sequelize.

### Implement the following relationships using Sequelize:
One-to-Many: A User can have multiple Posts and Comments.

One-to-Many: A Post can have multiple Comments.

Many-to-One: A Comment belongs to a User and a Post.

Define the associations between the models in Sequelize.

Test the relationships by creating sample data and performing queries to retrieve associated records.


## Task 2: User Registration and Login

Implement user registration functionality using hashed passwords and bcryptjs.

Create an API endpoint to handle user registration.

Implement user login functionality, creating a session cookie upon successful login.

Create an API endpoint for user login.

Test the user registration and login endpoints using Postman.

## Task 3: User Authentication and Authorization
Protect routes that require authentication by implementing middleware that checks for a valid session cookie.

Create middleware functions to validate the session cookie and ensure user authentication.

Apply the middleware to the appropriate routes.

Test the authentication and authorization flow using Postman, ensuring only authenticated users can access protected routes.

## Task 4: CRUD Operations for Posts
Implement CRUD operations for the Posts resource.

### Create API endpoints to handle the following operations:
Create a new Post.

Retrieve all Posts.

Retrieve a specific Post by ID.

Update a Post.

Delete a Post.

Ensure that only authenticated users can perform CRUD operations on Posts.

Test the CRUD operations using Postman.

## Task 5: CRUD Operations for Comments
Implement CRUD operations for the Comments resource.
### Create API endpoints to handle the following operations:
Create a new Comment.

Retrieve all Comments for a specific Post.

Retrieve a specific Comment by ID.

Update a Comment.

Delete a Comment.

Ensure that only authenticated users can perform CRUD operations on Comments.

Test the CRUD operations using Postman.

## (BONUS) Task 6: Advanced Queries and Manipulation
### Implement advanced querying and manipulation operations for the database relationships:
Retrieve all Posts with their associated User and Comments.

Retrieve all Comments for a specific User.

Retrieve all Comments for a specific Post.

Add a Comment to a Post.

Remove a Comment from a Post.

Create API endpoints to perform the above operations.

Test the advanced queries and manipulation using Postman.

Feel free to follow the above tasks to create a fully functional blogging platform with user authentication, CRUD operations for posts and comments, and advanced querying capabilities. Good luck with your project!
