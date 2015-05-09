Explore = {
  controller: function() {
    var ctrl = this
    User.info(function(info) {
      ctrl.css = Explore.stylesheet().classes
      Images.getImages()
      ctrl.images = Images.list
      ctrl.mapContext = {}
      ctrl.filter = {
        radius: 5,
        time: 24
      }

      services.socket.on('mediaInsert', function(image) {
        addMarker(ctrl, image)
      })
    })
    return ctrl
  },
  view: function(ctrl) {
    var attr = {
      explore: {
        class: ctrl.css.explore
      },
      filler: {
        class: ctrl.css.filler
      },
      map: {
        class: ctrl.css.map,
        config: function(element, hasInitialized, context) {
          if(!hasInitialized) {
            initMapConfig(ctrl)
            drawMap(ctrl)
            filter(ctrl, 'distance')
            filter(ctrl, 'time')
            ctrl.mapContext.map.on('move', filter.bind(null, ctrl, 'distance'))
          }
        }
      },
      main: {
        class: ctrl.css.main
      },
      mediaFeed: {
        class: ctrl.css.mediaFeed
      },
      mediacontainer: {
        class: ctrl.css.mediacontainer
      },
      sliderheader: {
        class: ctrl.css.sliderheader
      },
      rangeheader: {
        class: ctrl.css.rangeheader
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
      mediafeeder: {
        class: ctrl.css.mediafeeder
      },
      media: function(uri){
        return {
          class: ctrl.css.media,
          src: uri
        }
      },
      rangeSlider: {
        class: ctrl.css.rangeSlider,
        type: "range",
        max: '50',
        min: '1',
        config: function(element, isInit) {
          if(!isInit) element.value = '5'
        },
        onchange: function(e){
          ctrl.filter.radius = e.currentTarget.value
          filter(ctrl, 'distance')
        }
      },
      timeSlider: {
        class: ctrl.css.rangeSlider,
        type: 'range',
        max: '730.484',
        min: '1',
        config: function(element, isInit) {
          if(!isInit) element.value = '10'
        },
        onchange: function(e) {
          ctrl.filter.time = e.currentTarget.value
          filter(ctrl, 'time')
        }
      }
    }

    return m('div.Explore', attr.explore, [
      NavBar,
      m('div.container', attr.main, [
        m('div#map', attr.map),
        m('div.mediaFeed.col-lg-6 ', attr.mediaFeed, [
          m('div.container-fluid', attr.mediacontainer, [
            
            m('label[for=rangeslider]', attr.rangeheader, 'Range'),
            m('input#rangeslider', attr.rangeSlider),
            m('hr'),

            m('label[for=timeslider]', attr.sliderheader, 'Time Frame'),
            m('input#timeslider', attr.timeSlider),

            m('hr'),

            m('ul.list-unstyled', attr.mediafeeder, [
              ctrl.images().map(function(media){
                // return m('img', attr.media(media.uri))
                return m('li', attr.mediali, [
                  m('div.panel', attr.mediapanel, [ 
                    m('div.panel-header', attr.picpanelheader, [
                      m('img', attr.media(media.uri))
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
  },
  styles: {
    explore: {
      width: '100%',
      height: '100%',
      'background-color': 'f5f5f5',
      'overflow-y': 'auto'
    },
    filler: {
      height: '50px'
    },
    map: {
      top: '50px',
      bottom: '0',
      left: '0',
      float: 'left',
      position: 'absolute',
      width: '60%',

    },
    mediaFeed: {
      top: '50px',
      left: '60%',
      width: '40%',
      height: '100%',
      'text-align': 'center',
      position: 'absolute',
      'overflow-y': 'scroll'
    },
    media: {
      'width': '320px',
      'height': '320px'
    },
    mediacontainer: {
      'margin': '0 auto'
    },
    sliderheader: {
      'margin-bottom': '5px',
      'color': 'rgb(86, 90, 92)'
    },
    rangeheader: {
      'margin-top': '12px',
      'margin-bottom': '5px',
      'color': 'rgb(86, 90, 92)'
    },
    rangeSlider: {
      'width': '20px'
    },
    picpanelheader: {
      'background-color': 'rgb(237, 239, 237)',
      'border-bottom': '1px solid',
      'border-bottom-color': 'rgb(220, 224, 224)',
      // 'padding-bottom': '12px',
      // 'padding-left': '20px',
      // 'padding-right': '20px',
      // 'padding-top': '12px',
      'font-size': '16px',
    },
    mediapanel: {
      'margin-left': 'auto',
      'margin-left': 'auto',
      'width': '322px',
      'background-color': '#fff',
      'border-color': 'rgb(220, 224, 224)',
      'border-radius': '1px',
      'box-sizing': 'border-box',
    },
    mediapanelbody: {
      'width': '322px',
      'text-align': 'left',
      'padding-bottom': '5px',
      'padding-left': '10px',
      'padding-right': '10px',
      'padding-top': '5px'
    },
    mediafeeder: {
      'list-style': 'none',
      'display': 'flex',
      'flex-flow': 'row wrap',
      'justify-content': 'space-around',
      'padding-bottom': '40px'
    },
  },
  stylesheet: function() {
    this._stylesheet || (this._stylesheet = jss.createStyleSheet(this.styles). attach())
    return this._stylesheet
  }
}


function initMapConfig(ctrl) {
  L.mapbox.accessToken = 'pk.eyJ1Ijoic3BpbnRyb25pY3MiLCJhIjoiVURQQUZqayJ9.kEM2RGWKlwnwbRxqfxmCog';
  var map = L.mapbox.map('map', 'examples.map-i86nkdio')
    .setView([30.287829, -97.733374], 12);
  setCrosshair(map)
  ctrl.mapContext.map = map
}

function drawMap(ctrl) {
  if(ctrl.mapContext.markers) ctrl.mapContext.map.removeLayer(ctrl.mapContext.markers)
  ctrl.mapContext.markers = new L.featureGroup()
  ctrl.mapContext.map.addLayer(ctrl.mapContext.markers)
  ctrl.images().map(function(item, dex) {
    addMarker(ctrl, item)
  })
  ctrl.mapContext.markers.addTo(ctrl.mapContext.map)

}

function addMarker(ctrl, mark) {
  var maxWidth = window.innerWidth > window.innerHeight ?
    window.innerHeight
  : window.innerWidth
  var img = document.createElement('DIV')
  img.innerHTML = '<img src="' + mark.uri + '" />'

  var pop = L.popup({
    maxWidth: maxWidth
  })
    .setLatLng([mark.lat, mark.lon])
    .setContent(img)

  var marker = L.marker([mark.lat, mark.lon]).bindPopup(pop)
  marker.options.model = mark
  marker.options.filter = {}
  ctrl.mapContext.markers.addLayer(marker)
}

function filter(ctrl, type) {
  var marks = ctrl.mapContext.markers._layers
  if(type === 'distance') {
    var center = ctrl.mapContext.map.getCenter()
    var metersPerMile = 1609.34
    var radius = ctrl.filter.radius * metersPerMile
    for(var x in marks) {
      if(!marks.hasOwnProperty(x)) continue
      if(marks[x].getLatLng().distanceTo(center) > radius){
        marks[x].options.filter.distance = false
      } else {
        marks[x].options.filter.distance = true
      } 
    }
  } else if(type === 'time') {
    var floor = moment(Date.now()).subtract(ctrl.filter.time, 'h')
    for(var x in marks) {
      if(!marks.hasOwnProperty(x)) continue
      if(moment(marks[x].options.model.time).isAfter(floor)) {
        marks[x].options.filter.time = true
      } else {
        marks[x].options.filter.time = false
      }
    }
  }

  for(var x in marks) {
    var visible = 1
    for(var y in marks[x].options.filter) {
      if(!marks[x].options.filter[y]) visible = 0
    }
    marks[x].clickable = !!visible
    marks[x].setOpacity(visible)
  }
}

  

function setCrosshair(map) {
  var crosshairIcon = L.icon({
    iconUrl: 'assets/img/crosshair.png',
    iconSize: [160, 160],
    iconAnchor: [80, 80]
  })
  crosshair = new L.marker(map.getCenter(), {
    icon: crosshairIcon,
    clickable: false
  })
  crosshair.addTo(map)
  map.on('move', function(e) {
    crosshair.setLatLng(map.getCenter())
  })
}

function metersPerPixel(zoom, lat) {
  return 40075000 * Math.cos(lat) / Math.pow(2, (zoom + 8)) / 2
}


function addFeature(ctrl, map, layer, props) {
  if(!map || !ctrl || !props) returns
  ctrl.mapContext.features.push({
    type: 'Feature',
    geomety: {
      type: 'point',
      coordinates: props.coords
    },
    properties: {
      title: props.title || 'Untitled',
      'marker-color': props.markerColor || '#63d9e6',
      'marker-size': props.markerSize || 'small',
      image: props.image || ''
    }
  })
  layer.setGeoJSON(ctrl.geoJson)
}
