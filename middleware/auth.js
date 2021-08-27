'use strict';
const jwt = require("jsonwebtoken");
const db = require("../model");

const config = process.env

exports.authtoken = async function (req, res, next) {


    const token = req.headers["api_key"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    try {


            const SessionPlayerModel =  db.SessionPlayer

            const findSessionPlayer = await SessionPlayerModel.findOne({
                where: {
                  token: token,
                }
            });

            //console.log(findSessionPlayer);
              
            if(findSessionPlayer){

                //console.log('config.JWT_TOKEN_KEY=' + config.JWT_TOKEN_KEY)

                const PlayerModel =  db.Player

                const findPlayer = await PlayerModel.findOne({
                    where: {
                      id: findSessionPlayer.toJSON().playerId,
                    }
                });
    

                const decoded = jwt.verify(token, config.JWT_TOKEN_KEY);
                console.log(decoded);
                req.user = findPlayer.toJSON();
            }else{

                return res.status(401).send(
                    {
                        code: 401,
                        message: 'token ไม่ถูกต้อง'
                    }
                );

            }



       
    } catch (err) {
        console.err(err);
        return res.status(401).send(
            {
                code: 401,
                message: 'token ไม่ถูกต้อง'
            }
        );
    }
    //return next();





}


// const verifyToken = (req, res, next) => {
//   const token =
//     req.body.token || req.query.token || req.headers["api_key"];

//   if (!token) {
//     return res.status(403).send("A token is required for authentication");
//   }
//   try {
//     const decoded = jwt.verify(token, config);
//     req.user = decoded;
//   } catch (err) {
//     return res.status(401).send("Invalid Token");
//   }
//   return next();
// };

// module.exports = verifyToken;