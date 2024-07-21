const express = require('express');
const path = require('path');
const app = express();
const PORT = 8000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
const indexRoutes = require('./routes/index');
const audioRoutes = require('./routes/audioRoutes');
const videoRoutes = require('./routes/videoRoutes');
app.use('/', indexRoutes);
app.use('/', audioRoutes);
app.use('/', videoRoutes);

// Error Handling Middleware
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});



