import { getConnection, sql } from "./dbConnection.js";
import constants from '../utilities/string_constants/global.js';
import { dmlStoredProc, filterStoredProc } from '../utilities/collections/global.js';

export const DBQueries = {
    async filterData(table, filter) {
        try {
            let result = []
            let parametersNames = filter.where.match(/\[+\w+\]/g)
            console.log({ parametersNames })
            let procedureName = filterStoredProc.get(table).get(parametersNames[0].replace(/\W+/g, ''))
            console.log({ filterStoredProc })
            if (filter.parameters.size != 1 || procedureName === undefined) {
                let view = filterStoredProc.get(table).get(constants.GENERAL_VIEW)
                console.log({ view })
                result = await this.consulBySelect(view, filter)
            }
            else {
                const params = new Map();
                let it = 0;
                parametersNames.forEach((parameterName) => {
                    let parameterValue = filter.parameters.get(`p${it++}`)
                    params.set(parameterName.replace(/\W+/g, ''), parameterValue)
                });
                result = await this.executeProcedure(procedureName, params)
            }
            return result;
        } catch (error) {
            console.error(error)
            return error
        }
    },
    async executeProcedure(procedureName, params) {
        let procedure = buildProcedure(params, procedureName)
        return await eval(`(async () => {${procedure}})()`)
    },
    async consulBySelect(view, filter = undefined) {
        try {
            const query = buildQuery(view, filter)
            console.log({ query })
            const pool = await getConnection()
            const result = await pool
                .request()
                .query(query);
            return result;
        } catch (error) {
            console.error(error)
            return error
        }
    },
    async executeDMLProcedure(method, table, params) {
        const procedureName = dmlStoredProc.get(table).get(method)
        return await this.executeProcedure(procedureName, params)
    },

    async getAllData(table) {
        try {
            const view = filterStoredProc.get(table).get(constants.GENERAL_VIEW)
            console.log({ view })
            return await this.consulBySelect(view)
        } catch (error) {
            console.error(error)
            return error
        }
    }
}

function buildProcedure(params, storedProcName) {
    let strProc = `const pool = await getConnection();
                        let result = await pool.request()`
    for (let input of params.entries()) {
        strProc += `.input('${input[0]}', sql.VarChar, \`${input[1]}\`)`;
    }
    strProc += `.execute('${storedProcName}'); return result`
    return strProc
}

function buildQuery(view, filter) {
    if (filter !== undefined && filter.parameters.size > 0) {
        const iterator = filter.parameters.entries();
        const condition = filter.where.replace(/\?/g, function () { return `'${iterator.next().value[1]}'` })
        return `${view} WHERE ${condition}`
    }
    return view
}



