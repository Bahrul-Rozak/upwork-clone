const { sequelize } = require('../config/database');
const User = require('./User');
const Profile = require('./Profile');
const Project = require('./Project');
const Proposal = require('./Proposal');
const Contract = require('./Contract');
const Payment = require('./Payment');
const Review = require('./Review');

// User Relationships :v
User.hasOne(Profile, { foreignKey: 'userId', as: 'profile' });
Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Project Relationships : 
User.hasMany(Project, { foreignKey: 'clientId', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

// Proposal Relationships
Project.hasMany(Proposal, { foreignKey: 'projectId', as: 'proposals' });
Proposal.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

User.hasMany(Proposal, { foreignKey: 'freelancerId', as: 'proposals' });
Proposal.belongsTo(User, { foreignKey: 'freelancerId', as: 'freelancer' });

// Contract Relationships
Project.hasOne(Contract, { foreignKey: 'projectId', as: 'contract' });
Contract.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

User.hasMany(Contract, { foreignKey: 'freelancerId', as: 'freelancerContracts' });
Contract.belongsTo(User, { foreignKey: 'freelancerId', as: 'freelancer' });

User.hasMany(Contract, { foreignKey: 'clientId', as: 'clientContracts' });
Contract.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

Contract.belongsTo(Proposal, { foreignKey: 'proposalId', as: 'proposal' });

// Payment Relationships
Contract.hasMany(Payment, { foreignKey: 'contractId', as: 'payments' });
Payment.belongsTo(Contract, { foreignKey: 'contractId', as: 'contract' });

User.hasMany(Payment, { foreignKey: 'clientId', as: 'clientPayments' });
Payment.belongsTo(User, { foreignKey: 'clientId', as: 'client' });

User.hasMany(Payment, { foreignKey: 'freelancerId', as: 'freelancerPayments' });
Payment.belongsTo(User, { foreignKey: 'freelancerId', as: 'freelancer' });

// Review Relationships
Contract.hasMany(Review, { foreignKey: 'contractId', as: 'reviews' });
Review.belongsTo(Contract, { foreignKey: 'contractId', as: 'contract' });

User.hasMany(Review, { foreignKey: 'reviewerId', as: 'givenReviews' });
Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });

User.hasMany(Review, { foreignKey: 'revieweeId', as: 'receivedReviews' });
Review.belongsTo(User, { foreignKey: 'revieweeId', as: 'reviewee' });

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); 
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Database sync failed:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Profile,
  Project,
  Proposal,
  Contract,
  Payment,
  Review,
  syncDatabase
};