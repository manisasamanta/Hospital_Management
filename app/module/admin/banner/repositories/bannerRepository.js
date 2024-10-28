const Banner = require("../model/bannerModel");
const fs = require('fs');
const path = require('path');

class BannerRepository {

    async createBanner(data, file) {
        const adddata = new Banner({
            sub_heading: data.sub_heading,
            heading: data.heading,
            description: data.description,
        });

        if (file) {
            adddata.image = file.path;
        }

        return await adddata.save();
    }

    async updateBanner(id, data, file) {
        const existingBanner = await Banner.findById(id);
        if (file && existingBanner.image) {
            fs.unlinkSync(path.resolve(existingBanner.image));
        }

        return await Banner.findByIdAndUpdate(
            id,
            {
                sub_heading: data.sub_heading,
                heading: data.heading,
                description: data.description,
                image: file ? file.path : existingBanner.image
            },
            { new: true }
        );
    }

    async deleteBanner(id) {
        const deleted = await Banner.findByIdAndDelete(id);
        if (deleted && deleted.image) {
            fs.unlinkSync(path.resolve(deleted.image));
        }
        return deleted;
    }

    async findBannerById(id) {
        return await Banner.findById(id);
    }

    async toggleStatus(id) {
        const banner = await Banner.findById(id);
        if (banner) {
            banner.status = !banner.status;
            return await banner.save();
        }
        return null;
    }
}

module.exports = new BannerRepository();
