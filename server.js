const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const { requireAuth } = require("./authMiddleware");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate a JWT token and set it in a cookie
    const token = jwt.sign({ userId: user.id }, "My5up3rS3cur3R@nd0mK3y!");
    res.cookie("token", token, { httpOnly: true, secure: true });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/dashboard", requireAuth, async (req, res) => {
  // Only authenticated users can access this route
  try {
    const user = await user.findByPk(req.userId);

    return res.status(200).json({
      username: user.username,
      email: user.email,
      message: "You are authenticated and authorized to access this route",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/posts", requireAuth, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.userId; // Get the authenticated user's ID from the JWT token

  try {
    const post = await Post.create({
      title,
      content,
      UserId: userId, // Associate the Post with the authenticated user
    });

    return res.status(201).json({ post });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// Retrieve all Posts
app.get("/posts", requireAuth, async (req, res) => {
  try {
    const posts = await Post.findAll();
    return res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// Retrieve a specific Post by ID
app.get("/posts/:id", requireAuth, async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({ post });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// Update a Post
app.put("/posts/:id", requireAuth, async (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update the Post data
    post.title = title;
    post.content = content;
    await post.save();

    return res.status(200).json({ post });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// Delete a Post
app.delete("/posts/:id", requireAuth, async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.destroy();

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/comments", requireAuth, async (req, res) => {
  const { postId, content } = req.body;
  const userId = req.userId; // Get the authenticated user's ID from the JWT token

  try {
    // Check if the associated Post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      content,
      PostId: postId, // Associate the Comment with the specified Post
      UserId: userId, // Associate the Comment with the authenticated user
    });

    return res.status(201).json({ comment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// Retrieve all Comments for a specific Post
app.get("/posts/:postId/comments", requireAuth, async (req, res) => {
  const postId = req.params.postId;

  try {
    // Check if the associated Post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.findAll({ where: { PostId: postId } });
    return res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// Retrieve a specific Comment by ID
app.get("/comments/:id", requireAuth, async (req, res) => {
  const commentId = req.params.id;

  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json({ comment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// Update a Comment
app.put("/comments/:id", requireAuth, async (req, res) => {
  const commentId = req.params.id;
  const { content } = req.body;

  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Update the Comment data
    comment.content = content;
    await comment.save();

    return res.status(200).json({ comment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// Delete a Comment
app.delete("/comments/:id", requireAuth, async (req, res) => {
  const commentId = req.params.id;

  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await comment.destroy();

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// BONUS

app.get("/posts-with-comments", async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
        {
          model: Comment,
          attributes: ["id", "content", "createdAt"],
          include: [
            {
              model: User,
              attributes: ["id", "username", "email"],
            },
          ],
        },
      ],
    });

    return res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// Retrieve all Comments for a specific User
app.get("/users/:userId/comments", requireAuth, async (req, res) => {
  const userId = req.params.userId;

  try {
    // Check if the specified User exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const comments = await Comment.findAll({ where: { UserId: userId } });
    return res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// Retrieve all Comments for a specific Post
app.get("/posts/:postId/comments", requireAuth, async (req, res) => {
  const postId = req.params.postId;

  try {
    // Check if the specified Post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.findAll({ where: { PostId: postId } });
    return res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// Add a Comment to a Post
app.post("/posts/:postId/comments", requireAuth, async (req, res) => {
  const { content } = req.body;
  const postId = req.params.postId;
  const userId = req.userId; // Get the authenticated user's ID from the JWT token

  try {
    // Check if the associated Post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      content,
      PostId: postId, // Associate the Comment with the specified Post
      UserId: userId, // Associate the Comment with the authenticated user
    });

    return res.status(201).json({ comment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

// Remove a Comment from a Post
app.delete(
  "/posts/:postId/comments/:commentId",
  requireAuth,
  async (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    try {
      // Check if the associated Post exists
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Check if the specified Comment exists and belongs to the specified Post
      const comment = await Comment.findOne({
        where: { id: commentId, PostId: postId },
      });
      if (!comment) {
        return res
          .status(404)
          .json({ message: "Comment not found for the specified Post" });
      }

      await comment.destroy();

      return res.status(200).json({ message: "Comment removed successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
