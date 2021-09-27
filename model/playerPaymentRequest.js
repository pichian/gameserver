module.exports = (sequelize, Sequelize) => {
    const playerPaymentRequestModel = sequelize.define("playerPaymentRequest", {
        id: {
            field: 'id',
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        playerId: {
            type: Sequelize.INTEGER,
            field: 'player_id'
        },
        paymentType: {
            type: Sequelize.STRING,
            field: 'payment_type'
        },
        wayToPay: {
            type: Sequelize.STRING,
            field: 'way_to_pay'
        },
        amount: {
            type: Sequelize.DOUBLE,
            field: 'payment_amount'
        },
        paymentStatus: {
            type: Sequelize.STRING,
            field: 'payment_status'
        },
        promotionRefId: {
            type: Sequelize.INTEGER,
            field: 'promotion_ref_id',
        },
        remark: {
            type: Sequelize.STRING,
            field: 'remark'
        },
        approvedBy: {
            type: Sequelize.INTEGER,
            field: 'approved_by',
            defaultValue: null
        },
        approveDateTime: {
            field: 'approved_datetime',
            type: Sequelize.DATE,
        },
        createRoleType: {
            type: Sequelize.STRING,
            field: 'create_rtype'
        },
        createBy: {
            type: Sequelize.INTEGER,
            field: 'create_by',
        },
        createDateTime: {
            field: 'create_datetime',
            type: Sequelize.DATE,
        },
        updateBy: {
            type: Sequelize.INTEGER,
            field: 'update_by',
        },
        updateDateTime: {
            field: 'update_datetime',
            type: Sequelize.DATE,
        }
    },
        {
            tableName: 'tbt_player_payment_request',
            timestamps: false,

        }
    );
    return playerPaymentRequestModel;
};


