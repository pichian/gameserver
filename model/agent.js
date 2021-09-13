module.exports = (sequelize, Sequelize) => {
    return sequelize.define("AgentModel", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            field: 'name'
        },
        username: {
            type: Sequelize.STRING,
            field: 'username'
        },
        email: {
            type: Sequelize.STRING,
            field: 'email'
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
            type: Sequelize.INTEGER,
            field: 'status'
        },
        refCode: {
            type: Sequelize.INTEGER,
            field: 'ref_code'
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
            tableName: 'agent',
            timestamps: false,
        }
    );
};