module.exports = (sequelize, Sequelize) => {
    const sessionEmployee = sequelize.define("sessionEmployee", {
        id: {
            field: 'id',
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        employeeId: {
            type: Sequelize.INTEGER,
            field: 'employee_id'
        },
        token: {
            type: Sequelize.STRING,
            field: 'token'
        },
        status: {
            type: Sequelize.STRING,
            field: 'status'
        },
    },
        {
            tableName: 'session_employee',
            timestamps: false,

        }
    );

    return sessionEmployee;
};


