module.exports = (sequelize, Sequelize) => {
    return sequelize.define("playerPaymentRequest", {
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
        agentRefCode: {
            type: Sequelize.STRING,
            field: 'agent_ref_code',
            defaultValue: null
        },
        createRoleType: {
            type: Sequelize.STRING,
            field: 'create_rtype'
        },
        createBy: {
            type: Sequelize.STRING,
            field: 'create_by',
        },
        createDateTime: {
            field: 'create_datetime',
            type: Sequelize.DATE,
        },
        updateBy: {
            type: Sequelize.STRING,
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
};


