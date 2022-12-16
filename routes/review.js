const express = require('express');
const router = express.Router();
const data = require('../data');
const helper = require("../helpers.js");
const reviewData = data.reviews;
const parksData = data.parks;
const usersData = data.users;
const path = require('path');
const xss = require('xss');
const likesClass = require('../data/likes');
router
  .route('/delete')
  .delete(async (req, res) => {
    if(!req.session.user){
      error = 'You have to login to delete review!';
      return res.status(400).json({error: error});
    }
    const reviewId = xss(req.body.reviewId);
    const userId = req.session.user.userId;
    let parkName = xss(req.body.parkName);
    if (!reviewId || !userId) {
      return res.status(400).json({ error: 'You must provide review or user Id' });
    }

    if (typeof reviewId !== 'string') {
      return res.status(400).json({ error: 'reviewId must be a string' });
    }
    if (reviewId.trim().length === 0) {
      return res.status(400).json({ error: 'reviewId cannot be an empty string or just spaces' });
    }
    if (typeof parkName !== 'string') {
      return res.status(400).json({ error: 'parkName must be a string' });
    }
    if (parkName.trim().length === 0) {
      return res.status(400).json({ error: 'parkName cannot be an empty string or just spaces' });
    }

    parkName = parkName.trim();
    if (parkName === '') {
      return res.status(400).json({ error: "Do not change my Park name!" });
    }
    parkName = helper.changeParkName(parkName);
    try{
      const review = await reviewData.getReview(reviewId);
      if(review.userId.toString() !== userId.toString()){
        return res.status(400).json({error: 'You can only delete your own review!'});
      }
      await reviewData.removeReview(reviewId);
      return res.status(200).json({parkName: parkName});
    } catch(e){
      return res.status(400).json({error: e});
    }

  });
router
  .route('/add')
  .post(async (req, res) => {

    if(!req.session.user){
      error = 'You have to login to add review!';
      return res.status(400).json({error: error}); 
      
    }
    const reviewTitle = xss(req.body.reviewTitle);
    const content = xss(req.body.content);
    let rating = xss(req.body.rating);
    let parkName = xss(req.body.parkName);
    
    if (!reviewTitle || !content || !rating || !parkName) {
      return res.status(400).json({ error: 'You must provide data for all fields' });
    }

    if (typeof parkName !== 'string') {
      return res.status(400).json({ error: 'parkName must be a string' });
    }
    if (parkName.trim().length === 0) {
      return res.status(400).json({ error: 'parkName cannot be an empty string or just spaces' });
    }

    parkName = parkName.trim();
    parkName = helper.changeParkName(parkName);
    try{
      rating = parseInt(rating);
      const park = await parksData.getParkByName(parkName);
      const user = await usersData.getUserByEmail(req.session.user.email);
      await reviewData.createReview(park._id, user._id, reviewTitle, content, rating);
     
      return res.status(200).json({parkName: parkName});
    }
    catch(e){

      return res.status(400).json({error: e});
    
    }
  });

  router
    .route('/like')
    .post(async (req, res) => {
      if(!req.session.user){
        error = 'You have to login to add review!';
        return res.status(400).json({error: error});
      }
      const reviewId = xss(req.body.reviewId);
      const userId = req.session.user.userId;
      let parkName = xss(req.body.parkName);
      if (!reviewId || !userId) {
        return res.status(400).json({ error: 'You must provide reviewId or UserId' });
      }

      if (!reviewId || !userId) {
        return res.status(400).json({ error: 'You must provide review or user Id' });
      }
  
      if (typeof reviewId !== 'string') {
        return res.status(400).json({ error: 'reviewId must be a string' });
      }
      if (reviewId.trim().length === 0) {
        return res.status(400).json({ error: 'reviewId cannot be an empty string or just spaces' });
      }
      if (typeof parkName !== 'string') {
        return res.status(400).json({ error: 'parkName must be a string' });
      }
      if (parkName.trim().length === 0) {
        return res.status(400).json({ error: 'parkName cannot be an empty string or just spaces' });
      }

      parkName = parkName.trim();
      
      try{
        await likesClass.addLike(userId, reviewId);
        return res.status(200).json({parkName: parkName});
      } catch(e){
        return res.status(400).json(e);
      }
    });

  router
    .route('/unlike')
    .post(async (req, res) => {
      if(!req.session.user){
        error = 'You have to login to add review!';
        return res.status(400).json({error: error});
      }
      const reviewId = xss(req.body.reviewId);

      const userId = req.session.user.userId;
      let parkName = xss(req.body.parkName);

      if (!reviewId || !userId) {
        return res.status(400).json({ error: 'You must provide review or user Id' });
      }
  
      if (typeof reviewId !== 'string') {
        return res.status(400).json({ error: 'reviewId must be a string' });
      }
      if (reviewId.trim().length === 0) {
        return res.status(400).json({ error: 'reviewId cannot be an empty string or just spaces' });
      }
      if (typeof parkName !== 'string') {
        return res.status(400).json({ error: 'parkName must be a string' });
      }
      if (parkName.trim().length === 0) {
        return res.status(400).json({ error: 'parkName cannot be an empty string or just spaces' });
      }

      parkName = parkName.trim();
      try{
        await likesClass.removeLike(userId, reviewId);
        return res.status(200).json({parkName: parkName});
      }
      catch(e){
        return res.status(400).json(e);
      }
    });

