const handleRegister = (db, bcrypt) => (req, res) => {
	const { email, name, password } = req.body;
	
	//validation
	if (!name || !email || !password) {
		return res.status(400).json('incorect form submission')
	}

	const hash = bcrypt.hashSync(password)
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
				.returning('*')
				.insert({
					email: loginEmail[0],
					name: name,
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);
				})
		})
		.then(trx.commit)
	})
	.catch(err => res.status(400).json('something went wrong'))
}

module.exports = {
	handleRegister: handleRegister
};