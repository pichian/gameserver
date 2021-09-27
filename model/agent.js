module.exports = (sequelize, Sequelize) => {
    return sequelize.define("agent", {
        id: {
            field: 'id',
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        agentRefCode: {
            type: Sequelize.STRING,
            field: 'agent_ref_code',
            allowNull: true,
            defaultValue: null
        },
        agentName: {
            type: Sequelize.STRING,
            field: 'agent_name'
        },
        email: {
            type: Sequelize.STRING,
            field: 'email'
        },
        phoneNumber: {
            type: Sequelize.STRING,
            field: 'phone'
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
            field: 'description',
            defaultValue: ""
        },
        ranking: {
            type: Sequelize.INTEGER,
            field: 'ranking',
            defaultValue: 0
        },
        walletId: {
            type: Sequelize.STRING,
            field: 'wallet_id',
            allowNull: true,
            defaultValue: null
        },
        status: {
            type: Sequelize.STRING,
            field: 'status'
        },
        createBy: {
            type: Sequelize.INTEGER,
            field: 'create_by',
            allowNull: true,
            defaultValue: null
        },
        createDateTime: {
            field: 'create_datetime',
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false,
        },
        updateBy: {
            type: Sequelize.INTEGER,
            field: 'update_by',
            allowNull: true,
            defaultValue: null
        },
        updateDateTime: {
            field: 'update_datetime',
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
        }
    },
        {
            tableName: 'tbm_agent_info',
            timestamps: false,
        }
    );
};