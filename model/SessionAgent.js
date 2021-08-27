module.exports = (sequelize, Sequelize) => {
    const SessionAgentModel = sequelize.define("SessionAgentModel", {
        id: {
            field: 'SessionAgent_ID',
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        AgentId: {
            type: Sequelize.INTEGER,
            field: 'Agent_ID'
        },
        token: {
            type: Sequelize.STRING,
            field: 'SessionAgent_Token'
        },

    },
        {
            tableName: 'session_Agent',
            timestamps: false,

        }
    );

    return SessionAgentModel;
};


