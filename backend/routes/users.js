import express from 'express';
import env from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

env.config();
const router = express.Router();

router.get("/", auth, async (req, res, next) => {
    try {
        const id = req.user.id;
        const users = await User.findById(id);
        //".select" to only fetch specific fields
        res.send(users);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

/**
 * @route /api/users/:id
 * @desc edit name of current user
 * @access private
 */


router.patch("/", auth, async (req, res, next) => {
    try {
        console.log(req.user);
        const id = req.user.id;
        const filter = { _id: id };
        const update = req.body;
        const updater = await User.updateOne(filter, update);
        res.send(updater);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

router.post("/", 
    body('email').isEmail(),
    body('age').isNumeric(),
    body('phone').isNumeric(),
    async (req, res, next) => {
    try {
        console.log(req.body);

        //check if name and nickname are valid
        //else send {bad request error}
        //express validator
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).send({errors: errors.array()});
        }
        //if exists
        const {firstname, lastname, username, email, age, phone, password} = req.body;
        
        let user = await User.findOne({username});
        if(user)
            return res.status(400).send({errors: [{msg: "User already exists"}]});

        //doesn't exist
        let saved_posts = [];
        user = new User({ firstname, lastname, username, email, age, phone, password, saved_posts });
        console.log(user.password)
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();
        return res.send(user);
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).send({ errors: [{ msg: "Server error" }] });
    }

});

router.post("/oneuser", auth, async (req, res, next) => {
    try {
        const id = req.body.userid;
        let user = await User.findById(id);
        res.send(user);
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

export default router;
