import { uuid } from 'uuidv4';
import _ from 'lodash';

function checkShopNameAvailability(req, res) {
    let shopname = req.query.shopname;
    connection.query(`select * from shops where name = '${shopname}'`, (err, results, fields) => {
        if (err) {
            res.status(400).json({ msg: 'Error in fetching' });
            return;
        }
        if (results && results.length > 0) {
            res.status(200).json({ available: false });
        } else {
            res.status(200).json({ available: true });
        }
    })

}

async function createShop(req, res) {
    let body = req.body;
    let shopname = body.name;
    let userId = req.params.userId; // verifiying userId in middleware
    let newShopId = `sh-${uuid()}`
    let data = [newShopId, shopname, body.imageUrl, userId, new Date()];
    //to-do check if shop exists with same userId
    try {
        let results = await query('INSERT INTO shops VALUES (?,?,?,?,?)', data);
        res.status(200).json({
            shopId: newShopId,
            shopName: shopname
        })
        return;
    } catch (err) {
        res.status(400).json({
            'msg': err
        })
    }
}

async function getShopByUserId(req, res) {
    let userId = req.params.userId; // verifiying userId in middleware
    try {
        let shopDetails = await query(`select * from shops where createdBy = '${userId}';`);
        if (shopDetails && shopDetails.length == 0) {
            res.status(200).json({
                'msg': `Shop doesn't exist for user`
            })
            return;
        }
        let shopId = shopDetails && shopDetails[0] && shopDetails[0]._id;
        let shopSalesCount = await query(`select SUM(quantity) as totalSalesCount from orders where shopId='${shopId}'`)
        shopDetails = shopDetails[0];
        shopDetails.totalSalesCount = (shopSalesCount && shopSalesCount[0] && shopSalesCount[0].totalSalesCount) || 0;
        res.status(200).json(shopDetails);

    } catch (err) {
        console.log("err ===>", err);
        res.status(400).json({ msg: 'Error in fetching owner shops' });
        return;
    }
}

async function getShopById(req, res) {
    var shopId = req.params.shopId; // verifiying userId in middleware
    try {
        let shopDetails = await query(`select * from shops where _id = '${shopId}';`);
        if (shopDetails && shopDetails.length == 0) {
            res.status(400).json({
                'msg': `Shop doesn't exist`
            })
            return;
        }
        let shopSalesCount = await query(`select SUM(quantity) as totalSalesCount from orders where shopId='${shopId}'`)
        shopDetails = shopDetails[0];
        let shopOwnerId = shopDetails.createdBy;
        let shopOwnerDetails = await query(`select * from users where _id='${shopOwnerId}'`); 
        shopOwnerDetails = shopOwnerDetails[0];
        delete shopOwnerDetails.password;
        shopDetails.totalSalesCount = (shopSalesCount && shopSalesCount[0] && shopSalesCount[0].totalSalesCount) || 0;
        shopDetails.ownerDetails = shopOwnerDetails;
        res.status(200).json(shopDetails);

    } catch (err) {
        console.log("err ===>", err);
        res.status(400).json({ msg: 'Error in fetching owner shops' });
        return;
    }
}

async function updateShopById(req, res) {
    try {
        let body = req.body;
        let shopId = req.params.shopId;
        let shopImageUrl = body.imageUrl; 
        let results = await query("UPDATE shops SET imageUrl=?  where _id = ?", [shopImageUrl, shopId]);
        let shopDetails = await query("Select * from shops where _id = ?", [shopId]);
        shopDetails = shopDetails[0]
        res.status(200).json(shopDetails);
    } catch (err) {
        console.log("err ===>", err);
        res.status(400).json({ msg: "Error in updating cart data" });
        return;
    }
}

let endpoints = {
    '/users/:userId/shop/checkavailability': [{
        method: 'GET',
        callbacks: [checkShopNameAvailability]
    }],
    '/users/:userId/shops': [{
            method: 'POST',
            callbacks: [createShop]
        },
        {
            method: 'GET',
            callbacks: [getShopByUserId]
        }
    ],
    '/users/:userId/shops/:shopId': [
        {
            method: 'GET',
            callbacks: [getShopById]
        },
        {
            method: 'PUT',
            callbacks: [updateShopById]
        }
    ]
}


export { endpoints }