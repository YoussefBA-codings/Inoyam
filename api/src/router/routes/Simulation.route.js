const { userSimulation } = require('../../models');
const auth = require('../../auth/auth');
const { ValidationError, UniqueConstraintError } = require('sequelize');

module.exports = (router) => {
	router.route('/simulations')
		.all(auth)
		.get(async (req, res) => {
			try {
				const simulations = await userSimulation.findAll();
				res.json({ message: 'La liste des simulations a bien été récupérée.', data: simulations });
			} catch (err) {
				res.status(500).json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.', data: err });
			}
		})
		.post(async (req, res) => {
			try {
				if (!req.body?.UserId) return res.status(404).json({ message: 'UserId doit être renseigné' });
				req.body.result = 200000;
				const simulation = await userSimulation.create(req.body);
				res.status(201).json({ message: `Les simulations de l'utilisateur ${req.body.UserId} ont bien été créees.`, data: simulation });
			} catch (err) {
				if (err instanceof ValidationError || err instanceof UniqueConstraintError)
					return res.status(400).json({ message: err.message, data: err });
				res.status(500).json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.', data: err });
			}
		});

	/** ITEMS OPPERATION */
	router.route('/simulation/:id')
		.get(async (req, res) => {
			try {
				const simulation = await userSimulation.findByPk(req.params.id);
				if (simulation == null)
					return res.status(404).json({ message: 'La simulation demandée n\'existe pas.' });

				res.json({ message: `La simulation "${simulation.id}" a bien été récupérée.`, data: simulation });
			} catch (err) {
				res.status(500).json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.', data: err });
			}
		})
		.all(auth)
		.put(async (req, res) => {
			try {
				const id = req.params.id;
				const welcomToUpdate = await userSimulation.update(req.body, { where: { id: id } });
				if (welcomToUpdate == null)
					return res.status(404).json({ message: 'La simulation demandée n\'existe pas.' });

				const simulation = await userSimulation.findByPk(id);
				res.json({ message: `La simulation "${simulation.id}" a bien été modifié.`, data: simulation });
			} catch (err) {
				if (err instanceof ValidationError || err instanceof UniqueConstraintError)
					return res.status(400).json({ message: err.message, data: err });
				res.status(500).json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.', data: err });
			}
		})

		.delete(async (req, res) => {
			try {
				const id = req.params.id;
				const welcomToDelete = await userSimulation.findByPk(id);
				if (welcomToDelete == null)
					return res.status(404).json({ message: 'La simulation demandée n\'existe pas.' });

				const simulation = await userSimulation.destroy({ where: { id: welcomToDelete.id } });
				res.json({ message: 'La simulation demandé a bien été modifié.', data: simulation });
			} catch (err) {
				res.status(500).json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.', data: err });
			}
		});

	router.route('/simulations/user/:id')
		.all(auth)
		.get(async (req, res) => {
			try {
				console.log(req.params);
				const simulations = await userSimulation.findAll({
					where: {
						userId: req.params.id
					}
				});
				if (simulations == null)
					return res.status(404).json({ message: `aucune simulation supplémentaire sur le user ${req.params.id}` });

				res.json({ message: `Les simulations de l'utilisateur ${req.params.id} ont bien été récupérées.`, data: simulations });
			} catch (err) {
				res.status(500).json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.', data: err });
			}
		});
};
