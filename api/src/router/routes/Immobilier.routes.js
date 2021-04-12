const { Immobilier } = require('../../models');
const auth = require('../../auth/auth');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const { ValidationError, UniqueConstraintError } = require('sequelize');
const Tools = require('../tools.js');

module.exports = (router) => {
	/** COLLECTIONS OPPERATION */
	router.route('/immobiliers')
		.get(async (req, res) => {
			// #swagger.tags = ['Immobiliers']
			try {
				const params = req.query;
				const where  = {};

				/*
					Object.keys(params).forEach(key => {
					const value = params[key];
					let price, surface;
					switch (key) {
						case 'id_site_source': where.id_site_source = value; break;
						case 'bedrooms': where.bedrooms = { [Op.eq]: value }; break;
						case 'code_postal': where.code_postal = { [Op.eq]: value }; break;
						case 'price':
							price = {
								min: value.min ? Number(value.min) : null,
								max: value.max ? Number(value.max) : null
							};
							if (price.min < price.max) {
								if (price.min && !price.max) where.price = { [Op.gt]: price.min };
								else if (!price.min && price.max) where.price = { [Op.lt]: price.max };
								else where.price = { [Op.between]: [price.min, price.max] };
							} else if (price.min > price.max) {
								return res.status(400).json({ message: 'Le prix minimun ne peut pas être suppérieur au prix maximum.' });
							}
							break;
					}
				});
				*/
				if (params.surface) {
					const surface = {
						min: params.surface.min ? Number(params.surface.min) : 0,
						max: params.surface.max ? Number(params.surface.max) : 1000000000
					};
					if (surface.min < surface.max) {
						if (surface.min && !surface.max) where.surface = { [Op.gt]: surface.min };
						else if (!surface.min && surface.max) where.surface = { [Op.lt]: surface.max };
						else where.surface = { [Op.between]: [surface.min, surface.max] };
					} else if (surface.min > surface.max) {
						return res.status(400).json({ message: 'La surface minimun ne peut pas être suppérieur à la surface maximum.' });
					}
				}

				const options = {
					where,
					...Tools.pagination(params)
				};

				const immobiliers = await Immobilier.findAll(options);
				// immobiliers.forEach(p => console.log(p.toJSON()));
				res.json({ message: 'La liste des \'immobiliers\' a bien été récupérée.', data: immobiliers });
			} catch (err) {
				console.log(err);
				res.status(500).json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.', data: err });
			}
		})
		.all(auth)
		.post(async (req, res) => {
			// #swagger.tags = ['Immobiliers']
			try {
				const immobilier = await Immobilier.create(req.body);
				res.status(201).json({ message: `Le \'immobiliers\' ${req.body.name} a bien été crée.`, data: immobilier });
			} catch (err) {
				if (err instanceof ValidationError || err instanceof UniqueConstraintError)
					return res.status(400).json({ message: err.message, data: err });
				res.status(500).json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.', data: err });
			}
		});

	/** ITEMS OPPERATION */
	router.route('/immobilier/:id')
		.get(async (req, res) => {
			// #swagger.tags = ['Immobiliers']
			try {
				const immobilier = await Immobilier.findByPk(req.params.id);
				if (immobilier == null)
					return res.status(404).json({ message: 'Le \'immobilier\' demandé n\'existe pas.' });

				res.json({ message: `Le \'immobilier\' "${immobilier.name}" a bien été récupérée.`, data: immobilier });
			} catch (err) {
				res.status(500).json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.', data: err });
			}
		})
		.all(auth)
		.put(async (req, res) => {
			// #swagger.tags = ['Immobiliers']
			try {
				const id = req.params.id;
				const welcomToUpdate = await Immobilier.update(req.body, { where: { id: id } });
				if (welcomToUpdate == null)
					return res.status(404).json({ message: 'Le \'immobilier\' demandé n\'existe pas.' });

				const immobilier = await Immobilier.findByPk(id);
				res.json({ message: `Le \'immobilier\' "${immobilier.name}" a bien été modifié.`, data: immobilier });
			} catch (err) {
				if (err instanceof ValidationError || err instanceof UniqueConstraintError)
					return res.status(400).json({ message: err.message, data: err });
				res.status(500).json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.', data: err });
			}
		})

		.delete(async (req, res) => {
			// #swagger.tags = ['Immobiliers']
			try {
				const id = req.params.id;
				const welcomToDelete = await Immobilier.findByPk(id);
				if (welcomToDelete == null)
					return res.status(404).json({ message: 'Le \'immobilier\' demandé n\'existe pas.' });

				const immobilier = await Immobilier.destroy({ where: { id: welcomToDelete.id } });
				res.json({ message: 'Le \'immobilier\' demandé a bien été modifié.', data: immobilier });
			} catch (err) {
				res.status(500).json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.', data: err });
			}
		});
};
