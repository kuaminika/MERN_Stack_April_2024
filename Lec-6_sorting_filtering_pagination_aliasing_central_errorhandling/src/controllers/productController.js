const axios = require('axios');
const ProductModel = require('../models/productModel');
 
const {
    createFactory,
    getAllFactory,
    getByIdFactory,
    updateByIdFactory,
    deleteByIdFactory
} = require('../utils/curdFactory'); 
/**
 * 
 * 
    - feed the product data into mongodb: https://fakestoreapi.com/products

    - https://jsonviewer.stack.hu/ - formated data

    - Create login and signup page
 * 
 */
const hmwProductsFeed = async(req,res)=>{
    try{
        console.log("inside hw")
        let products = await axios.get("https://fakestoreapi.com/products");//.then(r=>r.json());
        products= products.data;
            console.log("products",products);
                if(!products.length) {
                    res.status(404).json({message: 'Product not found'});
                    //throw new Error('Product not found');
                }
                res.status(200).json({
                    data: products
                });
        
    }
    catch(error)
    {
        res.status(500).json({message: error.message}); 
     
    }


}

// const createProduct = async(req, res) => {
//     try {
//         const product = await ProductModel.create(req.body);

//         if(!product) {
//             res.status(404).json({message: 'Product not found'});
//         }

//         res.status(201).json({
//             message: 'Product created successfully',
//             data: product
//         });
//     } catch(error) {
//        res.status(500).json({message: error.message});
//     }
// }

// const getProducts = async (req, res) => {
//     try {
//         const products = await ProductModel.find();
//         if(!products.length) {
//             res.status(404).json({message: 'Product not found'});
//             //throw new Error('Product not found');
//         }
//         res.status(200).json({
//             data: products
//         });
//     } catch (error) {
//        res.status(500).json({message: error.message}); 
//     }
// }

// const getProductById = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const product = await ProductModel.findById(id);
//         if(!product) {
//             res.status(404).json({message: 'Product not found'});
//         }

//         res.status(200).json({
//             data: product
//         });
//     } catch (error) {
//        res.status(500).json({message: error.message}); 
//     }
// }

// const updateProductById = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const product = await ProductModel.findByIdAndUpdate(id, req.body, {new: true});
//         if(!product) {
//             res.status(404).json({message: 'Product not found!'}); 
//         }
//         res.status(200).json({
//             message: 'Product updated successfully',
//             data: product
//         });
//     } catch (error) {
//        res.status(500).json({message: error.message}); 
//     }
// }

// const deleteProductById = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const product = await ProductModel.findByIdAndDelete(id);
//         if(!product) {
//             res.status(404).json({message: 'Product not found!'}); 
//         }
//         res.status(200).json({
//             message: 'Product has been deleted.',
//             data: product
//         });
//     } catch (error) {
//        res.status(500).json({message: error.message}); 
//     }
// }


const transfomedQueryHelper = (myQuery) => {

    const parseQuery = JSON.parse(myQuery);
    console.log(parseQuery);

    const queryOperators = {
        gt: '$gt',
        gte: '$gte',
        lt: '$lt',
        lte: '$lte',

        // add any other opertors that you want
    }

    for(let key in parseQuery) { // price: {lt: 60}
      
       let internalObj = parseQuery[key];

       if(typeof internalObj === "object") {
         for(let innerKey in internalObj) { // {lt: 60}

         if(queryOperators[innerKey]) {
            internalObj[`$${innerKey}`] = internalObj[innerKey]
                // {$lt:60 }
            delete internalObj[innerKey];
         }
         }
       }
    }

    return parseQuery;
}

const getProductHandler = async(req, res) => {
    try {
        const query = req.query;

        const sortParams = query.sort;
        const selectParams = query.select;
        const page = query.page || 1;
        const limit = query.limit || 3;
        const skip = (page - 1) * limit;

        const filterParams = query.filter;


        console.log(sortParams);
        console.log(selectParams);
        console.log(filterParams);

        //1. Basic filtering - > can be done in find() or findByID() methods based params

        //let queryResponsePromise = ProductModel.find({name: "Camera"});


        //2. using query params and can also mongodb operators

        //let queryResponsePromise = ProductModel.find({price: {$lt: 60}});

        // 3. purely via mongoose methods
        //let queryResponsePromise = ProductModel.find().where('price').gt(60);

        let queryResponsePromise = null;

        if(filterParams) {
            const filterObj = transfomedQueryHelper(filterParams)
            queryResponsePromise = ProductModel.find(filterObj);
        } else {
            queryResponsePromise = ProductModel.find();
        }

        

        // Sorting
        if(sortParams) {
            const [sortParam, order] = sortParams.split(" ");

            if(order === 'asc'){
                queryResponsePromise = queryResponsePromise.sort(sortParam);
            } else{
                queryResponsePromise = queryResponsePromise.sort(`-${sortParam}`);
            }
        }

        // Selecting the particular fields data from mongodb
        if(selectParams) {
            queryResponsePromise = queryResponsePromise.select(selectParams);
        }

        //pagination
        queryResponsePromise = queryResponsePromise.skip(skip).limit(limit);


        const result = await queryResponsePromise;

        res.status(200).json({
            message:"Get products successfully",
            data: result
        })

    } catch (error) {
        res.status(500).json({message: 'Internal Server Error'});
    }
}

const getTop5Products = async(req, res, next) => {
    req.query.filter = {
        stock: {$lt: 5},
        averageRating: {$gt: 4.8}
    }

    next();
}

const createProduct = createFactory(ProductModel);
const getProducts = hmwProductsFeed;//getAllFactory(ProductModel);
const getProductById = getByIdFactory(ProductModel);
// const updateProduct = updateByIdFactory(ProductModel);
// const deleteProduct = deleteByIdFactory(ProductModel);

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    getProductHandler,
    getTop5Products,
    // updateProduct,
    // deleteProduct,
}