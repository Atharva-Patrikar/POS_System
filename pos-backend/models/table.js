module.exports = (sequelize, DataTypes) => {
  const Table = sequelize.define('Table', {
    table_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'table', // 👈 force exact table name
    timestamps: false    // 👈 optional: if you didn’t define createdAt/updatedAt
  });

  return Table;
};
