const BannerRepository = require('../repositories/bannerRepository');
const Banner = require('../../../admin/banner/model/bannerModel')

class BannerCrudController {
    

    bannerview=async(req,res)=>{
        try{
            const data=await Banner.find()

            if(data){
                res.render('admin/layouts/banner/banner',{
             title:'banner',
             bdata:data,
             admin:req.admin
                })    
            }
         
        }catch(err){
            console.log(err);
        }
    } 



    // create
    createBanner = async (req, res) => {
        try {
            const result = await BannerRepository.createBanner(req.body, req.file);
            if (result) {
                res.redirect('/admin/bannerpage');
            } else {
                res.redirect('/addform');
            }
        } catch (err) {
            console.log(err);
            res.redirect('/addform');
        }
    }

    // update
    updateBanner = async (req, res) => {
        const id = req.params.id;
        try {
            await BannerRepository.updateBanner(id, req.body, req.file);
            res.redirect("/admin/bannerpage");
        } catch (err) {
            console.error(err);
            res.redirect("/admin/bannerpage");
        }
    }

    // delete
    deleteBanner = async (req, res) => {
        const id = req.params.id;
        try {
            await BannerRepository.deleteBanner(id);
            res.redirect('/admin/bannerpage');
        } catch (err) {
            console.error(err);
            res.redirect('/admin/bannerpage');
        }
    }

    // add form
    addBannerForm = (req, res) => {
        res.render('admin/layouts/banner/add_banner', {
            title: 'Add Banner Form Page',
            admin:req.admin
        });
    }

    // edit banner form page
    editBanner = async (req, res) => {
        const id = req.params.id;
        try {
            const editdata = await BannerRepository.findBannerById(id);
            if (editdata) {
                res.render('admin/layouts/banner/edit_banner', {
                    d: editdata,
                    title: "Update Page",
                    admin:req.admin
                });
            }
        } catch (err) {
            console.log(err);
            res.redirect('/admin/bannerpage');
        }
    }

    // status check
    statusCheck = async (req, res) => {
        const id = req.params.id;
        try {
            const statdata = await BannerRepository.toggleStatus(id);
            if (statdata) {
                res.redirect('/admin/bannerpage');
            } else {
                res.redirect('/admin/bannerpage');
            }
        } catch (err) {
            console.log(err);
            res.redirect('/admin/bannerpage');
        }
    }
}

module.exports = new BannerCrudController();
