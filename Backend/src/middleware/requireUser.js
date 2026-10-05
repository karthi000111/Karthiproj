const {createHash} = require('node:crypto');

const hashToken = token => createHash('sha256').update(token).digest('hex');

function createRequireUser({SessionModel, UserModel}) {
  return async (req, res, next) => {
    const authorization = req.get('authorization') || '';
    const match = authorization.match(/^Bearer\s+(.+)$/i);

    if (!match) {
      return res.status(401).json({message: 'Sign in to continue.'});
    }

    try {
      const tokenHash = hashToken(match[1]);
      const session = await SessionModel.findOne({tokenHash, expiresAt: {$gt: new Date()}});
      if (!session) {
        return res.status(401).json({message: 'Your session has expired. Please sign in again.'});
      }

      const user = await UserModel.findById(session.userId);
      if (!user) {
        return res.status(401).json({message: 'Your session is no longer valid. Please sign in again.'});
      }

      req.user = user;
      req.sessionTokenHash = tokenHash;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = {createRequireUser, hashToken};