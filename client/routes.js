var slidingPage = M.animator( slideIn, slideOut );
var fadingPage = M.animator( fadeIn, fadeOut )


m.route.mode = "hash"
m.route(document.body, '/', {
  '/': Profile,
  '/profile': Profile,
  '/explore': Explore,
  '/followers': Followers,
  '/following': Following,
  '/welcome': Welcome
})

