module.exports = (sequelize, Sequelize) => {
    const EmployeeModel = sequelize.define("EmployeeModel", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        employeeName: {
            type: Sequelize.STRING,
            field: 'employee_name'
        },
        email: {
            type: Sequelize.STRING,
            field: 'email'
        },
        username: {
            type: Sequelize.STRING,
            field: 'username'
        },
        password: {
            type: Sequelize.STRING,
            field: 'password'
        },
        description: {
            type: Sequelize.STRING,
            field: 'description'
        },
        status: {
            type: Sequelize.BOOLEAN,
            field: 'status'
        },
        createBy: {
            type: Sequelize.INTEGER,
            field: 'create_by'
        },
        createDateTime: {
            field: 'create_datetime',
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false,
        },
        updateBy: {
            type: Sequelize.INTEGER,
            field: 'update_by'
        },
        updateDateTime: {
            field: 'update_datetime',
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
        }
    },
        {
            tableName: 'employee',
            timestamps: false,

        }
    );

    return EmployeeModel;
};