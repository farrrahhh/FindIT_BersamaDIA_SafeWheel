import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('safewheel', 'root', 'qoQZIFmQiERLEGuMjYMIjPcZpiaJMhUy', {
  host: 'caboose.proxy.rlwy.net',
  port: 51051,
  dialect: 'mysql',
});

// Wheelchair User
const UserWheelchair = sequelize.define('UserWheelchair', {
  safewheel_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  user_email: {
    type: DataTypes.STRING,
    unique: true,
  },
  user_password: DataTypes.STRING,
  user_name: DataTypes.STRING,
  sex: DataTypes.ENUM('male', 'female', 'other'),
  dob: DataTypes.DATE,
  bloodtype: DataTypes.STRING,
  emergency_number: DataTypes.STRING,
  location_coordinates: DataTypes.STRING,
}, {
  tableName: 'user_wheelchair',
  timestamps: false,
});

// Guardian
const UserGuardian = sequelize.define('UserGuardian', {
  guardian_email: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  guardian_password: DataTypes.STRING,
  guardian_name: DataTypes.STRING,
  safewheel_id: {
    type: DataTypes.STRING,
    references: {
      model: UserWheelchair,
      key: 'safewheel_id',
    },
  },
}, {
  tableName: 'user_guardian',
  timestamps: false,
});

// Health Item
const HealthItem = sequelize.define('HealthItem', {
  safewheel_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    references: {
      model: UserWheelchair,
      key: 'safewheel_id',
    },
  },
  user_timestamp: {
    type: DataTypes.DATE,
    primaryKey: true,
  },
  oxylevel: DataTypes.INTEGER,
  heartrate: DataTypes.INTEGER,
}, {
  tableName: 'health_item',
  timestamps: false,
});

// Alert Notification
const UserAlertNotification = sequelize.define('UserAlertNotification', {
  safewheel_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    references: {
      model: UserWheelchair,
      key: 'safewheel_id',
    },
  },
  alert_timestamp: {
    type: DataTypes.DATE,
    primaryKey: true,
  },
}, {
  tableName: 'user_alert_notification',
  timestamps: false,
});

// Relations
UserWheelchair.hasMany(UserGuardian, { foreignKey: 'safewheel_id' });
UserGuardian.belongsTo(UserWheelchair, { foreignKey: 'safewheel_id' });

UserWheelchair.hasMany(HealthItem, { foreignKey: 'safewheel_id' });
HealthItem.belongsTo(UserWheelchair, { foreignKey: 'safewheel_id' });

UserWheelchair.hasMany(UserAlertNotification, { foreignKey: 'safewheel_id' });
UserAlertNotification.belongsTo(UserWheelchair, { foreignKey: 'safewheel_id' });

// Export
export {
  sequelize,
  UserGuardian,
  UserWheelchair,
  HealthItem,
  UserAlertNotification,
};