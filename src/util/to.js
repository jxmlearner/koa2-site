// 参考：https://blog.csdn.net/itKingOne/article/details/80608798
// https://blog.csdn.net/itKingOne/article/details/72235998
module.exports = (promise) => {
    if (!promise || !Promise.prototype.isPrototypeOf(promise)) {
        return new Promise((resolve, reject) => {
            reject(new Error("requires promises as the param"))
        }).catch((err) => {
            return [err, null]
        })
    }
    return promise.then(function () {
        return [null, ...arguments]
    }).catch(err => {
        return [err, null]
    })
}
