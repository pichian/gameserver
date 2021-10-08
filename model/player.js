module.exports = (sequelize, Sequelize) => {
    return sequelize.define("player", {
        playerRefCode: {
            type: Sequelize.STRING,
            field: 'player_ref_code',
            allowNull: true,
            defaultValue: null,
            primaryKey: true
        },
        playerName: {
            type: Sequelize.STRING,
            field: 'player_name'
        },
        username: {
            type: Sequelize.STRING,
            field: 'username'
        },
        password: {
            type: Sequelize.STRING,
            field: 'password'
        },
        phoneNumber: {
            type: Sequelize.STRING,
            field: 'phone'
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
        agentRefCode: {
            type: Sequelize.STRING,
            field: 'agent_ref_code',
            allowNull: true,
            defaultValue: null
        },
        status: {
            type: Sequelize.STRING,
            field: 'status'
        },
        createBy: {
            type: Sequelize.STRING,
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
            type: Sequelize.STRING,
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
            tableName: 'tbm_player_info',
            timestamps: false,

        }
    )
};