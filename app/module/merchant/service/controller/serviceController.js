const User = require("../../../user/model/userModel");
const Service = require("../model/serviceModel");
const serviceRepository = require("../repository/serviceRepository");

class serviceController {

//service------------------------------------------------

service=async(req,res)=>{ 
    try{
        
        const merchant = req.merchant;

        // Fetch services only for the logged-in merchant
        const services=await Service.find({ merchantId: merchant.id }).populate('merchantId', 'username');
        // console.log('Fetched services:', services); 

            res.render('merchant/layouts/service/service_list',{
         title:'service',
         services, 
         merchant

            })   
     
    }catch(err){
        console.log(err);
    }
}

// Create a new service
async createService(req, res) {
    try {
        const merchantId = req.merchant.id;
        console.log('merchantId:',merchantId);
        
        const result = await serviceRepository.createService(req.body,req.file,merchantId);
        if (result) {
            res.redirect('/merchant/servicepage');
        } else {
            res.redirect('/addform');
        }
    } catch (err) {
        console.error(err);
        res.redirect('/addform');
    }
}


  // Update a service
  async updateService(req, res) {
    const id = req.params.id;
    try {
        const merchantId = req.merchant.id;
        await serviceRepository.updateService(id, req.body, req.file,merchantId);
        res.redirect('/merchant/servicepage');
    } catch (err) {
        console.error(err);
        res.redirect('/merchant/servicepage');
    }
}

// Delete a service
async deleteService(req, res) {
    const id = req.params.id;
    try {
        await serviceRepository.deleteService(id);
        res.redirect('/merchant/servicepage');
    } catch (err) {
        console.error(err);
        res.redirect('/merchant/servicepage');
    }
}



// Render add service form
async addServiceForm(req, res) {
    res.render('merchant/layouts/service/add_service', {
        title: 'Add Service Form Page',
        merchant:req.merchant
    });
}

// Render edit service form
async editService(req, res) {
    const id = req.params.id;
    try {
        const editdata = await serviceRepository.findServiceById(id);
        res.render('merchant/layouts/service/edit_service', {
            d: editdata,
            title: 'Update Page',
            merchant:req.merchant
        });
    } catch (err) {
        console.log(err);
        res.redirect('/merchant/servicepage');
    }
}

}

module.exports= new serviceController()