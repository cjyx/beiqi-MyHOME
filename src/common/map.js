import Vue from 'vue';
import AMap from 'vue-amap';

Vue.use(AMap);
AMap.initAMapApiLoader({
  key: '1bd3af8a231abac78505cf41097e17f0',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','AMap.Geocoder']
});

