import user from "../models/user.js";

export async function getAllUsers(req, res) {
    try {
        const users = await user.find().sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (e) {
        console.error("Error in getAllUsers controller", e);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getUserById(req, res) {
    try {
        const user = await user.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (e) {
        console.error("Error in getUserById controller", e);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function createUser(req, res) {
    try {
        const { name, email, age, phone, password, confirmPassword } = req.body;

        if (!name || !email || !age || !phone || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (age < 18 || age > 60) {
            return res.status(400).json({ message: "Age must be between 18 and 60" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number" });
        }


        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Weak password" });
        }

        const newUser = new user({
            name,
            email,
            age,
            phone,
            password
        });

        const savedUser = await newUser.save();
        res.status(201).json({ savedUser });

    } catch (e) {
        console.error("Error in createUser controller", e);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteUser(req, res) {
    try {
        const deletedUser = await user.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(201).json({ deletedUser });
    } catch (error) {
        console.error("Error in deleteUser controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
