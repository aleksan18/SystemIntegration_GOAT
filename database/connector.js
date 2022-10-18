const neo4j = require('neo4j-driver');
require("dotenv").config();

const uri = process.env.DB_CONNECTION;

const user = process.env.DB_USER;

const password = process.env.DB_PASSWORD;



// To learn more about the driver: https://neo4j.com/docs/javascript-manual/current/client-applications/#js-driver-driver-object
console.log(process.env.API_Mail)
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
/**
 * 
 * @returns Gives back a session for query execution
 */
const connection = () => {
    return driver.session()
}
/**
 * Close kills the driver connection and all sessions associated with it
 */
const close = async()=>{
    await driver.close()
}

module.exports ={
    close,
    connection
}