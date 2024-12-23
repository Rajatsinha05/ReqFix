const UserAccount = require("./UserAccount");
const Service = require("./Service");
const Order = require("./Order");
const Feedback = require("./Feedback");
const UserAddress = require("./UserAddress");
const StatusHistory = require("./StatusHistory");

// UserAccount and Service (One-to-Many)
UserAccount.hasMany(Service, { foreignKey: "user_id", as: "Services" });
Service.belongsTo(UserAccount, { foreignKey: "user_id", as: "Provider" });

// UserAccount and Order (One-to-Many)
UserAccount.hasMany(Order, { as: "CustomerOrders", foreignKey: "customer_id" });
UserAccount.hasMany(Order, { as: "ProviderOrders", foreignKey: "service_provider_id" });
Order.belongsTo(UserAccount, { as: "Customer", foreignKey: "customer_id" });
Order.belongsTo(UserAccount, { as: "ServiceProvider", foreignKey: "service_provider_id" });

// Order and Feedback (One-to-One)
Order.hasOne(Feedback, { foreignKey: "order_id" });
Feedback.belongsTo(Order, { foreignKey: "order_id" });

// UserAccount and Feedback (One-to-Many)
UserAccount.hasMany(Feedback, { as: "CustomerFeedback", foreignKey: "customer_id" });
UserAccount.hasMany(Feedback, { as: "ProviderFeedback", foreignKey: "service_provider_id" });
Feedback.belongsTo(UserAccount, { as: "Customer", foreignKey: "customer_id" });
Feedback.belongsTo(UserAccount, { as: "ServiceProvider", foreignKey: "service_provider_id" });

// UserAccount and UserAddress (One-to-Many)
UserAccount.hasMany(UserAddress, { foreignKey: "user_id", as: "Addresses" });
UserAddress.belongsTo(UserAccount, { foreignKey: "user_id" });

// Order and StatusHistory (One-to-Many)
Order.hasMany(StatusHistory, { foreignKey: "order_id", as: "StatusHistories" });
StatusHistory.belongsTo(Order, { foreignKey: "order_id" });

// StatusHistory and UserAccount (One-to-Many)
UserAccount.hasMany(StatusHistory, { foreignKey: "changed_by", as: "StatusChanges" });
StatusHistory.belongsTo(UserAccount, { foreignKey: "changed_by", as: "ChangedBy" });

// Order and Service (Many-to-One)
Order.belongsTo(Service, { foreignKey: "service_id", as: "Service" });
Service.hasMany(Order, { foreignKey: "service_id", as: "Orders" });

module.exports = {
  UserAccount,
  Service,
  Order,
  Feedback,
  UserAddress,
  StatusHistory,
};
