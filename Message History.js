// GET /api/messages/:roomId
// Backend File: routes/message.js

router.get('/:roomId', authenticate, async (req, res) => {
    try {
        const { roomId } = req.params;
        
        // Find all messages for the given room ID, sorted by timestamp
        const messages = await Message.find({ roomId: roomId })
            .sort({ timestamp: 1 }) // 1 for ascending (oldest first)
            .limit(50) // Limit to the last 50 messages for performance
            .populate('senderId', 'name'); // Replace senderId with the user's name

        if (!messages) {
            return res.status(404).json({ message: 'No messages found for this room' });
        }

        // Respond with the message history
        res.json({
            messages: messages,
            count: messages.length
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error fetching message history' });
    }
});