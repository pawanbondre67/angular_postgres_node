const db = require('../db/db');

// Get all students
exports.getStudents = async (req, res) => {
    try {
        const query = 'SELECT * FROM students';
        const result = await db.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ message: 'Server error while fetching students' });
    }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM students WHERE id = $1';
        const result = await db.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching student:', err);
        res.status(500).json({ message: 'Server error while fetching student' });
    }
};

// Create new student
exports.createStudent = async (req, res) => {
    try {
        const { firstname, lastname, email, age, profile_pic } = req.body;

        if (!firstname || !lastname || !email || !age) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const query = `
            INSERT INTO students (firstname, lastname, email, age, profile_pic)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const result = await db.query(query, [firstname, lastname, email, age, profile_pic || null]);

        res.status(201).json({
            message: 'Student created successfully',
            student: result.rows[0]
        });
    } catch (err) {
        console.error('Error creating student:', err);

        if (err.code === '23505') { // PostgreSQL unique_violation
            return res.status(400).json({ message: 'Email already exists' });
        }

        res.status(500).json({ message: 'Server error while creating student' });
    }
};

// Update student
exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstname, lastname, email, age, profile_pic } = req.body;

        const checkQuery = 'SELECT * FROM students WHERE id = $1';
        const checkResult = await db.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const updateQuery = `
            UPDATE students 
            SET firstname = $1, lastname = $2, email = $3, age = $4, profile_pic = $5 
            WHERE id = $6 
            RETURNING *;
        `;
        const updateResult = await db.query(updateQuery, [firstname, lastname, email, age, profile_pic || null, id]);

        res.status(200).json({
            message: 'Student updated successfully',
            student: updateResult.rows[0]
        });
    } catch (err) {
        console.error('Error updating student:', err);

        if (err.code === '23505') {
            return res.status(400).json({ message: 'Email already exists' });
        }

        res.status(500).json({ message: 'Server error while updating student' });
    }
};

// Delete student
exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const checkQuery = 'SELECT * FROM students WHERE id = $1';
        const checkResult = await db.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const deleteQuery = 'DELETE FROM students WHERE id = $1';
        await db.query(deleteQuery, [id]);  

        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(500).json({ message: 'Server error while deleting student' });
    }
};
