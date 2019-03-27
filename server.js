const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '142437069zz2',
    database : 'smart-brain'
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

/*
CREATE TABLE users(
	id serial PRIMARY KEY,
	name VARCHAR(100),
	email text UNIQUE NOT NULL,
	entries BIGINT default 0,
	joined TIMESTAMP NOT NULL
);

CREATE TABLE login(
	id serial PRIMARY KEY,
	hash varchar(100) NOT NULL,
	email text UNIQUE NOT NULL
);
*/

app.get('/', (req, res) => {
	res.send('working');
})

app.post('/signin', signin.handleSignin(db, bcrypt) )

app.get('/profile/:id', profile.handleProfileGet(db))

app.post('/register', register.handleRegister(db, bcrypt) )

app.put('/image', image.handleImage(db))

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3000, ()=>{
	console.log(`app is running on port 3000 ${process.env.PORT}`)
})