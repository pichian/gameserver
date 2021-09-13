module.exports = (sequelize, Sequelize) => {
    const PlayerModel = sequelize.define("PlayerModel", {
        id: {
            field: 'id',
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        playerRefCode: {
            type: Sequelize.STRING,
            field: 'player_ref_code'
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
            field: 'description'
        },
        ranking: {
            type: Sequelize.INTEGER,
            field: 'ranking'
        },
        walletId: {
            type: Sequelize.STRING,
            field: 'wallet_id'
        },
        agentRefCode: {
            type: Sequelize.STRING,
            field: 'agent_ref_code'
        },
        status: {
            type: Sequelize.STRING,
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
            tableName: 'tbm_player_info',
            timestamps: false,

        }
    );

    return PlayerModel;
};