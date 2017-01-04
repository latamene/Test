











// Cet exemple affiche un formulaire d'adresse, à l'aide de la fonction de saisie semi-automatique
// de l'API Google Places pour aider les utilisateurs à remplir les informations.

var placeSearch, autocomplete;
var componentForm = {
  //street_number: 'short_name',
  //route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  //postal_code: 'short_name'
};



function initAutocomplete() {
 // Create the autocomplete object, restricting the search to geographical
 // location types.
 var options = {
  types: ['geocode'],
  componentRestrictions: {country: 'fr'}
};
 autocomplete = new google.maps.places.Autocomplete(
     /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
     options);

 // When the user selects an address from the dropdown, populate the address
 // fields in the form.
 autocomplete.addListener('place_changed', fillInAddress);
}

// [START region_fillform]
function fillInAddress() {
  // Obtenir les détails de l'objet de saisie semi-automatique.
  var place = autocomplete.getPlace();

  for (var component in componentForm) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  // Obtenir chaque composant de l'adresse à partir des détails de l'emplacement
  // et remplissez le champ correspondant sur le formulaire.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
}
// [END region_fillform]

// [START region_geolocation]
// Bias l'objet de saisie semi-automatique à l'emplacement géographique de l'utilisateur,
// fourni par l'objet 'navigator.geolocation' du navigateur.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}
// [END region_geolocation]

