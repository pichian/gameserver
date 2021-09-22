module.exports = (sequelize, Sequelize) => {
    const sessionPlayerModel = sequelize.define("SessionPlayerModel", {
        id: {
            field: 'id',
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        playerId: {
            type: Sequelize.INTEGER,
            field: 'player_id'
        },
        token: {
            type: Sequelize.STRING,
            field: 'token'
        },
        status: {
            type: Sequelize.STRING,
            field: 'status',
        }
    },
        {
            tableName: 'session_player',
            timestamps: false,

        }
    );

    return sessionPlayerModel;
};


