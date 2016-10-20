module.exports = {
    getFacebookInfo: function (access_token) {

        setUp(access_token);

        function setUp(access_token) {
             graph.setAccessToken(access_token);
         }

        function getFBInfo() {
            var deferred = Q.deferred();
            graph.get("/me?fields=id,name,birthday,gender,hometown,relationship_status,feed.limit(25),photos.limit(25)", function(err, res) {
                if (err) deferred.reject(err);
                deferred.resolve(res);
            });
            return deferred.promise
        }

        function handleResult(result) {
            var deferred = Q.deferred();

            result.posts = result.feed.data
            delete result.feed.data;

            result.photos = result.photos.data
            delete result.photos.data;

            deferred.resolve(result);

            return deferred.promise
        }

        Q.fcall(getFBInfo)
        .then(handleResult)
        .then(function(result) {
            return result;
        })
        .catch(function (error) {
            // Handle any error from all above steps
        })
        .done();
    }
}