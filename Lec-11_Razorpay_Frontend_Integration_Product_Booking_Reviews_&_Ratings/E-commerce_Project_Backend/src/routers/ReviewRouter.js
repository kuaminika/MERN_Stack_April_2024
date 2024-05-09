const express = require("express");
const ReviewRouter = express.Router();
const ReviewModel = require("../models/ReviewModel");
const { protectRouteMiddleWare } = require("../controllers/AuthController");
const UserModel = require("../models/UserModel");
const ProductModel = require("../models/ProductModel");

const createReviewController = async(req, res) =>{
    try {
        // do implementation here
        // give a particular rating to a product with review
        // calculate avg rating as well
        // push that review data in the productModel
        const userId = req.userId;
        const rawReview = req.body;
        const { productId } = req.params;
        console.log('productId', productId);
        const savedReview = await ReviewModel.create(rawReview);
        console.log(savedReview);
        const userObj =  await UserModel.findById(userId);
 
        userObj.reviews.push(savedReview['_id']);
        await userObj.save();
        console.log(userObj);
        /**
         *   review
        rating
        createAt
        user
        product
         * 
         */

    } catch (err) {
        res.status(500).json({
            status: "failure",
            message: err.message
        })
    }
}

const getAllReviewForAProductController = async function (req, res) {
   
   try {
        // do implementation here -> as a homework

        // get the data from reviewModel
        // filter the query via page=1&limit=10
        // send as a response.
        

    } catch (err) {
        res.status(500).json({
            status: "failure",
            message: err.message
        })
    }
}

ReviewRouter.post("/:productId", protectRouteMiddleWare, createReviewController);

ReviewRouter.get("/:productId", getAllReviewForAProductController);

module.exports = ReviewRouter;