module.exports = (sequelize, Sequelize) => {
    return sequelize.define("sequenceTable", {
        refCode: {
            type: Sequelize.INTEGER,
            field: 'ref_code'
        },
        promotionCode: {
            type: Sequelize.INTEGER,
            field: 'promotion_code'
        },
    },
        {
            tableName: 'tbm_sequence',
            timestamps: false,

        }
    );
};
