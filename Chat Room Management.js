// POST /api/rooms
// Backend File: routes/room.js

const { authenticate } = require('../middleware/auth'); // Assuming a JWT middleware

router.post('/', authenticate, async (req, res) => {
    try {
        const { name } = req.body;
        const createdBy = req.user.id; // ID extracted from JWT token by 'authenticate' middleware

        if (!name) {
            return res.status(400).json({ message: 'Room name is required' });
        }

        // Check if room name already exists
        const existingRoom = await Room.findOne({ name: name });
        if (existingRoom) {
            return res.status(409).json({ message: 'Room already exists' });
        }

        // Create and save the new room
        const newRoom = new Room({
            name,
            createdBy,
            members: [createdBy] // Creator is the first member
        });

        await newRoom.save();

        res.status(201).json({ 
            message: 'Room created successfully', 
            room: newRoom 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error creating room' });
    }
});