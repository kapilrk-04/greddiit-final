import express from "express";
import Follow from "../models/Follow.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
    try {
        console.log(req.body)
        const { follower, following } = req.body;
        let followerdetails = await User.findOne({ username: follower });
        let followingdetails = await User.findOne({ username: following });

        let followerid = followerdetails._id;
        let followingid = followingdetails._id;

        const follow = await Follow.create({ followerid, followingid });
        res.send(follow);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.post("/followids", auth, async (req, res, next) => {
    try {
        console.log(req.body);
        const follow = await Follow.create({ follower: req.body.follower, following: req.body.following });
        res.send(follow);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});
router.get("/followerscount", auth, async (req, res, next) => {
    try {
        console.log(req.user);
        const follow = await Follow.find({ following: req.user.id });
        console.log(follow);
        console.log(follow.length);
        res.send(JSON.stringify(follow.length));
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.get("/followingcount", auth, async (req, res, next) => {
    try {
        console.log(req.user);
        const follow = await Follow.find({ follower: req.user.id });
        console.log(follow);
        console.log(follow.length);
        res.send(JSON.stringify(follow.length));
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.get("/followers", auth, async (req, res, next) => {
    try {
        console.log(req.user);
        let followers = [];
        followers[0] = await User.findById(req.user.id);
        const follow = await Follow.find({ following: req.user.id });
        for (let i = 0; i < follow.length; i++) {
            followers[i+1] = await User.findById(follow[i].follower);
        }
        console.log(followers);
        res.send(followers);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.get("/following", auth, async (req, res, next) => {
    try {
        console.log(req.user);
        let following = [];
        following[0] = await User.findById(req.user.id);
        const follow = await Follow.find({ follower: req.user.id });
        for (let i = 0; i < follow.length; i++) {
            following[i+1] = await User.findById(follow[i].following);
        }

        console.log(following);
        res.send(following);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});    

router.post("/delete", async (req, res, next) => {
    try {
        const { follower, following } = req.body;
        const deletion = await Follow.findOneAndDelete({ follower, following });
        res.send(deletion);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});


export default router;