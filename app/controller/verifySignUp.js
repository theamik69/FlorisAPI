const { User } = require('../models');

module.exports = {
    checkDuplicateAdmin(req, res, next) {
    User.count()
    .then((count) => {
      if (count > 0) {
        res.status(400).send({
          status: 'fail',
          id: req.body.id,
          message: 'Id is already taken!',
        });
        return;
      }
      next();
    });
  },
};
