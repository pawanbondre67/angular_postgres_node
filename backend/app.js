const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');  
const cookieParser = require('cookie-parser');
const app = express();

const corsOptions = {
    origin: 'http://localhost:4200', 
    credentials: true, // Allow credentials (cookies)
    optionsSuccessStatus: 200 
  };

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const db = require('./db/db.js');
require('./routes/auth/auth.js');


app.get('/', (req, res) => {
    res.send('Hello World!');
}
);

app.use('/api/auth', require('./routes/auth/auth.js'));
app.use('/api/students', require('./routes/students/students.js'));

// const { swaggerUi, swaggerSpec } = require('./utils/Swagger.js');
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));



// app.use('/uploads', express.static('uploads'));

// //storage setup for multer
// const multer = require('multer');
// const path = require('path');
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, uniqueSuffix + path.extname(file.originalname)); // Appending extension
//     }
// });

// const upload = multer({ storage: storage });


// app.post('/upload', upload.single('file'), (req, res) => {
//     res.json({ filePath: req.file.path });
// });


module.exports = app;