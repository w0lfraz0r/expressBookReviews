const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Extract the token from the request headers
    const token = req.headers['authorization'];

    // If there's no token, return a 401 Unauthorized response
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, "YFJFJDF887347EJFEF");
        
        // Attach the decoded user information to the request object
        req.user = decoded;
        
        // Continue to the next middleware/route handler
        next();
    } catch (error) {
        // If token verification fails, return a 400 Bad Request response
        return res.status(400).json({ message: "Invalid token." });
    }
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running on port", PORT));
