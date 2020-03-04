module.exports.success = function success(result, message="ok", status=200) {
    return {success: true, message: message, status: status, data: result};
}