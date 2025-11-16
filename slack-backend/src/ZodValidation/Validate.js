export const validate = (Schema) => (req, res, next) => {
    try {
        Schema.parse(req.body);
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Invalid Request",
            error: error.message,
            status: 400,
            success: false,
        })
    }
}