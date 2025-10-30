const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
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
      len: [5, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    validate: {
      len: [0, 2000]
    }
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  hourlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0
    }
  },
  experience: {
    type: DataTypes.ENUM('entry', 'intermediate', 'expert'),
    defaultValue: 'entry'
  },
  education: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  workHistory: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  portfolio: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  totalRatings: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  completedProjects: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Profile;