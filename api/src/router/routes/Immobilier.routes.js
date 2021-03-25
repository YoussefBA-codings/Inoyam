const { Immobilier } = require('../../models')
const auth = require('../../auth/auth')
const { ValidationError, UniqueConstraintError } = require('sequelize')

module.exports = (router) => {

  /** COLLECTIONS OPPERATION */
  router.route('/immobiliers')
    .get(async (req, res) => {
      // #swagger.tags = ['Immobiliers']
      try {
        const immobiliers = await Immobilier.findAll()
        // immobiliers.forEach(p => console.log(p.toJSON()));
        res.json({ message: 'La liste des \'immobiliers\' a bien été récupérée.', data: immobiliers })
      } catch (err) {
        res.status(500).json({ message: `Une erreur est survenue. Veuillez réessayer plus tard.`, data: err })
      }
    })
    .all(auth)
    .post(async (req, res) => {
      // #swagger.tags = ['Immobiliers']
      try {
        const immobilier = await Immobilier.create(req.body)
        res.status(201).json({ message: `Le \'immobiliers\' ${req.body.name} a bien été crée.`, data: immobilier })
      } catch (err) {
        if (err instanceof ValidationError || err instanceof UniqueConstraintError)
          return res.status(400).json({ message: err.message, data: err });
        res.status(500).json({ message: `Une erreur est survenue. Veuillez réessayer plus tard.`, data: err })
      }
    })



  /** ITEMS OPPERATION */
  router.route('/immobilier/:id')
    .get(async (req, res) => {
      // #swagger.tags = ['Immobiliers']
      try {
        const immobilier = await Immobilier.findByPk(req.params.id)
        if (immobilier == null)
          return res.status(404).json({ message: `Le \'immobilier\' demandé n'existe pas.` })

        res.json({ message: `Le \'immobilier\' "${immobilier.name}" a bien été récupérée.`, data: immobilier })
      } catch (err) {
        res.status(500).json({ message: `Une erreur est survenue. Veuillez réessayer plus tard.`, data: err })
      }

    })
    .all(auth)
    .put(async (req, res) => {
      // #swagger.tags = ['Immobiliers']
      try {
        const id = req.params.id
        const welcomToUpdate = await Immobilier.update(req.body, { where: { id: id } })
        if (welcomToUpdate == null)
          return res.status(404).json({ message: `Le \'immobilier\' demandé n'existe pas.` })

        const immobilier = await Immobilier.findByPk(id)
        res.json({ message: `Le \'immobilier\' "${immobilier.name}" a bien été modifié.`, data: immobilier })
      } catch (err) {
        if (err instanceof ValidationError || err instanceof UniqueConstraintError)
          return res.status(400).json({ message: err.message, data: err });
        res.status(500).json({ message: `Une erreur est survenue. Veuillez réessayer plus tard.`, data: err })
      }
    })

    .delete(async (req, res) => {
      // #swagger.tags = ['Immobiliers']
      try {
        const id = req.params.id
        const welcomToDelete = await Immobilier.findByPk(id)
        if (welcomToDelete == null)
          return res.status(404).json({ message: `Le \'immobilier\' demandé n'existe pas.` })

        const immobilier = await Immobilier.destroy({ where: { id: welcomToDelete.id } })
        res.json({ message: `Le \'immobilier\' demandé a bien été modifié.`, data: immobilier })
      } catch (err) {
        res.status(500).json({ message: `Une erreur est survenue. Veuillez réessayer plus tard.`, data: err })
      }
    })
}

