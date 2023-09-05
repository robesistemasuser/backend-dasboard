const { dbconfig } = require('../config/dbconfig');
const mysql = require('mysql2/promise'); // Utilizamos la versión promise para manejar promesas

exports.handler = async (event) => {    

    try {
        //console.log(event);
        //console.log(dbconfig);
        const pool = mysql.createPool(dbconfig);

        // Adquiere una conexión del pool
        const connection = await pool.getConnection();

        // Realiza la consulta SELECT
        const query = 'SELECT * FROM transaction';
        const [rows] = await connection.query(query);

        const jsonResp = rows.map(row => {
            return {
                id: row.transaction_pk,
                connectorId: row.connector_pk,
                idTag: row.id_tag,
                startEventTimestamp: row.start_event_timestamp,
                startTimestamp: row.start_timestamp,
                startValue: row.start_value,
                stopEventActor: row.stop_event_actor,
                stopEventTimestamp: row.stop_event_timestamp,
                stopTimestamp: row.stop_timestamp,
                stopValue: row.stop_value,
                stopReason: row.stop_reason
            };
        });


        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': "*",
                'Access-Control-Allow-Credentials': true,
              },
            body: JSON.stringify(jsonResp)
            //body: JSON.stringify(rows)
        };
    } catch (error) {
        console.error('Error al realizar la consulta:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': "*",
                'Access-Control-Allow-Credentials': true,
              },
            body: JSON.stringify({ message: 'Error al realizar la consulta' })
        };
    } finally {
        try {
            if (pool) {
                pool.end(); // Cierra todas las conexiones al finalizar
            }
        } catch (error) {

        }
    }
};