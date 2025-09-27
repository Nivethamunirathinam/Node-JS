// POST /api/auth/login
// Backend File: routes/auth.js

router.post('/login', async (req, res) => {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });
    
    // Check if user exists or password is correct
    if (!user || !bcrypt.compareSync(req.body.password, user.passwordHash)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, name: user.name }, 
        process.env.JWT_SECRET, 
        { expiresIn: '2h' } // Token expires in 2 hours
    );

    // Send the token back to the client
    res.json({ 
        token, 
        userId: user._id,
        message: 'Login successful' 
    });
});

    