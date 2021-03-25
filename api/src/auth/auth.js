const jwt = require('jsonwebtoken')
const privateKey = require('../auth/private_key').private_key

module.exports = (req, res, next) => {
  const authorizationHeader = req.headers.authorization

  if (!authorizationHeader)
    return res.status(401).json({ message: `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.` })

  const token = authorizationHeader.split(' ')[1]
  const decodedToken = jwt.verify(token, privateKey, (error, decodedToken) => {
    if (error)
      return res.status(401).json({ message: `L'utilisateur n'est pas autorisé à accèder à cette ressource.`, data: error })

    next()
  })
}