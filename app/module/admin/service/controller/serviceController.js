const Service = require("../../../merchant/service/model/serviceModel");
const User = require('../../../user/model/userModel')




class serviceController{

    pending_servicepage = async (req, res) => {
        try{    
            const services = await Service.find({ status: 'pending' }).populate('merchantId','username');
           res.render("admin/layouts/service/pending_service", {
            title: "pending service",
            services,
            admin:req.admin 
          });  
      
        }catch(error){
          console.log(error);
        }
      };


      accepted_servicepage = async (req, res) => {
        try{    
            const services = await Service.find({ status: 'accepted' }).populate('merchantId','username');
           res.render("admin/layouts/service/accepted_service", {
            title: "accepted service",
            services,
            admin:req.admin
          }); 
      
        }catch(error){
          console.log(error);
        }
      };




    approveService = async (req, res) => {
        const { id } = req.params;
        const service = await Service.findByIdAndUpdate(id, { status: 'accepted' }, { new: true });
        res.redirect('/admin/servicepage')
    }

    rejectService = async (req, res) => {
        const { id } = req.params;
        const service = await Service.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
        res.redirect('/admin/accepted_servicepage')
    }




    //merchant

    merchant=async(req,res)=>{
      try{
          const data=await User.find({ role: 'merchant' })
    
          if(data){
              res.render('admin/layouts/merchant',{
           title:'merchant',
           emdata:data,
           admin:req.admin
              })
          }
       
      }catch(err){
          console.log(err);
      }
    }   
    

}

module.exports = new serviceController()