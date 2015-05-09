var services = {
  media: {
    getMedia: function() {
      return m.request({
        method: 'GET',
        url: '/api/media'
      })
    },
    addMedia: function() {
      var result = m.deferred()
      m.request({
        method: 'POST',
        url: '/api/media'
      }).then(function(res) {
        result.resolve(res)
      })
      return result.promise
    },
    removeMedia: function() {
      var result = m.deferred()
      m.request({
        method: 'DELETE',
        url: '/api/media/' + media_id
      }).then(function(res) {
        result.resolve(res)
      })
      return result.promise
    },
    likeMedia: function(media) {
      var result = m.deferred()
      m.request({
        method: 'PUT',
        url: '/api/media',
        data: media
      }).then(function(res) {
        result.resolve(res)
      })
      return result.promise
    },
    getMediaByFilter: function(opt){
      var result = m.deferred()
      m.request({
        method: 'GET',
        url: '/api/media/filter?type='+ opt.type +'&lat='+ opt.lat +'&lon='+ opt.lon +'&range=' + opt.range
      }).then(function(res) {
        result.resolve(res)
      })
      return result.promise
    }
  },
  users: {
    getAllUsers: function() {
      var result = m.deferred()
      m.request({
        method: 'GET',
        url: '/api/users'
      }).then(function(res) {
        result.resolve(res)
      })
      return result.promise
    },
    addUser: function(user) {
      var result = m.deferred()
      m.request({
        method: 'POST',
        url: '/api/users',
        data: user
      }).then(function(res) {
        result.resolve(res)
      })
      return result.promise
    },
    getUser: function(user_id) {
      var result = m.deferred()
      m.request({
        method: 'GET',
        url: '/api/users',
        data: user_id
      }).then(function(res) {
        result.resolve(res)
      })
      return result.promise
    },
    getUserMedia: function(user) {
      var result = m.deferred()
      m.request({
        method: 'GET',
        url: '/api/media',
        data: 'user'
      }).then(function(res) {
        result.resolve(res)
      })
      return result.promise
    },

    getUserInfo: function() {
      var result = m.deferred()
      m.request({
        method: 'GET',
        url: '/api/userinfo'
      }).then(function(res) {
        result.resolve(res)
      })
      return result.promise
    },

    getFriends: function(user_id) {
      var result = m.deferred()
      m.request({
        method: 'GET',
        url: '/api/friends',
        data: user_id
      }).then(function(res) {
        result.resolve(res)
      })
      return result.promise
    },
    addFriend: function(user_id, friend_id) {
      var result = m.deferred()
      m.request({
        method: 'POST',
        url: '/api/friends',
        data: {
          user_id: user_id,
          friend_id: friend_id
        }
      }).then(function(res) {
        result.resolve(res)
      })
      return result.promise
    },
    deleteFriend: function(user_id, friend_id) {
      var result = m.deferred()
      m.request({
        method: 'DELETE',
        url: '/api/friends',
        data: {
          user_id: user_id,
          friend_id: friend_id
        }
      }).then(function(res) {
        result.resolve(res)
      })
      return result.promise
    },
  },
  maps: {
    getCity: function(position) {
      var result = m.deferred()
      m.request({
        method: 'GET',
        url: '//maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + "," + position.coords.longitude
      }).then(function(res) {
        result.resolve(res)
      })
      return result.promise
    }
  },
  tags: {
    addTag: function(data) {
      var result = m.deferred()
      m.request({
        method: 'PUT',
        url: '/api/tags',
        data: data
      }).then(function(res) {
        result.resolve(res)
      })
      return result.promise
    },
    getTag: function(tag) {
      var result = m.deferred()
      m.request({
        method: 'GET',
        url: '/api/tags'
      }).then(function(res) {
        result.resolve(res)
      })
      return result.promise
    }
  },
  auth: {
    fbAuth: function() {
      return m.request({
        method: 'GET',
        url: '/api/auth/facebook'
      })
    },
    userInfo: function() {
      return m.request({
        method: 'GET',
        url: '/api/auth/userinfo'
      })      
    },
    logout: function() {
      return m.request({
        method: 'get',
        url: '/api/auth/logout'
      })
    }
  },
  socket: io()
}
