const { userInfo } = require('../../models');
const auth = require('../../auth/auth');
const { ValidationError, UniqueConstraintError } = require('sequelize');

module.exports = (router) => {
	router.route('/infos')
		// .all(auth)
		.get(async (req, res) => {
			// #swagger.tags = ['users']
			try {
				const infos = await userInfo.findAll();
				// users.forEach(p => console.log(p.toJSON()));
				res.json({ message: 'La liste des \'informations utilisateurs\' a bien été récupérée.', data: infos });
			} catch (err) {
				res.status(500).json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.', data: err });
			}
		})
		.post(async (req, res) => {
			// #swagger.tags = ['users']
			try {
				if (!req.body?.UserId) return res.status(404).json({ message: 'UserId doit être renseigné' });
				const info = await userInfo.create(req.body);
				res.status(201).json({ message: `Les informations de l'utilisateur ${req.body.UserId} ont bien été créees.`, data: info });
			} catch (err) {
				if (err instanceof ValidationError || err instanceof UniqueConstraintError)
					return res.status(400).json({ message: err.message, data: err });
				res.status(500).json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.', data: err });
			}
		});

	/** ITEMS OPPERATION */
	router.route('/infos/user/:id')
		// .all(auth)
		.get(async (req, res) => {
			// #swagger.tags = ['users']
			try {
				console.log(req.params);
				const infos = await userInfo.findAll({
					where: {
						userId: req.params.id
					}
				});
				if (infos == null)
					return res.status(404).json({ message: `aucune information supplémentaire sur le user ${req.params.id}` });

				res.json({ message: `Les informations de l'utilisateur ${req.params.id} ont bien été récupérées.`, data: infos });
			} catch (err) {
				res.status(500).json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.', data: err });
			}
		});
};
