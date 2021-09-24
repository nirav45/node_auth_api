const express = require('express');
const app = express();
const db = require("./conn.js");
const port = 5000;
const cors = require('cors');
const userController = require('./controllers/userController.js');
const { verifySignUp } = require('./middleware/verifySignup');
const { authJwt } = require('./middleware/authJwt');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/api/register', [verifySignUp.checkDuplicateEmail], userController.register);
app.post('/api/login', userController.login);
app.get('/api/get-dashboard-data', [authJwt.verifyToken], userController.getDashboardData);

db.sequelize.sync();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});