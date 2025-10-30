const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Contract = sequelize.define('Contract', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Projects',
      key: 'id'
    }
  },
  freelancerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  proposalId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Proposals',
      key: 'id'
    }
  },
  agreedAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  agreedTime: {
    type: DataTypes.INTEGER, // dalam hari
    allowNull: false
  },
  milestones: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM(
      'active',
      'completed',
      'cancelled',
      'disputed'
    ),
    defaultValue: 'active'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE
  },
  paymentStatus: {
    type: DataTypes.ENUM(
      'pending',
      'partially-paid',
      'fully-paid',
      'refunded'
    ),
    defaultValue: 'pending'
  }
});

module.exports = Contract;