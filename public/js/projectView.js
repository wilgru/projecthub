// Connect to HTML
const mainContentDiv = document.getElementById('main-content-section');
const mapDiv = document.getElementById('map');
const streetAddress = document.getElementById('street_address').textContent.replace('Address: ', '');
const cityAddress = document.getElementById('city_address').textContent.replace('City: ', '');


// Declare Global Variables ---------------------------------
const googleMapsAPIKey = "AIzaSyBZSbspfBXqcmanZk33s7O_cjZnyS3X2r4";
const googleGeocodingAPIKey = "AIzaSyA3xEm83IcSrmNBMoTLR5PQHJ1WZ9Jr6kY";
const domainAPIKey = 'key_fe3c219649342187fcd7449017a171bc';
let map;
// Object has .lat, .long , .address and .touristAttractionsSearchURL variables
const cityGoogleObject = {};
const defaultCityName = 'Sydney';
const domainObject = {};
const defaultCityCoords = { lat: -33.8688, lng: 151.2093 }; // Alice Springs
let cityCoords = {};
let searchCity = streetAddress + ' ' + cityAddress;


// Google API ------------------------------------------------------------

function initMap() {
    // The location of thisCity
    const thisCity = cityCoords;
    // The map, centered at thisCity
    map = new google.maps.Map(mapDiv, {
        zoom: 16,
        center: thisCity,
    });
    // The marker, positioned at thisCity
    const marker = new google.maps.Marker({
        position: thisCity,
        map,
    });

    // Let user get lat and long by double click on map
    map.addListener('dblclick', (mapsMouseEvent) => {
        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
        });
        infoWindow.setContent(
            JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2),
        );
        infoWindow.open(map);
    });

}

function cityGoogleInfo() {
    // https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
    const latLongAPIRequest = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchCity}&key=${googleGeocodingAPIKey}`;

    return fetch(latLongAPIRequest)
        .then((response) => response.json())
        .then((data) => {
            // This is where the data response is-- - console.log(data)
            cityGoogleObject.lat = data.results[0].geometry.location.lat;
            cityGoogleObject.long = data.results[0].geometry.location.lng;
            cityGoogleObject.address = data.results[0].formatted_address;
            cityCoords.lat = cityGoogleObject.lat;
            cityCoords.lng = cityGoogleObject.long;
        });
}

async function init() {

    await cityGoogleInfo();
    await getDomainPropertyID();
    await getDomainLocationID();
    await getDomainInfo();
    window.initMap = initMap;
    // Setup Google maps section
    // Create the script tag, set the appropriate attributes for Initial Google Map. initMap function called.
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsAPIKey}&callback=initMap`;
    script.async = true;
    document.head.appendChild(script);

}

// Domain API   ----------------------------------------------------
// https://api.domain.com.au/v1/properties/RF-8884-AK/priceEstimate 
// `https://api.domain.com.au/v1/properties/_suggest?terms=1%20Smith%20Street%2C%20Smithfield%2C%20NSW&pageSize=20&channel=residential&api_key=${domainAPIKey}`;

function getDomainPropertyID() {
    let domainRequest = `https://api.domain.com.au/v1/properties/_suggest?terms=${searchCity}&pageSize=1&channel=residential&api_key=${domainAPIKey}`;

    return fetch(domainRequest)
        .then((response) => response.json())
        .then((data) => {
            domainObject.propertyID = data[0].id;
            domainObject.addressComponents = data[0].addressComponents;
        });
}

function getDomainLocationID() {
    //https://api.domain.com.au/v1/addressLocators
    //   ?searchLevel=Address&streetNumber=100
    //   &streetName=Harris&streetType=Street
    //   &suburb=Pyrmont&state=NSW&postcode=2009
    let domainRequest = `https://api.domain.com.au/v1/addressLocators
?searchLevel=Address&streetNumber=${domainObject.addressComponents.streetNumber}&streetName=${domainObject.addressComponents.streetName}&streetType=${domainObject.addressComponents.streetType}&suburb=${domainObject.addressComponents.suburb}&state=${domainObject.addressComponents.state}&postcode=${domainObject.addressComponents.postCode}&api_key=${domainAPIKey}`;

    return fetch(domainRequest)
        .then((response) => response.json())
        .then((data) => {
            domainObject.ids = data[0].ids;
            console.log(domainObject.ids);
        });
}

// https://api.domain.com.au/v1/locations/profiles/41352
function getDomainInfo() {
    let domainRequest = `https://api.domain.com.au/v1/locations/profiles/${domainObject.ids[2].id}&api_key=${domainAPIKey}`;

    return fetch(domainRequest)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        });

}
// -------------------------------------------------------

init();
