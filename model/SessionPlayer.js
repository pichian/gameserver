module.exports = (sequelize, Sequelize) => {
    return sequelize.define("SessionPlayerModel", {
        playerCode: {
            type: Sequelize.INTEGER,
            field: 'player_code',
            primaryKey: true
        },
        token: {
            type: Sequelize.STRING,
            field: 'token'
        },
        status: {
            type: Sequelize.STRING,
            field: 'status',
        },
        createDateTime: {
            field: 'create_datetime',
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    },
        {
            tableName: 'session_player',
            timestamps: false,

        }
    );
};


