const express = require('express')
const router = express.Router();
const Operatings = require('../services/modals/Operatings');
const Staff = require('../services/modals/Staff');
const moment = require('moment');
require('moment/locale/tr');
const verifyToken = require('../services/middleware/verify-token');

router.get('/operatings',verifyToken,(req,res)=>{
    Operatings.find({},(err,find_operating)=>{
        if(err){
            return res.render('error.ejs');
        }
        res.render('operatings.ejs',{
            find_operating,
            moment,
            title:'Tüm İşletmeler'
            
        })
    });
});

router.get('/lastOperatings',verifyToken,(req,res)=>{
    Operatings.find({},(err,find_operating)=>{
        if(err){
            return res.render('error.ejs');
        }
        res.render('lastOperatings.ejs',{
            find_operating,
            moment,
            title:'Son Onaylanan İşletmeler'
            
        })
    }).sort({'find_operating.operatingValidationCreated': -1}).limit(10);
});

router.get('/operating_profile/:_id',verifyToken,(req,res)=>{
    Operatings.findOne({ _id: req.params._id },(err,find_operating)=>{
            if(err){
                return res.render('error.ejs');
            }
            Staff.find({staffOperatingId:req.params._id},(err,find_staff)=>{
                if(err){
                    return res.render('error.ejs');
                }
                res.render('operatingProfile.ejs',{
                    find_staff,
                    find_operating,
                    moment,
                })
            });
        });
});

router.get('/pending_operatings',verifyToken,(req,res)=>{
    Operatings.find({operatingType:0},(err,find_operating)=>{
        if(err){
            return res.render('error.ejs');
        }
        res.render('validation.ejs',{
            find_operating,
            title:'Onay Bekleyen İşletmeler'
        })
    });
});

router.get('/removeBannedUser/:_id',verifyToken,(req,res)=>{
    Users.updateOne({_id:req.params._id},{$set:{userBanType:0}},(err,find_user)=>{
        if(err){
            return res.render('error.ejs');
        }
        return res.send("<script> alert('Kullanıcı Engeli Başarıyla Kaldırıldı'); window.location = '/users/disabled_users/'; </script>")
    });
});

router.get('/deleteOperating/:_id',verifyToken,(req,res)=>{
    Operatings.removeOne({_id:req.params._id},(err,find_operating)=>{
        if(err){
            return res.render('error.ejs');
        }
        return res.send("<script> alert('İşletme Başarıyla Silindi'); window.location = '/operatings/operatings/'; </script>")
    });
});

router.get('/updateOperatingPhoto/:_id',verifyToken,(req,res)=>{
    Operatings.updateOne({_id:req.params._id},{$set:{operatingPhoto:'https://i.hizliresim.com/AcVRnT.jpg'}},(err,find_operating)=>{
        if(err){
            return res.render('error.ejs');
        }
        return res.send("<script> alert('Resim Başarıyla Sıfırlandı'); window.location = '/operatings/operatings/'; </script>")
    });
});

router.get('/deleteStaff/:_id',verifyToken,(req,res)=>{
    Staff.findOneAndRemove({_id:req.params._id},(err,find_staff)=>{
        const id = find_staff.staffOperatingId;
        if(err){
            return res.render('error.ejs');
        }
        return res.send("<script> alert('Çalışan Başarıyla Silindi'); window.location = '/operatings/operating_profile/"+id+"'; </script>")
    });
});

router.get('/updateStaffPhoto/:_id',verifyToken,(req,res)=>{
        Staff.findByIdAndUpdate({_id:req.params._id},{$set:{staffPhoto:'https://i.hizliresim.com/pJ7Oqd.png'}},(err,find_staff)=>{
            const id = find_staff.staffOperatingId;
            if(err){
                return res.render('error.ejs');
            }
            return res.send("<script> alert('Resim Başarıyla Sıfırlandı'); window.location = '/operatings/operating_profile/"+id+"'; </script>")
        });
});


router.get('/kayit_onayla/:id',verifyToken,(req,res)=>{
    Operatings.findOneAndUpdate({_id:req.params.id},{$set:{operatingType:1,validationAdmin:adminFullName,operatingValidationCreated:Date.now()}},(err,find_operating)=>{
        if(err){
            return res.render('error.ejs');
        }
        return res.send("<script> alert('Onaylama işlemi başarılı.'); window.location = '/operatings/pending_operatings'; </script>")
    });

});

router.get('/kayit_sil/:id',verifyToken,(req,res)=>{
    Operatings.remove({_id:req.params.id},(err,find_operating)=>{
        if(err){
            return res.render('error.ejs');
        }
        return res.send("<script> alert('İşletme kaydı silindi'); window.location = '/operatings/pending_operatings'; </script>")
    });

});

module.exports = router;
