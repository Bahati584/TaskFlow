const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./userModel');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const signToken = (user) =>
    jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const authController = {
    // POST /api/auth/register
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    error: "Name, email, and password are required"
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    error: "Password must be at least 6 characters"
                });
            }

            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    error: "An account with this email already exists"
                });
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const user = await User.create({ name, email, passwordHash });
            const token = signToken(user);

            res.status(201).json({
                success: true,
                message: "Account created successfully",
                token,
                user
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // POST /api/auth/login
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    error: "Email and password are required"
                });
            }

            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ success: false, message: "Invalid email or password" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Invalid email or password" });
            }

            const token = signToken(user);

            res.json({
                success: true,
                message: "Login successful",
                token,
                user: { id: user.id, name: user.name, email: user.email }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // GET /api/auth/me (protected)
    async getMe(req, res) {
        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({ success: false, error: "User not found" });
            }

            res.json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

module.exports = authController;