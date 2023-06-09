import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post("/", async (req, res, next) => {

    //login
    /*
    check if pwd is correct
    if yes then generate token
    */
    try {
        
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send({ errors: [{ msg: "Invalid credentials" }] });
        }

        const isMatch = await user.checkPassword(password);
        if (!isMatch) {
            return res.status(400).send({ errors: [{ msg: "Invalid credentials" }] });
        }
        else
        {
            const token = user.generateToken();
            return res.send({token});
        }
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
});

export default router;