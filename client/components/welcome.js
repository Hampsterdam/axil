Welcome = {
  model: {
    
  },
  controller: function() {
    var ctrl = this
    ctrl.css = Welcome.stylesheet().classes
    

    return ctrl
  },
  view: function(ctrl) {
    var attr = {
      wrapper: {
        class: ctrl.css.wrapper
      },
      temp: {
        class: ctrl.css.temo
      }
    }

    return m('div.Welcome', [

      m(".wrapper", [
        m('div.temp',[
          m('p.welcomep', "Welcome"),
          m('a', {href: '/api/auth/facebook'}, [
            m("button.loginBtn.loginBtn--facebook", attr.fbBtn, "Login with Facebook")

          ])

        ]),
        m('ul.bg-bubbles', [
          m('li.bubble.bubble1'),
          m('li.bubble.bubble2'),
          m('li.bubble.bubble3'),
          m('li.bubble.bubble4'),
          m('li.bubble.bubble5'),
          m('li.bubble.bubble6'),
          m('li.bubble.bubble7'),
          m('li.bubble.bubble8'),
          m('li.bubble.bubble9'),
          m('li.bubble.bubble10'),
          m('li.bubble.bubble11'),
          m('li.bubble.bubble12'),
          m('li.bubble.bubble13'),
          m('li.bubble.bubble14')
        ])
      ])
    ])
  },
  styles: { 

  },
  stylesheet: function() {
    this._stylesheet || (this._stylesheet = jss.createStyleSheet(this.styles). attach())
    return this._stylesheet 
  }
}


