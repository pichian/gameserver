module.exports = (sequelize, Sequelize) => {
    const SessionAgentModel = sequelize.define("SessionAgentModel", {
        id: {
            field: 'id',
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        agentId: {
            type: Sequelize.INTEGER,
            field: 'agent_id'
        },
        token: {
            type: Sequelize.STRING,
            field: 'token'
        },

    },
        {
            tableName: 'session_agent',
            timestamps: false,

        }
    );

    return SessionAgentModel;
};


