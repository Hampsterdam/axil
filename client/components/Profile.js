var Profile = {
  model: {

  },
  controller: function() {
    var ctrl = this
    ctrl.css = Profile.stylesheet().classes

    ctrl.profilepic = m.prop(['https://a1.muscache.com/ic/users/2639552/profile_pic/1382402185/original.jpg?interpolation=lanczos-none&crop=w:w;*,*&crop=h:h;*,*&resize=225:*&output-format=jpg&output-quality=70'])
    ctrl.friendList = m.prop(['john', 'jerry', 'jeff', 'jerome', 'jason', 'jamal',])
    ctrl.mediaList = m.prop([])
    
    services.media.getMedia()
    .then(function(media) {
      ctrl.mediaList(media)
    })

    User.info(function(userinfo) {
      ctrl.id = userinfo.user.passport.user.id
      ctrl.firstname = userinfo.user.passport.user.firstname
      ctrl.lastname = userinfo.user.passport.user.lastname
      ctrl.fullname = ctrl.firstname + ' ' + ctrl.lastname
      ctrl.email = userinfo.user.passport.user.email
      ctrl.location = userinfo.user.passport.user.hometown
      ctrl.reputation = userinfo.user.passport.user.reputation
      ctrl.joined = userinfo.user.passport.user.joined
    })

    ctrl.joinedon = moment(ctrl.joined).format('MMMM Do, YYYY')
 


    return ctrl
  },
  view: function(ctrl) {

    attr = {
      profile: {
        class: ctrl.css.profile,
        // config: slideIn
      },
      filler: {
        class: ctrl.css.filler
      },
      pagecontainer: {
        class: ctrl.css.pagecontainer
      },
      row: {
        class: ctrl.css.row
      },
      main: {
        class: ctrl.css.main
      },
      clearNav: {
        class: ctrl.css.clearNav
      },
      profileInfo: {
        class: ctrl.css.profileInfo
      },
      pic: {
        class: ctrl.css.pic
      },
      friends: {
        class: ctrl.css.friends
      },
      stats: {
        class: ctrl.css.stats
      },
      mediaFeed: {
        class: ctrl.css.mediaFeed
      },
      media: {
        class: ctrl.css.media
      },
      panelheader: {
        class: ctrl.css.panelheader
      },
      picpanelheader: {
        class: ctrl.css.picpanelheader
      },
      panelbody: {
        class: ctrl.css.panelbody
      },
      mediapanel: {
        class: ctrl.css.mediapanel
      },
      mediapanelbody: {
        class: ctrl.css.mediapanelbody
      },
      image: {
        class: ctrl.css.image
      },
      cardstats: {
        class: ctrl.css.cardstats
      },
      repstat: {
        class: ctrl.css.repstat
      },
      followers: {
        class: ctrl.css.followers,
        config: m.route,
        href: '/followers'
      },
      following: {
        class: ctrl.css.following,
        config: m.route,
        href: '/following'
      },
      statstrong: {
        class: ctrl.css.statstrong
      },
      profileicon: {
        class: ctrl.css.profileicon
      },
      statlist: {
        class: ctrl.css.statlist
      },
      follow: {
        class: ctrl.css.follow
      },
      followdiv: {
        class: ctrl.css.followdiv
      }
    }


    return m('div#profile', attr.profile, [
      NavBar,
      m('div', attr.filler),

      m('div.page-container.page-container-responsive.row-space-top-4.row-space-8', attr.pagecontainer, [
        m('div.row', attr.row, [
          m('div.col-lg-2.col-md-3', attr.side, [
            m('div.row-space-4.user', attr.pic, [
              m("img[src=http://i.imgur.com/TsC4Hrp.jpg]")
            ]),
            m('div.panel.row-space-4.', attr.stats, [
              m('div.panel-header', attr.panelheader, ctrl.fullname),
              m('div.panel-body', attr.panelbody, [
                m('ul.list-unstyled', [
                  m('li', attr.statlist, m('i.glyphicon glyphicon-map-marker', attr.profileicon), ctrl.location),
                  m('li', attr.statlist, m('i.envelope.glyphicon glyphicon-envelope', attr.profileicon), ctrl.email),
                  m('li', attr.statlist, m('i.glyphicon glyphicon-calendar', attr.profileicon), 'Joined on ' + ctrl.joinedon),
                ]),
                m('hr'),
                m('div.vcard-stats', attr.cardstats, [
                  // m('a.vcard-stat', attr.repstat, [
                  //   m('strong.v-card-stat-count', attr.statstrong, ctrl.reputation),
                  //   m('br'),
                  //   m('span.text-muted', 'Reputation')
                  // ]),
                  // m('br'),
                  // m('br'),
                  m('a.vcard-stat', attr.followers, [
                    m('strong.v-card-stat-count', attr.statstrong, '15'),
                    m('br'),
                    m('span.text-muted', 'Followers')
                  ]),
                  m('br'),
                  m('br'),
                  m('a.vcard-stat', attr.following, [
                    m('strong.v-card-stat-count', attr.statstrong, '17'),
                    m('br'),
                    m('span.text-muted', 'Following')
                  ]),
                ]),
                m('div', attr.followdiv, [
                  m('button.follow.btn.btn-default.btn-lg', attr.follow, 'Follow'), 
                ])
              ])
            ]),
            // m('div.panel.row-space-4.hidden-xs.hidden-sm', attr.friends, [
            //   m('div.panel-header', attr.panelheader, 'Friends'),
            //   m('div.panel-body', attr.panelbody, [
            //     m('ul.list-unstyled', [
            //       ctrl.friendList().map(function(friend) {
            //         return m('li.friend', friend)
            //       })
            //     ])
            //   ])
            // ]),
          ]),
          m('div.col-lg-10.col-md-9.col-sm-12', attr.main, [
            m('div.container-fluid', [
              m('ul.list-unstyled', attr.mediaFeed, [
                ctrl.mediaList().map(function(media, dex) {
                  if(dex > 10) return
                  return m('li', attr.media, [
                    m('div.panel', attr.mediapanel, [ 
                      m('div.panel-header', attr.picpanelheader, [
                        m('img', attr.image, {src: media.uri})
                      ]),
                      m('div.panel-body', attr.mediapanelbody, [
                        m('div', 'April 20 at 4:20PM by Zach'),
                        m('div', 'Tags: #atx')
                      ])
                    ])
                  ])
                })
              ])
            ])
          ])
        ])
      ])
    ])
  },
  styles: {
    profile: {
      height: '100%',
      width: '100%',
      'background-color': '#f5f5f5',
      'color': '#565a5c',
      'overflow-y': 'auto'
    },
    filler: {
      // height: '50px'
    },
    stats: {
      'background-color': '#fff',
      'border-color': 'rgb(220, 224, 224)',
      'border-radius': '1px',
      'box-sizing': 'border-box',
      'width': '228px'
    },
    friends: {
      'background-color': '#fff',
      'border-color': 'rgb(220, 224, 224)',
      'border-radius': '1px',
      'box-sizing': 'border-box',
      'width': '228px'
    },
    panelheader: {
      'background-color': 'rgb(237, 239, 237)',
      'border-bottom': '1px solid',
      'border-bottom-color': 'rgb(220, 224, 224)',
      'padding-bottom': '12px',
      'padding-left': '25px',
      'padding-right': '20px',
      'padding-top': '12px',
      'font-size': '18px',
      'font-weight': '500'
    },
    picpanelheader: {
      'background-color': 'rgb(237, 239, 237)',
      'border-bottom': '1px solid',
      'border-bottom-color': 'rgb(220, 224, 224)',
      // 'padding-bottom': '12px',
      // 'padding-left': '20px',
      // 'padding-right': '20px',
      // 'padding-top': '12px',
      'font-size': '16px'
    },
    panelbody: {
      'padding-bottom': '20px',
      'padding-left': '20px',
      'padding-right': '20px',
      'padding-top': '20px'
    },
    profileInfo: {
      'background-color': '#eee'
    },
    pic: {
      'margin-bottom': '25px'
    },
    mediaFeed: {
      'list-style': 'none',
      'display': 'flex',
      'flex-flow': 'row wrap',
      'justify-content': 'space-around'
    },
    media: {
      'margin-bottom': '15px',
      'margin-left': '7.5px',
      'margin-right': '7.5px'
    },
    mediapanel: {
      'background-color': '#fff',
      'border-color': 'rgb(220, 224, 224)',
      'border-radius': '1px',
      'box-sizing': 'border-box',
    },
    mediapanelbody: {
      'padding-bottom': '5px',
      'padding-left': '10px',
      'padding-right': '10px',
      'padding-top': '5px'
    },
    pagecontainer: {
      'box-sizing': 'border-box',
      'display': 'block',
      'margin-top': '35px',
      'margin-bottom': '50px',
      'margin-left': '5%',
      'margin-right': '5%'
    },
    row: {
      'margin-left': '-12.5px',
      'margin-right': '-12.5px'
    },
    main: {
      'padding-left': '40px'
    },
    image: {
      'width': '320px',
      'height': 'auto'
    },
    cardstats: {
      'display': 'block',
      'text-align': 'center'
    },
    repstat: {
      'vertical-align': 'left',
      'horizontal-align': 'center',
      'pointer-events': 'none',
      'line-height': '130%'
    },
    followers: {
      'vertical-align': 'left',
      'line-height': '130%'
    },
    following: {
      'vertical-align': 'left',
      'line-height': '130%'
    },
    statstrong: {
      'font-size': '22px'
    },
    profileicon: {
      'padding-right': '5px',
      'padding-top': '5px'
    },
    statlist: {
      'padding-bottom': '5px'
    },
    follow: {
      'margin-top': '20px',

    },
    followdiv: {
      'text-align': 'center'
    }
  },
  stylesheet: function() {
    this._stylesheet || (this._stylesheet = jss.createStyleSheet(this.styles). attach())
    return this._stylesheet
  }
}



