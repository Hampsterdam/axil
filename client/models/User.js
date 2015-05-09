User = {
  info: function() {
    var info = null
    return function(cb) {
      if(info) cb(info)
      services.auth.userInfo()
        .then(function(data) {
          if(data.isAuth){
            info = data
            cb(info)
          } else m.route('/welcome')
        })
    }
  }()
}


