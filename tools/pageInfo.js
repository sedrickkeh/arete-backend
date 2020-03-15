module.exports.page = function success(result, page_num, per_page, doc_count) {
    return {page_num: page_num, 
        per_page: per_page, 
        num_pages: Math.floor(doc_count/per_page) + (doc_count % per_page !== 0),
        data: result};
}