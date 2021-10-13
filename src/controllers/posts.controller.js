import { createFilter } from 'odata-v4-sql'
import { DBQueries } from "../database/DBQueries.js";
import postsConstatns from "../utilities/string_constants/posts.js";
import constants from "../utilities/string_constants/global.js";

export const getPosts = async (req, res) => {
    try {
        const { $filter } = req.query
        let result = []
        if ($filter === undefined) {
            result = await DBQueries.getAllData(postsConstatns.TABLE_NAME)
        } else {
            const filter = createFilter(req.query.$filter);
            result = await DBQueries.filterData(postsConstatns.TABLE_NAME, filter)
        }
        let posts = await setTags(result.recordset)
        res.send(posts)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

const setTags = async (posts) => {
    for (let i = 0; i< posts.length; i++) {
        const inputs = new Map();
        inputs.set(constants.POST_ID, posts[i].post_id)
        let result = await DBQueries.executeProcedure(postsConstatns.GET_POST_TAGS, inputs);
        posts[i]["tags"] = result.recordset;
    }
    return posts;
}