// router
//   .route('/:parkID/:userID')
//   .get(async (req, res) => {
//     try{
//       req.params.userID = helper.isValidObjectId(req.params.userID);
//     }catch(e){
//       return res.status(400).json({error: e});
//     }

//     try{
//       const userReviews = await reviewData.getAllUserReviews(req.params.userID);
//       res.status(400).render('../views/singlePark',{error:e,  title:"Park Reviews", park:userReviews.userID});
//     }catch(e){
//       res.status(404).json({ error: 'review by user id not found' });
//     }
//   })
//   .post(async (req, res) => {
//     console.log(2);
//     if(!req.session.user){
//       error = 'You have to login to add review!';
//       res.status(400).render('userLogin',{error:error, title:"login!"});
//       return;
//     }

//     const info = xss(req.body);
//     if(!info.reviewTitle || !info.content || !info.rating){
//       res.status(400).json({ message: 'All fields need to have valid values' });
//       return;
//     }

//     try{
//       req.params.parkID = helper.validParkId(req.params.parkID);
//     }catch(e){
//       return res.status(400).json({error: e});
//     }

//     try{
//       req.params.userID = helper.isValidObjectId(req.params.userID);
//     }catch(e){
//       return res.status(400).json({error: e});
//     }

//     try{
//       if(typeof info.reviewTitle !== 'string') throw 'reviewTitle must be a string';
//       info.reviewTitle = info.reviewTitle.trim();
//       if(typeof info.content !== 'string') throw 'content must be a string';
//       info.content = info.content.trim();
//       if (typeof info.rating !== 'number') throw 'Rating must be a number';
//       if (info.rating < 0 || info.rating > 5) throw 'Rating must be between 0 and 5';
//       info.rating = info.rating.trim();
//     }catch(e){
//       return res.status(400).json({error: e});
//     }

//     try{
//       const {reviewTitle,content,rating} = info;
//       const createReview = await reviewData.createReview(req.params.parkID,req.params.userID,reviewTitle,content,rating);
//       res.status(200).render('../views/singlePark',{error:e,  title:"Park Reviews", park:createReview.parkID});
//     }catch(e){
//       return res.status(400).json({error: e});
//     }
//   });

//   router
//   .route('/:reviewID')
//   .get(async (req, res) => {
//     try{
//       req.params.reviewID = helper.checkReviewID(req.params.reviewID);
//     }catch(e){
//       return res.status(400).json({error: e});
//     }

//     try{
//       const Reviews = await reviewData.getReview(req.params.reviewID);
//       res.status(200).render('../views/singlePark',{title:"Park Reviews", park:Reviews.reviewID});
//     }catch(e){
//       res.status(404).json({ error: 'review by user id not found' });
//     }
//   })
//   .delete(async (req, res) => {
//     //code here for DELETE
//     try{
//       req.params.reviewID = helper.checkReviewID(reviewID);
//     }catch(e){
//       return res.status(400).json({error: e});
//     }

//     try{
//       await reviewData.getReview(req.params.reviewID);
//     }catch(e){
//       return res.status(404).json({error: 'Review not found'});
//     }

//     try {
//       await reviewData.removeReview(req.params.reviewID);
//       res.status(200).json({"reviewId": req.params.movieId, "deleted": true});
//     } catch (e) {
//       res.status(500).json({error: e});
//     }
//   })
//   .patch(async (req, res) => {
//     const info = req.body;
//     try{
//       //if (!reviewTitle) throw 'You must provide a review title';
//       if(typeof info.reviewTitle !== 'string') throw 'reviewTitle must be a string';
//       info.reviewTitle = info.reviewTitle.trim();
//       //if (!content) throw 'You must provide a content';
//       if(typeof info.content !== 'string') throw 'content must be a string';
//       if(info.content.trim().length === 0) throw 'content cannot be an empty string or just spaces';
//       info.content = info.content.trim();
//       if (typeof info.rating !== 'number') throw 'Rating must be a number';
//       if (info.rating < 0 || info.rating > 5) throw 'Rating must be between 0 and 5';
//       info.rating = info.rating.trim();
//     }catch(e){
//       return res.status(400).json({error: e});
//     }

//     try{
//       await reviewData.getReview(req.params.reviewID);
//     }catch(e){
//       return res.status(404).json({error: 'Review not found'});
//     }

//     try{
//       const updateReview = await reviewData.updateReview(req.params.reviewID,info.content,info.reviewTitle);
//       res.status(200).jason(updateReview);
//     }catch(e){
//       res.status(500).json({error: e});
//     }
//   });

  module.exports = router;
