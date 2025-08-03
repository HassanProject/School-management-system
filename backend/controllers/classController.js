const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Create a new class
const createClass = async (req, res) => {
  try {
    const { name, year, teacherId } = req.body;

    if (!name || !year) {
      return res.status(400).json({ error: 'Name and year are required' });
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        year,
        teacherId
      }
    });

    res.status(201).json({
      message: 'Class created successfully',
      class: newClass
    });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ error: 'Failed to create class' });
  }
};

// Get all classes
const getAllClasses = async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        teacher: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            students: true
          }
        }
      }
    });

    res.json({ classes });
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ error: 'Failed to get classes' });
  }
};

module.exports = {
  createClass,
  getAllClasses
};
