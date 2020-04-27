const express = require('express')
const router = express.Router();
const Category = require('../services/modals/Category');
const verifyToken = require('../services/middleware/verify-token');


router.get('/addCategory',verifyToken,(req,res) => {
    res.render('addCategory.ejs');
});

router.post('/addCategory', (req,res) => {
    const { categoryName } = req.body;

    const newCategory = new Category({
        categoryName
    });

    newCategory.save ((err,find_category) => {
        if(err){
            res.render('error.ejs')
        }
        return res.send("<script> alert('Salon Kategorisi başarıyla eklendi'); window.location = '/category/category/'; </script>");

    });
});

router.get('/category',verifyToken,(req,res)=>{
    Category.find({},(err,find_category)=>{
        if(err){
            return res.render('error.ejs');
        }
        res.render('addCategory.ejs',{
            find_category
        })
    });
});

router.get('/deleteCategory/:_id',verifyToken,(req,res)=>{
    Category.remove({_id:req.params._id},(err,find_category)=>{
        if(err){
            return res.render('error.ejs');
        }
            return res.send("<script> alert('Salon Kategorisi başarıyla silindi.'); window.location = '/category/category/'; </script>")
    });
});

router.post('/addSubCategory/:_id',verifyToken,(req,res)=>{
    const _id = req.params._id;
    const categorySubName = req.body.categorySubName;
    if(!categorySubName || !_id){
        return res.send("<script> alert('Lütfen tüm alanları doldurunuz.'); window.location = '/category/subCategory/"+_id+"'; </script>")
    }
    Category.updateOne({_id:req.params._id},{$push:{categorySub:{categorySubName:categorySubName},}},(err)=>{
        if(err){
            console.log(err)
            return res.render('error.ejs');
        }
        return res.send("<script> alert('İşlem ekleme işlemi başarılı.'); window.location = '/category/subCategory/"+req.params._id+"'; </script>")
    });
});

router.get('/subCategory/:_id',verifyToken,(req,res)=>{
    Category.findOne({_id:req.params._id},(err,find_subCategory)=>{
        if(err){
            return res.render('error.ejs');
        }
        res.render('subCategory.ejs',{
            find_subCategory,
        })
    });
});

router.get('/deleteSubCategory/:_id',verifyToken,(req,res)=>{
    Category.findOneAndUpdate({'categorySub._id': req.params._id},{
        $pull: {categorySub:{_id:req.params._id}}
      },(err)=>{
        if(err){
            console.log(err);
            return res.render('error.ejs');
        }
            return res.send("<script> alert(' İşlem başarıyla silindi.'); window.location = '/category/category/'; </script>")
    });
});

/*router.post('/editCategory/:_id',(req,res)=>{
    const _id = req.params._id;
    const categorySubName = req.body.categorySubName;
    if(!categorySubName || !_id){
        return res.send("<script> alert('Lütfen tüm alanları doldurunuz.'); window.location = '/kategoriler/kategori/"+_id+"'; </script>")
    }
    Category.updateOne({_id:req.params._id},{$push:{categorySub:{categorySubName:categorySubName},}},(err)=>{
        if(err){
            console.log(err)
            return res.render('error.ejs');
        }
        return res.send("<script> alert('Alt Kategori ekleme işlemi başarılı.'); window.location = '/kategoriler/kategori/"+req.params._id+"'; </script>")
    });
});

router.get('/category/:_id',(req,res)=>{
    Category.findOne({_id:req.params._id},(err,find_category)=>{
        if(err){
            return res.render('error.ejs');
        }
        res.render('altkategori.ejs',{
            find_category,
            moment,
            title:'ALT KATEGORİ',
        })
    });
});

router.get('/altkategorisil/:_id',(req,res)=>{
    Category.findOneAndUpdate({'categorySub._id': req.params._id},{
        $pull: { categorySub: { _id: req.params._id }}
      },(err)=>{
        if(err){
            console.log(err);
            return res.render('error.ejs');
        }
            return res.send("<script> alert(' Alt Kategori başarıyla silindi.'); window.location = '/kategoriler/kategoriler/'; </script>")
    });
});




*/



module.exports = router;