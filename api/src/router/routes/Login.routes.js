const { User } = require('../../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const privateKey = require('../../auth/private_key').private_key
const { ValidationError, UniqueConstraintError } = require('sequelize')


module.exports = (router) => {
  router.route('/login')
    .post(async (req, res) => {
      // #swagger.tags = ['Login']
      try {
        const user = await User.findOne({ where: { email: req.body.email } })

        if (user == null)
          return res.status(404).json({ message: `L'utilisateur demandé n'existe pas.` })

        bcrypt.compare(req.body.password, user.password).then(isPasswordValid => {
          if (!isPasswordValid)
            return res.status(401).json({ message: `Le mot de passe est incorrect.` })

          const token = jwt.sign({ email: user.email }, privateKey, { expiresIn: '24h' })
          return res.json({ message: `L'utilisateur a été connecté avec succès`, data: user, token })
        })
      } catch (err) {
        res.status(500).json({ message: `Une erreur est survenue. Veuillez réessayer plus tard.`, data: err })
      }
    })
}

