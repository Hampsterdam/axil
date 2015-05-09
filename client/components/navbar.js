NavBar = {
  model: {

  },
  controller: function() {
    var ctrl = this
    ctrl.css = NavBar.stylesheet().classes
    return ctrl
  },
  view: function(ctrl) {
    var attr = {
      navbar: {
        class: ctrl.css.explore
      },
      navbarheader: {
        class: ctrl.css.navbarheader
      },
      header: {
        class: ctrl.css.header
      },
      logo: {
        class: ctrl.css.logo,
        // config: fadeOut('profile'),
      },
      searchbar: {
        class: ctrl.css.searchbar
      },
      ul: {
        class: ctrl.css.ul
      },
      ulright: {
        class: ctrl.css.ulright
      },
      li: {
        class: ctrl.css.li
      },
      liright: {
        class: ctrl.css.liright
      },
      profileButton: {
        class: ctrl.css.profileButton
      },
      mapButton: {
        class: ctrl.css.mapButton,
      },
      mapButtonAnchor: {
        config: m.route,
        href: '/explore'
      }
    }

    return m('div.NavBar', attr.navbar, [
      m('nav.navbar-fixed-top', attr.navbarheader, [
        m('div.container-fluid', [
          m('ul', attr.ul, [
            m('li', attr.li, [
              m('a', attr.logoLink, [
                m('img.logo[src=style/logo-blue.png]', attr.logo)
              ])
            ]),  
            m('li', [
              m('div.inner-addon.left-addon.col-xs-4', [
                m('i.glyphicon glyphicon-search'),
                m('input.form-control', attr.searchbar)
              ])
            ]),

            m('li.dropdown', attr.liright, [
                  m("a.dropdown-toggle[aria-expanded='true'][data-toggle='dropdown'][id='dropdownMenu1'][role='button]", [ 
                    m("i.glyphicon glyphicon-user", attr.profileButton)
                  ]),
                  m("ul.dropdown-menu.dropdown-menu-right[aria-labelledby='dropdownMenu1'][role='menu']", [
                    m("li[role='presentation']", [m("a[href='/#/profile'][role='menuitem'][tabindex='-1']", "My Profile")]),
                    m("li[role='presentation']", [m("a[href='/#/followers'][role='menuitem'][tabindex='-1']", "Followers")]),
                    m("li[role='presentation']", [m("a[href='/#/following'][role='menuitem'][tabindex='-1']", "Following")]),
                    m("li[role='presentation'].divider"),
                    m("li[role='presentation']", [m("a[href='/#/welcome'][role='menuitem'][tabindex='-1']", "Logout")])
                  ]),
                
            ]),
            m('li', attr.liright, [
              m('a', attr.mapButtonAnchor, [
                m('i.glyphicon glyphicon-map-marker', attr.mapButton)  
              ])
            ]), 
          ])
        ])
      ])
    ]);
  },
  styles: {
      navbar :{

      },
      navbarheader: {
        'border-bottom': '1px solid #dce0e0',
        'background-color': '#ffffff',
        'color': '#565a5c',
        'height': '50px'        
      },
      logo: {
        'margin-left': '-30px',
        'margin-top': '11px',
        'margin-bottom': '11px'
      },
      searchbar: {
        'margin-top': '8px',
        'margin-bottom': '8px',
        'margin-left': '20px',
      },
      ul: {
        'list-style-type': 'none',
      },
      ulright: {
        'list-style-type': 'none',
        'overflow': 'hidden',
        'float': 'right'
      },
      li: {
        'float': 'left'
      },
      liright: {
        'float': 'right'
      },
      profileButton: {
        'margin-top': '10px',
        'margin-right': '10px',
        'font-size': '2em',
        'color': '#4dccdb'
      },
      mapButton: {
        'margin-top': '10px',
        'margin-right': '20px',
        'font-size': '2em',
        'color': '#4dccdb'
      }

  },
  stylesheet: function() {
    this._stylesheet || (this._stylesheet = jss.createStyleSheet(this.styles). attach())
    return this._stylesheet 
  }
}


