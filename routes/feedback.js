const express = require('express')
const router = express.Router();
const Feedback = require('../services/modals/Operatings');
const moment = require('moment');
require('moment/locale/tr');
const verifyToken = require('../services/middleware/verify-token');

router.get('/feedback',verifyToken,(req,res)=>{
    Feedback.find({},(err,find_feedback)=>{
        if(err){
            return res.render('error.ejs');
        }
        res.render('feedback.ejs',{
            find_feedback,
            moment,
            title:'Tüm Geri Bildirimler'
        })
    }).sort({'feedBackCreated':-1});
});

router.get('/deleteFeedBack/:id',verifyToken,(req,res)=>{
    Feedback.remove({_id:req.params.id},(err,find_feedback)=>{
        if(err){
            return res.render('error.ejs');
        }
        return res.send("<script> alert('Geri Bildirim Başarıyla Silindi'); window.location = '/feedback/feedback'; </script>")
    });

});

module.exports = router;
