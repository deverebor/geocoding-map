<template>
  <div class="h-screen relative">
    <GeoErrorModal
      v-if="geoError"
      :geoErrorMsg="geoErrorMsg"
      @closeGeoError="closeGeoError"
    />
    <MapFeatures
      :fetchCoords="fetchCoords"
      :coords="coords"
      @toggleSearchResults="toggleSearchResults"
      @getGeolocation="getGeolocation"
      @plotResult="plotResult"
      @removeResult="removeResult"
      :searchResults="searchResults"
      class="w-full md:w-auto absolute md:top-[40px] md:left-[60px] z-[2]"
    />
    <div id="mapid" class="h-full z-[1]"></div>
  </div>
</template>

<script lang="ts">
import leaflet from "leaflet";
import { onMounted, ref } from "vue";
import GeoErrorModal from "../components/GeoErrorModal.vue";
import MapFeatures from "../components/MapFeatures.vue";

export default {
  name: "Home",
  components: { GeoErrorModal, MapFeatures },
  setup() {
    let map;
    onMounted(() => {
      map = leaflet
        .map("mapid", {
          zoomControl: false,
        })
        .setView([28.538336, -81.379234], 10);

      leaflet
        .tileLayer(
          `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.VUE_APP_API_KEY}`,
          {
            maxZoom: 18,
            id: "mapbox/streets-v11",
            tileSize: 512,
            zoomOffset: -1,
            accessToken: process.env.VUE_APP_API_KEY,
          }
        )
        .addTo(map);

      map.on("moveend", () => {
        closeSearchResults();
      });

      getGeolocation();
    });

    const coords = ref(null);
    const fetchCoords = ref(null);
    const geoMarker = ref(null);
    const geoError = ref(null);
    const geoErrorMsg = ref(null);

    const getGeolocation = () => {
      if (!coords.value) {
        if (sessionStorage.getItem("coords")) {
          coords.value = JSON.parse(sessionStorage.getItem("coords"));
          plotGeoLocation(coords.value);
          return;
        }

        fetchCoords.value = true;
        navigator.geolocation.getCurrentPosition(setCoords, getLocError);
        return;
      }

      coords.value = null;
      sessionStorage.removeItem("coords");
      map.removeLayer(geoMarker.value);
    };

    const setCoords = (pos) => {
      fetchCoords.value = null;

      const setSessionCoords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      sessionStorage.setItem("coords", JSON.stringify(setSessionCoords));

      coords.value = setSessionCoords;

      plotGeoLocation(coords.value);
    };

    const getLocError = (error) => {
      fetchCoords.value = null;
      geoError.value = true;
      geoErrorMsg.value = error.message;
    };

    const plotGeoLocation = (coords) => {
      const customMarker = leaflet.icon({
        iconUrl: require("../assets/map-marker-red.svg"),
        iconSize: [35, 35],
      });

      geoMarker.value = leaflet
        .marker([coords.lat, coords.lng], { icon: customMarker })
        .addTo(map);

      map.setView([coords.lat, coords.lng], 10);
    };

    const resultMarker = ref(null);
    const plotResult = (coords) => {
      if (resultMarker.value) {
        map.removeLayer(resultMarker.value);
      }
      const customMarker = leaflet.icon({
        iconUrl: require("../assets/map-marker-blue.svg"),
        iconSize: [35, 35],
      });
      resultMarker.value = leaflet
        .marker([coords.coordinates[1], coords.coordinates[0]], { icon: customMarker })
        .addTo(map);
      map.setView([coords.coordinates[1], coords.coordinates[0]], 13);
    };

    const removeResult = () => {
      map.removeLayer(resultMarker.value);
    };

    const closeGeoError = () => {
      geoErrorMsg.value = null;
      geoError.value = null;
    };

    const searchResults = ref(null);
    const toggleSearchResults = () => {
      searchResults.value = !searchResults.value;
    };
    const closeSearchResults = () => {
      searchResults.value = null;
    };

    return {
      geoError,
      closeGeoError,
      geoErrorMsg,
      fetchCoords,
      coords,
      getGeolocation,
      plotResult,
      searchResults,
      toggleSearchResults,
      closeSearchResults,
      removeResult,
    };
  },
};
</script>
