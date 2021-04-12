const { appUser } = require('../../models');
const bcrypt = require('bcrypt');

module.exports = (router) => {
	router.route('/app/login')
		.post(async (req, res) => {
			// #swagger.tags = ['Login']
			try {
				const user = await appUser.findOne({ where: { email: req.body.email } });

				if (user == null)
					return res.status(404).json({ message: 'L\'utilisateur demandé n\'existe pas.' });

				bcrypt.compare(req.body.password, user.password).then(isPasswordValid => {
					if (!isPasswordValid)
						return res.status(401).json({ message: 'Le mot de passe est incorrect.' });

					res.status(200).json({ message: 'success' });
				});
			} catch (err) {
				res.status(500).json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.', data: err });
			}
		});

	router.route('/app/signup')
		.post(async (req, res) => {
			// #swagger.tags = ['Login']
			try {
				const user = await appUser.create(req.body);
				res.status(200).json({ message: `Le user "${user.firstname}" a bien été crée.` });
			} catch (err) {
				res.status(500).json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.', data: err });
			}
		});
};
