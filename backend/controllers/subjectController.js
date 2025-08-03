const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new subject
const createSubject = async (req, res) => {
    try {
        const { name, code } = req.body; // Remove maxScore from here

        if (!name || !code) {
            return res.status(400).json({ error: 'Subject name and code are required' });
        }

        const subject = await prisma.subject.create({
            data: {
                name,
                code
                // Remove classId since we're not providing it
            }
        });

        res.status(201).json({
            message: 'Subject created successfully',
            subject
        });
    } catch (error) {
        console.error('Create subject error:', error);
        res.status(500).json({ error: 'Failed to create subject' });
    }
};


// Update subject
const updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code } = req.body;

        const subject = await prisma.subject.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(code && { code })
                // Remove the maxScore line completely
            }
        });

        res.json({
            message: 'Subject updated successfully',
            subject
        });
    } catch (error) {
        console.error('Update subject error:', error);
        res.status(500).json({ error: 'Failed to update subject' });
    }
};


// Delete subject
const deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.subject.delete({
            where: { id }
        });

        res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
        console.error('Delete subject error:', error);
        res.status(500).json({ error: 'Failed to delete subject' });
    }
};

module.exports = {
    createSubject,
    updateSubject,
    deleteSubject
};
