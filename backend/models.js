import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('safewheel', 'root', 'qoQZIFmQiERLEGuMjYMIjPcZpiaJMhUy', {
  host: 'caboose.proxy.rlwy.net',
  port: 51051,
  dialect: 'mysql'
});

// Guardian
const UserGuardian = sequelize.define('UserGuardian', {
  guardian_email: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  guardian_password: DataTypes.STRING,
  guardian_name: DataTypes.STRING
}, {
  tableName: 'user_guardian',
  timestamps: false
});

// Wheelchair User
const UserWheelchair = sequelize.define('UserWheelchair', {
  user_email: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  user_password: DataTypes.STRING,
  user_name: DataTypes.STRING,
  sex: DataTypes.ENUM('male', 'female', 'other'),
  dob: DataTypes.DATE,
  bloodtype: DataTypes.STRING,
  emergency_number: DataTypes.STRING,
  guardian_email: {
    type: DataTypes.STRING,
    references: {
      model: 'user_guardian',
      key: 'guardian_email'
    }
  },
  location_coordinates: DataTypes.STRING
}, {
  tableName: 'user_wheelchair',
  timestamps: false
});

// Health Timestamp
const UserHealthTimestamp = sequelize.define('UserHealthTimestamp', {
  user_email: {
    type: DataTypes.STRING,
    primaryKey: true,
    references: {
      model: 'user_wheelchair',
      key: 'user_email'
    }
  },
  user_timestamp: {
    type: DataTypes.DATE,
    primaryKey: true
  }
}, {
  tableName: 'user_health_timestamp',
  timestamps: false
});

// Health Item
const HealthItem = sequelize.define('HealthItem', {
  user_timestamp: {
    type: DataTypes.DATE,
    primaryKey: true
  },
  oxylevel: DataTypes.INTEGER,
  heartrate: DataTypes.INTEGER
}, {
  tableName: 'health_item',
  timestamps: false
});

// Alert Notification
const UserAlertNotification = sequelize.define('UserAlertNotification', {
  user_email: {
    type: DataTypes.STRING,
    primaryKey: true,
    references: {
      model: 'user_wheelchair',
      key: 'user_email'
    }
  },
  alert_timestamp: {
    type: DataTypes.DATE,
    primaryKey: true
  }
}, {
  tableName: 'user_alert_notification',
  timestamps: false
});

// Relations
UserGuardian.hasMany(UserWheelchair, { foreignKey: 'guardian_email' });
UserWheelchair.belongsTo(UserGuardian, { foreignKey: 'guardian_email' });

UserWheelchair.hasMany(UserHealthTimestamp, { foreignKey: 'user_email' });
UserHealthTimestamp.belongsTo(UserWheelchair, { foreignKey: 'user_email' });

UserHealthTimestamp.hasOne(HealthItem, { foreignKey: 'user_timestamp' });
HealthItem.belongsTo(UserHealthTimestamp, { foreignKey: 'user_timestamp' });

UserWheelchair.hasMany(UserAlertNotification, { foreignKey: 'user_email' });
UserAlertNotification.belongsTo(UserWheelchair, { foreignKey: 'user_email' });

// Export in ESM style
export {
  sequelize,
  UserGuardian,
  UserWheelchair,
  UserHealthTimestamp,
  HealthItem,
  UserAlertNotification
};