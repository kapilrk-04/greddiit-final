import express from 'express';
import Report from "../models/Report.js"
import SubGreddiit from "../models/SubGreddiits.js"
import Post from "../models/Posts.js"
import auth from "../middleware/auth.js"
import User from "../models/User.js"
import sendmail from 'sendmail'

const router = express.Router();

router.post("/", auth, async (req, res) => {
    try {
        const { reported, reason, reportedtext, reportedpost } = req.body;
        const newReport = await Report.create({
            reporter: req.user.id,
            reported: reported,
            reason: reason,
            reportedtext: reportedtext,
            reportedpost: reportedpost,
            createdAt: Date.now(),
            isIgnored: false,
        });
        let filter = { name : req.body.subgreddiit };
        let update = { $push: { reports: String(newReport._id) } };
        try {
            const sub = await SubGreddiit.updateOne(filter, update);
            if(!sub) 
             return res.status(400).json({ errors: [{ msg: "SubGreddiit not found" }] }); 
        } catch (err) {
            res.status(500).send({ errors: [{ msg: "Server Error" }]});
        }
        res.send(newReport);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/ignore", auth, async (req, res) => {
    try {
        let filter = { _id : req.body.reportid };
        let update = { isIgnored: true };
        const upd = await Report.updateOne(filter, update);
        res.send(upd);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/delete", auth, async (req, res) => {
    try {
        let delreport = await Report.findById(req.body.reportid);
        let delpost = await Post.findById(delreport.reportedpost);
        let delsub = await SubGreddiit.findOne({ name: delpost.sub });
        let delcomments = delpost.comments;

        let puser= await User.findById(delpost.user);
        let pusermail = puser.email;
        let mod = await User.findById(req.user.id);
        let modmail = mod.email;

        sendmail({
            from: modmail,
            to: pusermail,
            subject: 'Your post has been deleted from the subGreddiit '+ delsub.name,
            html: 'Dear '+ puser.firstname + ' ' + puser.lastname +', Your post has been deleted from the subGreddiit '+ delsub.name + 'for your post: ' + delpost.text + '',
        }, function(err, reply) {
            window.alert("Mail sent");
            console.log(err && err.stack);
            console.dir(reply);
        });
        

        for (let i = 0; i < delcomments.length; i++) {
            let delcomment = await Post.findByIdAndDelete(delcomments[i]);
            console.log(delcomment)
        }

        let newreports = [];
        newreports = delsub.reports.filter((item) => item != req.body.reportid);
        console.log("Newreports:" , newreports)
        let filter = { name : delpost.sub };
        let update = { reports: newreports };
        try {
            let upd = await SubGreddiit.updateOne(filter, update);
            if(!upd)
                return res.status(400).json({ errors: [{ msg: "SubGreddiit not found" }] });
        } catch (err) {
            res.status(500).send({ errors: [{ msg: "Server Error" }]});
        }

        console.log(delsub.reports);
        delpost = await Post.findByIdAndDelete(delreport.reportedpost);
        delreport = await Report.findByIdAndDelete(req.body.reportid);
        res.send(delreport);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/blockuser", auth, async (req, res) => {
    try {
        console.log(req.body);
        const { userid, reportid } = req.body;
        const breport = await Report.findById(reportid);
        console.log(breport);
        const bpost = await Post.findById(breport.reportedpost);
        console.log(bpost)

        const bsub = await SubGreddiit.findOne({ name: bpost.sub });
        console.log(bsub);

        const mod = await User.findById(req.user.id);
        let modmail = mod.email;
        let poster = await User.findById(bpost.user);
        let postermail = poster.email;

        sendmail({
            from: modmail,
            to: postermail,
            subject: 'You have been blocked from the subGreddiit '+ bsub.name,
            html: 'Dear '+ poster.firstname + ' ' + poster.lastname +', You have been blocked from the subGreddiit '+ bsub.name + 'for your post: ' + bpost.text + '',
        }, function(err, reply) {
            window.alert("Mail sent", reply);
            console.log(err && err.stack);
            console.dir(reply);
        });


        let newusers = bsub.followers.filter((item) => item != userid);
        console.log(newusers);
        bsub.blocked_users.push(userid);
        console.log(bsub.blocked_users);

        let filter = { name : bpost.sub };
        let update = { followers: newusers, blocked_users: bsub.blocked_users };

        try {
            const subUpdate = await SubGreddiit.updateOne(filter, update);
            if(!subUpdate)
                return res.status(400).json({ errors: [{ msg: "SubGreddiit not found" }] });
            console.log(subUpdate);
            res.send(subUpdate);
        } catch (err) {
            res.status(500).send({ errors: [{ msg: "Server Error" }]});
        }

    }
    catch (err) {
        res.status(500).json(err);
    }
});





export default router;