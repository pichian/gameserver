module.exports = (sequelize, Sequelize) => {
    const SessionPlayerModel = sequelize.define("SessionPlayerModel", {
        id: {
            field: 'SessionPlayer_ID',
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        playerId: {
            type: Sequelize.INTEGER,
            field: 'Player_ID'
        },
        token: {
            type: Sequelize.STRING,
            field: 'SessionPlayer_Token'
        },

    },
        {
            tableName: 'session_player',
            timestamps: false,

        }
    );

    return SessionPlayerModel;
};


