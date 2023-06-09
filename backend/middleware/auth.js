import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
    try {
        //x-auth-token : <token>
        const token = req.header("x-auth-token");
        console.log("Token:", token);
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded.user;
            next();
        } catch (error) {
            console.log("Error:", error);
            res.status(401).send({ errors: [{ msg: "Unauthorized, invalid token" }] });
        }

    } catch (error) {
        console.log("Error:", error);
        res.status(500).send({ errors: [{ msg: "Server error" }] });
    }
}