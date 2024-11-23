const { User } = require('../models/User');

const includeRelations = async (req, res, next) => {
  try {
    if (!req.user) return next();

    if (req.user.role === 'parent') {
      const userWithRelations = await User.findByPk(req.user.id, {
        include: [{
          model: User,
          as: 'children',
          attributes: ['id', 'name', 'email', 'studentCode']
        }]
      });
      req.user.children = userWithRelations.children;
    } else if (req.user.role === 'educator') {
      const userWithRelations = await User.findByPk(req.user.id, {
        include: [{
          model: User,
          as: 'students',
          attributes: ['id', 'name', 'email', 'studentCode']
        }]
      });
      req.user.students = userWithRelations.students;
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = includeRelations; 