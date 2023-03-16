const User = require("../models/user");

const getAllLikedList = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      res.json({ user: user });
    } else {
      return res.status(404).json({ error: "no user found" });
    }
  } catch (error) {
    return res.status(422).json({ error: error });
  }
};

const addLikedMovie = async (req, res) => {
  try {
    const { email, data } = req.body;

    const user = await User.findOne({ email: email });
    if (user) {
      const { likedMovies } = user;
      const isAlreadyLiked = likedMovies.filter((movie) => movie.id == data.id);

      if (isAlreadyLiked.length == 0) {
        await User.findByIdAndUpdate(
          user._id,
          { $push: { likedMovies: data } },
          { new: true }
        )
          .then((updatedUser) => {
            res.json({ user: updatedUser });
          })
          .catch((err) => {
            res.status(422).json({ error: err });
          });
      } else {
        return res.status(409).json({ error: "Movie is Already liked" });
      }
    } else {
      const newUser = new User({
        email: email,
        likedMovies: [data],
      });

      await newUser
        .save()
        .then((createdUser) => {
          res.json({ user: createdUser });
        })
        .catch((err) => {
          res.status(422).json({ error: err });
        });
    }
  } catch (error) {
    return res.json({ error: error });
  }
};

const removeLikedMovie = async (req, res) => {
  try {
    const { email, data } = req.body;

    const foundUser = await User.findOne({ email: email });

    if (foundUser) {
      const { likedMovies } = foundUser;
      const isAdded = likedMovies.filter((movie) => movie.id == data.id);

      if (isAdded.length > 0) {
        await User.findByIdAndUpdate(
          foundUser._id,
          {
            $pull: { likedMovies: { id: data.id } },
          },
          { new: true }
        )
          .then((updatedUser) => {
            res.json({ user: updatedUser });
          })
          .catch((err) => {
            return res.status(422).json({ error: "Update Failed" });
          });
      } else {
        return res.status(409).json({ error: "movie not added as liked" });
      }
    } else {
      return res.status(404).json({ error: "No user found" });
    }
  } catch (error) {
    res.status(422).json({ error: error });
  }
};

module.exports = { getAllLikedList, addLikedMovie, removeLikedMovie };
