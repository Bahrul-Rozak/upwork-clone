const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [5, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [50, 5000]
    }
  },
  category: {
    type: DataTypes.ENUM(
      'web-development',
      'mobile-development',
      'design',
      'writing',
      'marketing',
      'admin-support',
      'customer-service',
      'sales',
      'other'
    ),
    allowNull: false
  },
  skillsRequired: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  budgetType: {
    type: DataTypes.ENUM('fixed', 'hourly'),
    allowNull: false,
    defaultValue: 'fixed'
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  duration: {
    type: DataTypes.INTEGER, // dalam hari
    validate: {
      min: 1
    }
  },
  status: {
    type: DataTypes.ENUM(
      'draft',
      'posted',
      'in-progress',
      'completed',
      'cancelled',
      'disputed'
    ),
    defaultValue: 'draft'
  },
  attachments: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  visibility: {
    type: DataTypes.ENUM('public', 'private'),
    defaultValue: 'public'
  },
  deadline: {
    type: DataTypes.DATE
  }
});

module.exports = Project;