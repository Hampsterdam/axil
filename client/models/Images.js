Images = {
  list: m.prop([]),
  count: 0,
  filter: {},
  liveFeed: [],
  push: function(image) {
    Images.count += 1
    var list = Images.list()
    list.push(image)
    Images.list(list)
  },
  getImages: function(filter) {
    Images.filter = filter
    services.media.getMedia(filter)
    .then(Images.list)
  }

}