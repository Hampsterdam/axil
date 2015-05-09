Followers = {
  model: {

  },
  controller: function() {
    ctrl = this
    User.info(function(info) {
      ctrl.css = Followers.stylesheet().classes
      ctrl.friendsList = m.prop(['a','b','c','d', 'a','b','c','d', 'a','b','c','d', 'a','b','c','d'])
    })
    return ctrl
  },
  view: function(ctrl) {
    var attr = {
      followers: {
        class: ctrl.css.followers
        // config: fadeIn
      },
      filler: {
        class: ctrl.css.filler
      },
      logo: {
        class: ctrl.css.logo,
        // config: fadeOut('friends'),
        config: m.route,
        href: '/profile'
      },
      friendsList: {
        class: ctrl.css.friendsList
      },
      friend: {
        class: ctrl.css.friend
      },
      main: {
        class: ctrl.css.main
      }
    }

    return m('div#followers', attr.followers, [
      NavBar,
      m('div', attr.filler),
      m('div.container-fluid', attr.main, [
        m('ul.friendsList', attr.friendsList,[
          ctrl.friendsList().map(function(friend) {
            return m('li.friend', {style:{ backgroundColor: randomColor(), height: '200px', width: '200px', margin: '20px' } }, friend)
          })
        ])
      ])
    ])
  },
  styles: {
    followers: {      
      height: '100%',
      width: '100%',
      'overflow-y': 'scroll'
    },
    filler: {
      // 'height': '50px'
    },
    friendsList: {
      'list-style': 'none',
      display: 'flex',
      'flex-flow': 'row wrap',
      'justify-content': 'space-around'
    },
    friend: {
      height: '200px',
      width: '200px'
    }
  },
  stylesheet: function() {
    this._stylesheet || (this._stylesheet = jss.createStyleSheet(this.styles). attach())
    return this._stylesheet
  }
}
