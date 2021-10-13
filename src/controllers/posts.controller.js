import { createFilter } from 'odata-v4-sql'
import { getConnection, sql } from '../database/dbConnection.js'

const posts = [
    { id: 1, caption: "My first post", user: "user1" },
    { id: 2, caption: "My second post", user: "user2" },
    { id: 3, caption: "My tirth post", user: "user3" },
    { id: 4, caption: "My fourth post", user: "user4" }
]

export const getPosts = async (req, res) => {
    try {
        let { $filter } = req.query
        $filter = createFilter($filter)
        console.log($filter);
        res.json(posts)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
};


