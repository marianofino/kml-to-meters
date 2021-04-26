const parseKML = require('parse-kml')
const geolib = require('geolib')
 
let markers = []

let path = process.argv[2]
let height = process.argv[3]

if (!path)
  return console.error('Please, provide a path to a KML file.')

if (!height)
  height = 0

parseKML
  .toJson(path)
  .then((kml) => {

    for (f of kml.features) {
      markers.push({
        latitude: f.geometry.coordinates[1],
        longitude: f.geometry.coordinates[0]
      })
    }

    let bounds = geolib.getBounds(markers)
    let corner = { latitude: bounds.maxLat, longitude: bounds.minLng }

    for (m of markers) {
      let x = geolib.getPreciseDistance({ latitude: m.latitude, longitude: corner.longitude }, m)
      let y = geolib.getPreciseDistance({ latitude: corner.latitude, longitude: m.longitude }, m)
      m.x = x
      m.y = y
    }

    for (m of markers) {
      console.log(m.x + ',' + m.y + ',' + height)
    }

  })
  .catch(console.error);
