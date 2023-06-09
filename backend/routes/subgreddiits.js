import express from "express";
import Follow from "../models/Follow.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";
import SubGreddiit from "../models/SubGreddiits.js";
import Report from "../models/Report.js";
import Post from "../models/Posts.js";

const router = express.Router();

router.post("/", auth, async (req, res, next) => {
    console.log(req.body);
    try {
        const { name, description, tags, banned_words, moderators, followers, blocked_users, join_requests, posts, reports } = req.body;
        const subGreddiit = await SubGreddiit.create({ name, description, tags, banned_words, moderators, followers, blocked_users, join_requests, posts, reports });
        res.send(subGreddiit);
    }
    catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.post("/delete", auth, async (req, res, next) => {
    console.log(req.body);
    try {
        let delsub = await SubGreddiit.findById(req.body.subid);
        console.log(delsub);
        let delposts = await Post.find({ sub: delsub.name });
        let delreports = delsub.reports;
        let delcomments = [];
        for (let i = 0; i < delposts.length; i++) {
            let delpost = await Post.findById(delposts[i]);
            delcomments = delcomments.concat(delpost.comments);
        }

        for (let i = 0; i < delcomments.length; i++) {
            let delcomment = await Post.findByIdAndDelete(delcomments[i]);
            console.log(delcomment);
        }

        for (let i = 0; i < delreports.length; i++) {
            let delreport = await Report.findByIdAndDelete(delreports[i]);
            console.log(delreport);
        }

        for (let i = 0; i < delposts.length; i++) {
            let delpost = await Post.findByIdAndDelete(delposts[i]);
            console.log(delpost);
        }

        let finaldel = await SubGreddiit.findByIdAndDelete(req.body.subid);
        console.log(finaldel);
        res.send(finaldel);        
    }
    catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.post("/onesub", auth, async (req, res, next) => {
    try {
        console.log(req.body);
        let sub = await SubGreddiit.find({ name: req.body.name });
        console.log(sub);
        res.send(sub);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.get("/allmysubs", auth, async (req, res, next) => {
    try {
        console.log(req.user.id);
        let subs = await SubGreddiit.find({ moderators: req.user.id });
        console.log(subs);
        res.send(subs);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.get("/allfollowedsubs", auth, async (req, res, next) => {
    try {
        console.log(req.user.id);
        let subs = await SubGreddiit.find({ followers: req.user.id });
        console.log(subs);
        res.send(subs);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.get("/allsubs", auth, async (req, res, next) => {
    try {
        console.log(req.user.id);
        let allsubs = await SubGreddiit.find();
        console.log(allsubs);
        res.send(allsubs);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.post("/allfollowers", auth, async (req, res, next) => {
    try {
        console.log(req.body);
        let sub = await SubGreddiit.find({ name: req.body.name });
        let subfollowers = [];
        for (let i=0; i<sub[0].followers.length; i++)
        {   
            try{
                let user = await User.findById(sub[0].followers[i])
                let subfollowers_username = user.username;
                let subfollowers_name = user.firstname+ " " + user.lastname;
                let subfollowers_id = user._id;
                subfollowers[i] = {_id: subfollowers_id ,username: subfollowers_username, name: subfollowers_name};
            } catch (error) {
                console.log("Error:", error);
                res.status(500).send({ errors: [{ msg: "Server error" }] });
            }

        }
        console.log(subfollowers);
        res.send(subfollowers);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.post("/alljoinrequests", auth, async (req, res, next) => {
    try {
        console.log(req.body);
        let sub = await SubGreddiit.find({ name: req.body.name });
        let subjoinrequests = [];

        for (let i=0; i<sub[0].join_requests.length; i++)
        {
            try{
                let user = await User.findById(sub[0].join_requests[i])
                let subjoinrequests_username = user.username;
                let subjoinrequests_name = user.firstname+ " " + user.lastname;
                let subjoinrequests_id = user._id;
                subjoinrequests[i] = {_id: subjoinrequests_id ,username: subjoinrequests_username, name: subjoinrequests_name};
            }
            catch (error) {
                console.log("Error:", error);
                res.status(500).send({ errors: [{ msg: "Server error" }] });
            }
        }
        console.log(subjoinrequests);
        res.send(subjoinrequests);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.post("/allblockedusers", auth, async (req, res, next) => {
    try {
        console.log(req.body);
    let sub = await SubGreddiit.find({ name: req.body.name });
    let subblockedusers = [];
    for (let i=0; i<sub[0].blocked_users.length; i++)
    {
        try{
            let user = await User.findById(sub[0].blocked_users[i])
            let subblockedusers_username = user.username;
            let subblockedusers_name = user.firstname+ " " + user.lastname;
            subblockedusers[i] = {username: subblockedusers_username, name: subblockedusers_name};
        }
        catch (error) {
            console.log("Error:", error);
            res.status(500).send({ errors: [{ msg: "Server error" }] });
        }
    }
    console.log(subblockedusers);
    res.send(subblockedusers);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.post("/acceptreq", auth, async (req, res, next) => {
    try {
        console.log(req.body);
        let sub = await SubGreddiit.findOne({ name: req.body.name });
        try{
            sub.join_requests = sub.join_requests.filter((item) => item !== req.body._id);
            if(sub.blocked_users.includes(req.body._id))
            {
                sub.blocked_users = sub.blocked_users.filter((item) => item !== req.body._id);
            }
        }
        catch (error) {
            console.log("Error:", error);
            res.status(500).send({ errors: [{ msg: "Server error" }] });
        }

        try{
            sub.followers.push(req.body._id);
        }
        catch (error) {
            console.log("Error:", error);
            res.status(500).send({ errors: [{ msg: "Server error" }] });
        }

        try{
            sub.save();
        }
        catch (error) {
            console.log("Error:", error);
            res.status(500).send({ errors: [{ msg: "Server error" }] });
        }
        res.send(sub);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.post("/rejectreq", auth, async (req, res, next) => {
    try {
        console.log(req.body);
        let sub = await SubGreddiit.findOne({ name: req.body.name });
        try{
            sub.join_requests = sub.join_requests.filter((item) => item !== req.body._id);
        }
        catch (error) {
            console.log("Error:", error);
            res.status(500).send({ errors: [{ msg: "Server error" }] });
        }

        try{
            sub.save();
        }
        catch (error) {
            console.log("Error:", error);
            res.status(500).send({ errors: [{ msg: "Server error" }] });
        }
        res.send(sub);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.post("/sendjoinreq", auth, async (req, res, next) => {
    try {
        console.log(req.body);
        const sub = await SubGreddiit.findOne({ name: req.body.name });
        console.log(sub);
        try{
            let join_requests = sub.join_requests;
            join_requests.push(req.user.id);
            console.log(join_requests);
            let filter = { name: req.body.name };
            let update = { join_requests: join_requests };
            const upd = await SubGreddiit.updateOne(filter, update);
            res.send(upd);
        }
        catch (error) {
            console.log("Error:", error);
            res.status(500).send({ errors: [{ msg: "Server error" }] });
        }
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.post("/leave", auth, async (req, res, next) => {
    try {
        console.log(req.body);
        const sub = await SubGreddiit.findOne({ name: req.body.name });
        console.log(sub);
        try{
            let followers = sub.followers;
            let left_users = sub.left_users;
            followers = followers.filter((item) => item !== req.user.id);
            left_users.push(req.user.id);
            console.log(followers);
            let filter = { name: req.body.name };
            let update = { followers: followers, left_users: left_users };
            const upd = await SubGreddiit.updateOne(filter, update);
            res.send(upd);
        }
        catch (error) {
            console.log("Error:", error);
            res.status(500).send({ errors: [{ msg: "Server error" }] });
        }
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.get("/getallcreationdates", auth, async (req, res, next) => {
    try {
        console.log(req.body);
        const subs = await SubGreddiit.find();
        let subcreationdates = [];
        for (let i=0; i<subs.length; i++)
        {
            let sub = subs[i];
            let subcreationdate = subs[i]._id.getTimestamp();
            subcreationdates[i] = {name: sub.name, creationdate: subcreationdate};
        }
        console.log(subcreationdates);
        res.send(subcreationdates);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.get("/getfollowedcreationdates", auth, async (req, res, next) => {
    try {
        console.log(req.body);
        const subs = await SubGreddiit.find({followers: req.user.id});
        let subcreationdates = [];
        for (let i=0; i<subs.length; i++)
        {
            let sub = subs[i];
            let subcreationdate = subs[i]._id.getTimestamp();
            subcreationdates[i] = {name: sub.name, creationdate: subcreationdate};
        }
        console.log(subcreationdates);
        res.send(subcreationdates);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.post("/getreports", auth, async (req, res, next) => {
    try {
        console.log(req.body);
        const sub = await SubGreddiit.find({name: req.body.name});
        console.log(sub);
        let subreports = [];
        for (let i=0; i<sub[0].reports.length; i++)
        {   
            let report = sub[0].reports[i];
            let reportdetails;

            reportdetails = await Report.findById(report);

            console.log(report);
            let reporteduser;
            let reporteruser;

            reporteduser = await User.findById(reportdetails.reported);
            reporteruser = await User.findById(reportdetails.reporter);

            console.log(reporteduser);
            console.log(reporteruser);
            subreports[i] = { 
                _id: reportdetails._id, 
                reportedid: reportdetails.reported,
                reported: reporteduser.username, 
                reporterid: reportdetails.reporter,
                reporter: reporteruser.username, 
                reason: reportdetails.reason, 
                text: reportdetails.reportedtext,
                isIgnored: reportdetails.isIgnored
            };
        }
        console.log(subreports);
        res.send(subreports);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});


export default router;