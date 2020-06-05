module.exports.success = function success(data, message="ok", status=200) {
    return {success: true, 
        message: message, 
        status: status, 
        body: data};
}