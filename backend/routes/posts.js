import express from 'express';
import auth from '../middleware/auth.js';
import Posts from '../models/Posts.js';
import User from '../models/User.js';
import SubGreddiits from '../models/SubGreddiits.js';
const router = express.Router();

router.post("/create", auth, async (req, res, next) => {
    console.log(req.body);
    try {
        const newpost = await Posts.create({
            subgreddiit: req.body.subgreddiit,
            text: req.body.text,
            user: req.body.user,
            sub: req.body.sub,
            upvotes: req.body.upvotes,
            downvotes: req.body.downvotes,
            comments: req.body.comments,
            isComment: req.body.isComment,
        });
        res.send(newpost);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }

});

router.post("/getposts", auth, async (req, res, next) => {
    try {
        const posts = await Posts.find({ sub: req.body.sub, isComment: false });
        console.log(posts);
        let postinfo = []
        for (let i = 0; i < posts.length; i++) {
            let username = await User.findById(posts[i].user);
            let subgreddiit = await SubGreddiits.find({ name: posts[i].sub});
            console.log(subgreddiit)
            postinfo[i] = {
                _id: posts[i]._id,
                subgreddiit: posts[i].sub,
                text: posts[i].text,
                user: posts[i].user,
                username: (subgreddiit[0].blocked_users.includes(posts[i].user)) ?  "Blocked User" : username.username,
                sub: posts[i].sub,
                upvotes: posts[i].upvotes,
                downvotes: posts[i].downvotes,
                comments: posts[i].comments,
                isComment: posts[i].isComment,
            }
        }
        res.send(postinfo);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.post("/upvote", auth, async (req, res, next) => {
    try {
        const currpost = await Posts.find({ _id: req.body.postid });
        let upvotes = currpost[0].upvotes;
        let downvotes = currpost[0].downvotes;
        let upvoted = false;
        let downvoted = false;
        for (let i = 0; i < upvotes.length; i++) {
            if (upvotes[i] == req.body.userid) {
                upvoted = true;
                break;
            }
        }
        for (let i = 0; i < downvotes.length; i++) {
            if (downvotes[i] == req.body.userid) {
                downvoted = true;
                break;
            }
        }
        if (upvoted) {
            upvotes = upvotes.filter((item) => item != req.body.userid);
        }
        else {
            upvotes.push(req.body.userid);
        }
        if (downvoted) {
            downvotes = downvotes.filter((item) => item != req.body.userid);
        }
        const filter = { _id: req.body.postid };
        const update = { upvotes: upvotes, downvotes: downvotes };
        const upd = await Posts.updateOne(filter, update);
        res.send(upd);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.post("/downvote", auth, async (req, res, next) => {
    try {
        const currpost = await Posts.find({ _id: req.body.postid });
        let upvotes = currpost[0].upvotes;
        let downvotes = currpost[0].downvotes;
        let upvoted = false;
        let downvoted = false;
        for (let i = 0; i < upvotes.length; i++) {
            if (upvotes[i] == req.body.userid) {
                upvoted = true;
                break;
            }
        }
        for (let i = 0; i < downvotes.length; i++) {
            if (downvotes[i] == req.body.userid) {
                downvoted = true;
                break;
            }
        }
        if (downvoted) {
            downvotes = downvotes.filter((item) => item != req.body.userid);
        }
        else {
            downvotes.push(req.body.userid);
        }
        if (upvoted) {
            upvotes = upvotes.filter((item) => item != req.body.userid);
        }
        const filter = { _id: req.body.postid };
        const update = { upvotes: upvotes, downvotes: downvotes };
        const upd = await Posts.updateOne(filter, update);
        res.send(upd);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.post("/comment", auth, async (req, res, next) => {
    try {
        const comment = await Posts.create({
            text: req.body.text,
            user: req.body.user,
            sub: req.body.sub,
            upvotes: req.body.upvotes,
            downvotes: req.body.downvotes,
            comments: req.body.comments,
            isComment: true,
        });
        const currpost = await Posts.find({ _id: req.body.postid });
        let comments = currpost[0].comments;
        comments.push(comment._id);
        const filter = { _id: req.body.postid };
        const update = { comments: comments };
        const upd = await Posts.updateOne(filter, update);
        res.send(upd);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.post("/getcomments", auth, async (req, res, next) => {
    try {
        const currpost = await Posts.find({ _id: req.body.postid });
        let comments = currpost[0].comments;
        let commentinfo = []
        for (let i = 0; i < comments.length; i++) {
            let comment = await Posts.find({ _id: comments[i], isComment: true });
            commentinfo[i] = {
                _id: comment[0]._id,
                text: comment[0].text,
                user: comment[0].user,
            }
        }
        console.log(commentinfo);
        res.send(commentinfo);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.get("/countposts", auth, async (req, res, next) => {
    try {
        const posts = await Posts.find({user: req.user.id});
        res.send(posts.length.toString());
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.post("/onecomment", auth, async (req, res, next) => {
    try {
        const comment = await Posts.findOne({ _id: req.body.commentid });
        res.send(comment);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.post("/savepost", auth, async (req, res, next) => {
    try {
        const currUser = await User.findById(req.user.id);
        currUser.saved_posts.push(req.body.postid);
        
        let filter = { _id: req.user.id };
        let update = { saved_posts: currUser.saved_posts };

        try{
            const upd = await User.updateOne(filter, update);
            res.send(upd);

        } catch (error) {
            console.log("Error:", error);
            res.status(500).send({ errors: [{ msg: "Server error" }] });
        }
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.get("/getsavedposts", auth, async (req, res, next) => {
    try {
        const currUser = await User.findById(req.user.id);
        console.log(currUser);
        let saved_posts = currUser.saved_posts;
        let saved_posts_info = [];
        for (let i = 0; i < saved_posts.length; i++) {
            let post = await Posts.find({ _id: saved_posts[i] });
            const pUser = await User.findById(post[0].user);
            saved_posts_info[i] = {
                _id: post[0]._id,
                text: post[0].text,
                user: post[0].user,
                username: pUser.username,
                sub: post[0].sub,
                upvotes: post[0].upvotes,
                downvotes: post[0].downvotes,
                comments: post[0].comments,
                isComment: post[0].isComment,
                
            }
        }
        res.send(saved_posts_info);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.post("/removesavedpost", auth, async(req, res) => {
    try{
        const userInfo = await User.findById(req.user.id);
        console.log(userInfo);
        userInfo.saved_posts.filter((item) => item != req.body.postid);
        console.log(userInfo.saved_posts);
        const filter = {_id: req.user.id}
        const update = {saved_posts: userInfo.saved_posts.filter((item) => item != req.body.postid)}
        try {
            const upd = await User.updateOne(filter, update);
            res.send(upd);
        } catch (err) {
            console.log(err);
            res.status(500).send({ errors: [{ msg: "Server error" }] });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});


export default router;
