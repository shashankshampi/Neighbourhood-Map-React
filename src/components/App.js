import React, {Component} from 'react';
import LocationList from './LocationList';

class App extends Component {
// listing the state for different places in Bangalore
    constructor(props) {
        super(props);
        this.state = {
            'alllocations': [
                {
                    'name': "Bannerghatta National Park",
                    'type': "National Park",
                    'latitude': 12.800285,
                    'longitude': 77.577047,
                    'streetAddress': "Bannerghatta National Park"
                },
                {
                    'name': "Lalbagh Botanical Garden",
                    'type': "Botanical Garden",
                    'latitude': 12.950743,
                    'longitude': 77.584777,
                    'streetAddress': "Lalbagh Botanical Garden"
                },
                {
                    'name': "Vidhana Soudha",
                    'type': "Government Office",
                    'latitude': 12.979462,
                    'longitude': 77.590909,
                    'streetAddress': "Vidhana Soudha"
                },
                {
                    'name': "Cubbon Park",
                    'type': "Park",
                    'latitude': 12.976347,
                    'longitude': 77.592928,
                    'streetAddress': "Cubbon Park"
                },
                {
                    'name': "Tipu Sultan\'s Summer Palace",
                    'type': "Fort",
                    'latitude': 12.959342,
                    'longitude': 77.573625,
                    'streetAddress': "Tipu Summer Palace"
                },
                {
                    'name': "Visvesvaraya Technological Museum",
                    'type': "Museum",
                    'latitude': 12.975226,
                    'longitude': 77.596345,
                    'streetAddress': "Visvesvaraya Technological Museum"
                },
                {
                    'name': "Jawaharlal Nehru Planetarium",
                    'type': "Planetarium",
                    'latitude': 12.984731,
                    'longitude': 77.589489,
                    'streetAddress': "Jawaharlal Nehru Planetarium"
                },
                {
                    'name': "Bangalore Fort",
                    'type': "Fort",
                    'latitude': 12.962901,
                    'longitude': 77.576046,
                    'streetAddress': "Bangalore Fort"
                },
                {
                    'name': "ISKCON Temple Bangalore",
                    'type': "Temple",
                    'latitude': 13.009833,
                    'longitude': 77.551096,
                    'streetAddress': "ISKCON Temple Bangalore"
                },
                {
                    'name': "Wonderla Bangalore",
                    'type': "Amusement Park",
                    'latitude': 12.834556,
                    'longitude': 77.400972,
                    'streetAddress': "Wonderla Bangalore"
                }
                
            ],
            'map': '',
            'infowindow': '',
            'prevmarker': ''
        };

        // retain object instance when used in the function
        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }

    componentDidMount() {
        window.initMap = this.initMap;
        // Asynchronously load the Google Maps script, passing in the callback reference
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyBe3zAG-R8pBPxA3mbzh24ER1CdT_k_INw&callback=initMap')
    }

    initMap() {
        var self = this;

        var mapview = document.getElementById('map');
        mapview.style.height = window.innerHeight + "px";
        var map = new window.google.maps.Map(mapview, {
            center: {lat: 12.971599, lng: 77.594563},
            zoom: 13,
            mapTypeControl: false
        });

        var InfoWindow = new window.google.maps.InfoWindow({});

        window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            self.closeInfoWindow();
        });

        this.setState({
            'map': map,
            'infowindow': InfoWindow
        });
        
         var alllocations = [];
        this.state.alllocations.forEach(function (location) {
            var longname = location.name + ' - ' + location.type;
            var marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                animation: window.google.maps.Animation.DROP,
                map: map
            });

        window.google.maps.event.addDomListener(window, "resize", function () {
            var center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            self.state.map.setCenter(center);
        });
	//EventListner to close Info Window
        window.google.maps.event.addListener(map, 'click', function () {
            self.closeInfoWindow();
        });

	//EventListner to close Info Window
            marker.addListener('click', function () {
                self.openInfoWindow(marker);
            });

            location.longname = longname;
            location.marker = marker;
            location.display = true;
            alllocations.push(location);
        });
        this.setState({
            'alllocations': alllocations
        });
    }

    openInfoWindow(marker) {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            'prevmarker': marker
        });
        this.state.infowindow.setContent('Loading Data...');
        this.state.map.setCenter(marker.getPosition());
        this.state.map.panBy(0, -200);
        this.getMarkerInfo(marker);
    }

     //collecting Data from Foursquare Website to render on info Window
 
    getMarkerInfo(marker) {
        var self = this;
        var cid = "A0RQGD4P1KEFNMJHHB0THD0H2C51OLRNWU42FN1D2AQD1SU5";
        var sid = "XOUFIOCM2A2XTAM5SSFPT3WBXNHLAL40PTFP3KVGXYZBDMII";
        var url = "https://api.foursquare.com/v2/venues/search?client_id=" + cid + "&client_secret=" + sid + "&v=20180323&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        self.state.infowindow.setContent("Error occured while fetching data");
                        return;
                    }

                    // retriving data from the response obtained
                    response.json().then(function (data) {
                        var data = data.response.venues[0];
                        var rating = '<b>Location Rating: </b>' + data.rating + '<br>';
                        var desc = '<b>Description: </b>' + data.description + '<br>';
                        var usersCount = '<b>Number of Users: </b>' + data.stats.usersCount + '<br>';
                        var urls = '<b>Website: </b>' + data.url + '<br>';
                        var readMore = '<a href="https://foursquare.com/v/'+ data.id +'" target="_blank">Read More</a>'
                        self.state.infowindow.setContent(desc + usersCount + urls + rating + readMore);
                    });
                }
            )
            .catch(function (err) {
                self.state.infowindow.setContent("Fails to Load data. Try Again");
            });
    }

    closeInfoWindow() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            'prevmarker': ''
        });
        this.state.infowindow.close();
    }
	//Rendering the details.
    render() {
        return (
            <div>
                <LocationList key="100" alllocations={this.state.alllocations} openInfoWindow={this.openInfoWindow}
                              closeInfoWindow={this.closeInfoWindow}/>
                <div id="map"></div>
            </div>
        );
    }
}

export default App;
// Error handeling
function loadMapJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("Google Maps can't be loaded");
    };
    ref.parentNode.insertBefore(script, ref);
}

/* Developed and Designed By 
	shashank sanket
*/
