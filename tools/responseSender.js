module.exports.success = function success(data, token=-1, message="ok", status=200) {
    if (token == null) {
        return {success: true, 
            message: message, 
            status: status, 
            body: data};
    }
    else {
        return {success: true, 
            message: message, 
            status: status, 
            token: token,
            body: data};
    }
}