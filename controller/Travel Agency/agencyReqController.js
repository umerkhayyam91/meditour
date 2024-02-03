const AgencyRequest = require("../../models/Travel Agency/request")

const agencyRequestController = {
    async getAllRequests(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
            let requestType = req.query.requestType;
            const requestsPerPage = 10;
            const agencyId = req.user._id;
            let totalRequests;
            let totalPages;
            let skip;
            let requests;
            if (requestType == "flight") {
                totalRequests = await AgencyRequest.countDocuments({
                    agencyId,
                    requestType: "flight"
                }); // Get the total number of posts for the user
                totalPages = Math.ceil(totalRequests / requestsPerPage); // Calculate the total number of pages

                skip = (page - 1) * requestsPerPage; // Calculate the number of posts to skip based on the current page

                requests = await AgencyRequest.find({ agencyId, requestType })
                    .skip(skip)
                    .limit(requestsPerPage);

            } else if (requestType == "tour") {
                totalRequests = await AgencyRequest.countDocuments({
                    agencyId,
                    requestType
                }); // Get the total number of posts for the user
                totalPages = Math.ceil(totalRequests / requestsPerPage); // Calculate the total number of pages

                skip = (page - 1) * requestsPerPage; // Calculate the number of posts to skip based on the current page

                requests = await AgencyRequest.find({ agencyId, requestType })
                    .skip(skip)
                    .limit(requestsPerPage);
            } else {
                totalRequests = await AgencyRequest.countDocuments({
                    agencyId,
                }); // Get the total number of posts for the user
                totalPages = Math.ceil(totalRequests / requestsPerPage); // Calculate the total number of pages

                skip = (page - 1) * requestsPerPage; // Calculate the number of posts to skip based on the current page

                requests = await AgencyRequest.find({ agencyId })
                    .skip(skip)
                    .limit(requestsPerPage);
            }
            let previousPage = page > 1 ? page - 1 : null;
            let nextPage = page < totalPages ? page + 1 : null;
            return res.status(200).json({
                requests: requests,
                auth: true,
                previousPage: previousPage,
                nextPage: nextPage,
            });
        } catch (error) {
            return next(error);
        }
    },


    //.............dummy api................//
    async addRequests(req, res, next) {
        const { agencyId, userId, from, to, actualPrice, packageName, totalUser } = req.body;
        const tourId = req.query.tourId;
        // insuranceCompanyId = req.user._id;
        const request = new AgencyRequest({
            agencyId,
            userId,
            from,
            to,
            actualPrice,
            packageName,
            totalUser,
            tourId,
            requestType: "flight"
        })
        await request.save();
        res.status(200).json({
            request: request,
            auth: true,
        });
    }
}

module.exports = agencyRequestController;