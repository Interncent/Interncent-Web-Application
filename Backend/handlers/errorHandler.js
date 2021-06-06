function errorHandler (err,req,res,next){
    return res.status(err.status || 500).json({
        error:{
            message: err.message || 'Oops! Something Went Wrong.'
        }
    })
}



module.exports=errorHandler;