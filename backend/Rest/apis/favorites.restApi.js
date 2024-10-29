import { uuid } from 'uuidv4';
import _ from 'lodash';

function createNewFavarite(req, res) {
    let body = req.body;
    let { productId } = body
    let { userId } = req.params; // verifiying userId in middleware
    let newFavoriteId = `fav-${uuid()}`
    let favoriteDetails = [newFavoriteId, userId, productId, new Date()];
    connection.query('INSERT INTO favorites VALUES (?,?,?,?)', favoriteDetails, (err, results, fields) => {
        !err ? res.status(200).json(results) : res.status(400).json(err);
    })
}

async function getAllFavorites(req, res) {
    let userId = req.params.userId;
    let searchWord = req.query.search;
    try {
        let selectQuery = ''
        let favoriteItems = await query(`select * from favorites where createdBy = '${userId}'`);
        let productIds = favoriteItems.map((item) => item.productId)
        if (searchWord) {
            selectQuery = `select * from products where _id IN ("${productIds.join('", "')}") AND name REGEXP '${searchWord}'`;
        } else {
            selectQuery = `select * from products where _id IN ("${productIds.join('", "')}")`;
        }
        let products = await query(selectQuery);
        let productIdsMap = _.keyBy(products, '_id')
        favoriteItems = _.filter(favoriteItems, (item) => productIdsMap[item.productId]);
        res.json({
            favorites: _.map(favoriteItems, (item) => {
                item.product = productIdsMap[item.productId]
                return item;
            })
        })
    } catch (err) {
        console.log("Error : ", err)
        res.status(400).json(err);
        return;
    }
}

async function removeFavorite(req, res) {
    let userId = req.params.userId;
    let favoriteId = req.params.favoriteId;
    try {
        let result = await query(`DELETE FROM favorites WHERE _id ='${favoriteId}' AND createdBy = '${userId}';`);
        res.status(200).json(result);
    } catch (err) {
        console.log(err)
        res.status(400).json(err);
    }
}

let endpoints = {
    '/users/:userId/favorites': [{
            method: 'POST',
            callbacks: [createNewFavarite]
        },
        {
            method: 'GET',
            callbacks: [getAllFavorites]
        }
    ],
    '/users/:userId/favorites/:favoriteId': [{
        method: 'DELETE',
        callbacks: [removeFavorite]
    }, ]
}

export { endpoints }