const { User } = require('../../models')
const auth = require('../../auth/auth')
const { ValidationError, UniqueConstraintError } = require('sequelize')


module.exports = (router) => {
  router.route('/users')
    .get(async (req, res) => {
      // #swagger.tags = ['users']
      try {
        const users = await User.findAll()
        // users.forEach(p => console.log(p.toJSON()));
        res.json({ message: 'La liste des \'users\' a bien été récupérée.', data: users })
      } catch (err) {
        res.status(500).json({ message: `Une erreur est survenue. Veuillez réessayer plus tard.`, data: err })
      }
    })
    .all(auth)
    .post(async (req, res) => {
      // #swagger.tags = ['users']
      try {
        const user = await User.create(req.body)
        res.status(201).json({ message: `Le \'users\' ${req.body.firstname} a bien été crée.`, data: user })
      } catch (err) {
        if (err instanceof ValidationError || err instanceof UniqueConstraintError)
          return res.status(400).json({ message: err.message, data: err });
        res.status(500).json({ message: `Une erreur est survenue. Veuillez réessayer plus tard.`, data: err })
      }
    })



  /** ITEMS OPPERATION */
  router.route('/user/:id')
    .get(async (req, res) => {
      // #swagger.tags = ['users']
      try {
        const user = await User.findByPk(req.params.id)
        if (user == null)
          return res.status(404).json({ message: `Le \'user\' demandé n'existe pas.` })

        res.json({ message: `Le \'user\' "${user.firstname}" a bien été récupérée.`, data: user })
      } catch (err) {
        res.status(500).json({ message: `Une erreur est survenue. Veuillez réessayer plus tard.`, data: err })
      }

    })
    .all(auth)
    .put(async (req, res) => {
      // #swagger.tags = ['users']
      try {
        const id = req.params.id
        const welcomToUpdate = await User.update(req.body, { where: { id: id } })
        if (welcomToUpdate == null)
          return res.status(404).json({ message: `Le \'user\' demandé n'existe pas.` })

        const user = await User.findByPk(id)
        res.json({ message: `Le \'user\' "${user.firstname}" a bien été modifié.`, data: user })
      } catch (err) {
        if (err instanceof ValidationError || err instanceof UniqueConstraintError)
          return res.status(400).json({ message: err.message, data: err });
        res.status(500).json({ message: `Une erreur est survenue. Veuillez réessayer plus tard.`, data: err })
      }
    })

    .delete(async (req, res) => {
      // #swagger.tags = ['users']
      try {
        const id = req.params.id
        const welcomToDelete = await User.findByPk(id)
        if (welcomToDelete == null)
          return res.status(404).json({ message: `Le \'user\' demandé n'existe pas.` })

        const user = await User.destroy({ where: { id: welcomToDelete.id } })
        res.json({ message: `Le \'user\' demandé a bien été modifié.`, data: user })
      } catch (err) {
        res.status(500).json({ message: `Une erreur est survenue. Veuillez réessayer plus tard.`, data: err })
      }
    })
}

