'use strict';
Object.defineProperty(exports, '__esModule', { value: !0 });
var vue = require('vue');
let mapSymbol = Symbol('map'),
  apiSymbol = Symbol('api'),
  mapWasLoadedSymbol = Symbol('mapwasloaded'),
  loaderInstance = vue.ref(null),
  polylineEvents =
    'click dblclick drag dragend dragstart mousedown mousemove mouseout mouseover mouseup rightclick'.split(' ');
var fastDeepEqual = function equal(a, b) {
  if (a === b) return !0;
  if (a && b && 'object' == typeof a && 'object' == typeof b) {
    if (a.constructor !== b.constructor) return !1;
    var d;
    if (Array.isArray(a)) {
      var c = a.length;
      if (c != b.length) return !1;
      for (d = c; 0 !== d--; ) if (!equal(a[d], b[d])) return !1;
      return !0;
    }
    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
    var f = Object.keys(a);
    c = f.length;
    if (c !== Object.keys(b).length) return !1;
    for (d = c; 0 !== d--; ) if (!Object.prototype.hasOwnProperty.call(b, f[d])) return !1;
    for (d = c; 0 !== d--; ) if (((c = f[d]), !equal(a[c], b[c]))) return !1;
    return !0;
  }
  return a !== a && b !== b;
};
let DEFAULT_ID = '__googleMapsScriptId';
class Loader {
  constructor({
    apiKey: a,
    channel: b,
    client: e,
    id: d = DEFAULT_ID,
    libraries: c = [],
    language: f,
    region: g,
    version: k,
    mapIds: l,
    nonce: m,
    retries: h = 3,
    url: n = 'https://maps.googleapis.com/maps/api/js',
  }) {
    this.CALLBACK = '__googleMapsCallback';
    this.callbacks = [];
    this.loading = this.done = !1;
    this.errors = [];
    this.version = k;
    this.apiKey = a;
    this.channel = b;
    this.client = e;
    this.id = d || DEFAULT_ID;
    this.libraries = c;
    this.language = f;
    this.region = g;
    this.mapIds = l;
    this.nonce = m;
    this.retries = h;
    this.url = n;
    if (Loader.instance) {
      if (!fastDeepEqual(this.options, Loader.instance.options))
        throw Error(
          `Loader must not be called again with different options. ${JSON.stringify(this.options)} !== ${JSON.stringify(
            Loader.instance.options
          )}`
        );
      return Loader.instance;
    }
    Loader.instance = this;
  }
  get options() {
    return {
      version: this.version,
      apiKey: this.apiKey,
      channel: this.channel,
      client: this.client,
      id: this.id,
      libraries: this.libraries,
      language: this.language,
      region: this.region,
      mapIds: this.mapIds,
      nonce: this.nonce,
      url: this.url,
    };
  }
  get failed() {
    return this.done && !this.loading && this.errors.length >= this.retries + 1;
  }
  createUrl() {
    let a = this.url;
    a += `?callback=${this.CALLBACK}`;
    this.apiKey && (a += `&key=${this.apiKey}`);
    this.channel && (a += `&channel=${this.channel}`);
    this.client && (a += `&client=${this.client}`);
    0 < this.libraries.length && (a += `&libraries=${this.libraries.join(',')}`);
    this.language && (a += `&language=${this.language}`);
    this.region && (a += `&region=${this.region}`);
    this.version && (a += `&v=${this.version}`);
    this.mapIds && (a += `&map_ids=${this.mapIds.join(',')}`);
    return a;
  }
  deleteScript() {
    let a = document.getElementById(this.id);
    a && a.remove();
  }
  load() {
    return this.loadPromise();
  }
  loadPromise() {
    return new Promise((a, b) => {
      this.loadCallback((e) => {
        e ? b(e.error) : a(window.google);
      });
    });
  }
  loadCallback(a) {
    this.callbacks.push(a);
    this.execute();
  }
  setScript() {
    if (document.getElementById(this.id)) this.callback();
    else {
      var a = this.createUrl(),
        b = document.createElement('script');
      b.id = this.id;
      b.type = 'text/javascript';
      b.src = a;
      b.onerror = this.loadErrorCallback.bind(this);
      b.defer = !0;
      b.async = !0;
      this.nonce && (b.nonce = this.nonce);
      document.head.appendChild(b);
    }
  }
  reset() {
    this.deleteScript();
    this.loading = this.done = !1;
    this.errors = [];
    this.onerrorEvent = null;
  }
  resetIfRetryingFailed() {
    this.failed && this.reset();
  }
  loadErrorCallback(a) {
    this.errors.push(a);
    this.errors.length <= this.retries
      ? ((a = this.errors.length * Math.pow(2, this.errors.length)),
        console.log(`Failed to load Google Maps script, retrying in ${a} ms.`),
        setTimeout(() => {
          this.deleteScript();
          this.setScript();
        }, a))
      : ((this.onerrorEvent = a), this.callback());
  }
  setCallback() {
    window.__googleMapsCallback = this.callback.bind(this);
  }
  callback() {
    this.done = !0;
    this.loading = !1;
    this.callbacks.forEach((a) => {
      a(this.onerrorEvent);
    });
    this.callbacks = [];
  }
  execute() {
    this.resetIfRetryingFailed();
    this.done
      ? this.callback()
      : window.google && window.google.maps && window.google.maps.version
      ? (console.warn(
          'Google Maps already loaded outside @googlemaps/js-api-loader.This may result in undesirable behavior as options and script parameters may not match.'
        ),
        this.callback())
      : this.loading || ((this.loading = !0), this.setCallback(), this.setScript());
  }
}
let mapEvents =
  'bounds_changed center_changed click dblclick drag dragend dragstart heading_changed idle maptypeid_changed mousemove mouseout mouseover projection_changed resize rightclick tilesloaded tilt_changed zoom_changed'.split(
    ' '
  );
var _sfc_main$1 = vue.defineComponent({
  props: {
    apiKey: { type: String, default: '' },
    version: { type: String, default: 'weekly' },
    libraries: { type: Array, default: () => ['places'] },
    region: { type: String, required: !1 },
    language: { type: String, required: !1 },
    backgroundColor: { type: String, required: !1 },
    center: { type: Object, default: () => ({ lat: 0, lng: 0 }) },
    clickableIcons: { type: Boolean, required: !1, default: void 0 },
    controlSize: { type: Number, required: !1 },
    disableDefaultUi: { type: Boolean, required: !1, default: void 0 },
    disableDoubleClickZoom: { type: Boolean, required: !1, default: void 0 },
    draggable: { type: Boolean, required: !1, default: void 0 },
    draggableCursor: { type: String, required: !1 },
    draggingCursor: { type: String, required: !1 },
    fullscreenControl: { type: Boolean, required: !1, default: void 0 },
    fullscreenControlPosition: { type: String, required: !1 },
    gestureHandling: { type: String, required: !1 },
    heading: { type: Number, required: !1 },
    keyboardShortcuts: { type: Boolean, required: !1, default: void 0 },
    mapTypeControl: { type: Boolean, required: !1, default: void 0 },
    mapTypeControlOptions: { type: Object, required: !1 },
    mapTypeId: { type: [Number, String], required: !1 },
    maxZoom: { type: Number, required: !1 },
    minZoom: { type: Number, required: !1 },
    noClear: { type: Boolean, required: !1, default: void 0 },
    panControl: { type: Boolean, required: !1, default: void 0 },
    panControlPosition: { type: String, required: !1 },
    restriction: { type: Object, required: !1 },
    rotateControl: { type: Boolean, required: !1, default: void 0 },
    rotateControlPosition: { type: String, required: !1 },
    scaleControl: { type: Boolean, required: !1, default: void 0 },
    scaleControlStyle: { type: Number, required: !1 },
    scrollwheel: { type: Boolean, required: !1, default: void 0 },
    streetView: { type: Object, required: !1 },
    streetViewControl: { type: Boolean, required: !1, default: void 0 },
    streetViewControlPosition: { type: String, required: !1 },
    styles: { type: Array, required: !1 },
    tilt: { type: Number, required: !1 },
    zoom: { type: Number, required: !1 },
    zoomControl: { type: Boolean, required: !1, default: void 0 },
    zoomControlPosition: { type: String, required: !1 },
  },
  emits: mapEvents,
  setup(a, { emit: b }) {
    let e = vue.ref(null),
      d = vue.ref(!1),
      c = vue.ref(null),
      f = vue.ref(null),
      g = vue.ref(!1);
    vue.provide(mapSymbol, c);
    vue.provide(apiSymbol, f);
    vue.provide(mapWasLoadedSymbol, g);
    let k = () => {
        const b = { ...a };
        Object.keys(b).forEach((a) => {
          void 0 === b[a] && delete b[a];
        });
        var c = (a) => {
          var b;
          return a ? { position: null === (b = f.value) || void 0 === b ? void 0 : b.ControlPosition[a] } : {};
        };
        c = {
          scaleControlOptions: a.scaleControlStyle ? { style: a.scaleControlStyle } : {},
          panControlOptions: c(a.panControlPosition),
          zoomControlOptions: c(a.zoomControlPosition),
          rotateControlOptions: c(a.rotateControlPosition),
          streetViewControlOptions: c(a.streetViewControlPosition),
          fullscreenControlOptions: c(a.fullscreenControlPosition),
          disableDefaultUI: a.disableDefaultUi,
        };
        return { ...b, ...c };
      },
      l = vue.watch(
        [f, c],
        ([a, b]) => {
          a &&
            b &&
            (a.event.addListenerOnce(b, 'tilesloaded', () => {
              g.value = !0;
            }),
            setTimeout(l, 0));
        },
        { immediate: !0 }
      ),
      m = () => {
        try {
          const { apiKey: b, region: c, version: d, language: e, libraries: f } = a;
          loaderInstance.value = new Loader({ apiKey: b, region: c, version: d, language: e, libraries: f });
        } catch (h) {
          console.error(h);
        }
      };
    vue.onMounted(() => {
      m();
      loaderInstance.value.load().then(() => {
        f.value = google.maps;
        c.value = new google.maps.Map(e.value, k());
        mapEvents.forEach((a) => {
          var d;
          null === (d = c.value) || void 0 === d ? void 0 : d.addListener(a, (c) => b(a, c));
        });
        d.value = !0;
        let h = Object.keys(a)
          .filter((a) => !['center', 'zoom'].includes(a))
          .map((b) => vue.toRef(a, b));
        vue.watch([() => a.center, () => a.zoom, ...h], ([a, b], [d, e]) => {
          var h, f, g;
          let { center: l, zoom: n, ...m } = k();
          null === (h = c.value) || void 0 === h ? void 0 : h.setOptions(m);
          void 0 !== b && b !== e && (null === (f = c.value) || void 0 === f ? void 0 : f.setZoom(b));
          b = !d || a.lng !== d.lng || a.lat !== d.lat;
          a && b && (null === (g = c.value) || void 0 === g ? void 0 : g.panTo(a));
        });
      });
    });
    vue.onBeforeUnmount(() => {
      var a;
      g.value = !1;
      c.value && (null === (a = f.value) || void 0 === a ? void 0 : a.event.clearInstanceListeners(c.value));
    });
    return { mapRef: e, ready: d, map: c, api: f };
  },
});
function styleInject(a, b) {
  void 0 === b && (b = {});
  b = b.insertAt;
  if (a && 'undefined' !== typeof document) {
    var e = document.head || document.getElementsByTagName('head')[0],
      d = document.createElement('style');
    d.type = 'text/css';
    'top' === b ? (e.firstChild ? e.insertBefore(d, e.firstChild) : e.appendChild(d)) : e.appendChild(d);
    d.styleSheet ? (d.styleSheet.cssText = a) : d.appendChild(document.createTextNode(a));
  }
}
var css_248z = '\n.mapdiv[data-v-177d06e3] {\n  width: 100%;\n  height: 100%;\n}\n';
styleInject(css_248z);
let _withId = vue.withScopeId('data-v-177d06e3');
vue.pushScopeId('data-v-177d06e3');
let _hoisted_1$1 = { ref: 'mapRef', class: 'mapdiv' };
vue.popScopeId();
let _sfc_render$1 = _withId(
  (a, b, e, d, c, f) => (
    vue.openBlock(),
    vue.createBlock('div', null, [
      vue.createVNode('div', _hoisted_1$1, null, 512),
      vue.renderSlot(a.$slots, 'default', {}, void 0, !0),
    ])
  )
);
_sfc_main$1.render = _sfc_render$1;
_sfc_main$1.__scopeId = 'data-v-177d06e3';
let useSetupMapComponent = (a, b, e, d) => {
    let c = null;
    const f = vue.ref(null),
      g = vue.inject(mapSymbol, vue.ref(null)),
      k = vue.inject(apiSymbol, vue.ref(null));
    vue.watch(
      [g, e],
      (l, [m, h]) => {
        l = JSON.stringify(e.value) !== JSON.stringify(h) || g.value !== m;
        g.value &&
          k.value &&
          l &&
          (c
            ? (c.setOptions(e.value), c.setMap(g.value))
            : ((f.value = c = new k.value[a]({ ...e.value, map: g.value })),
              b.forEach((a) => {
                null === c || void 0 === c ? void 0 : c.addListener(a, (b) => d(a, b));
              })));
      },
      { immediate: !0 }
    );
    vue.onBeforeUnmount(() => {
      var a;
      c && (null === (a = k.value) || void 0 === a ? void 0 : a.event.clearInstanceListeners(c), c.setMap(null));
    });
    return { component: f };
  },
  markerEvents =
    'animation_changed click dblclick rightclick dragstart dragend drag mouseover mousedown mouseout mouseup draggable_changed clickable_changed contextmenu cursor_changed flat_changed rightclick zindex_changed icon_changed position_changed shape_changed title_changed visible_changed'.split(
      ' '
    );
var Marker = vue.defineComponent({
    props: { options: { type: Object, required: !0 } },
    emits: markerEvents,
    setup(a, { emit: b }) {
      a = vue.toRef(a, 'options');
      return { marker: useSetupMapComponent('Marker', markerEvents, a, b) };
    },
    render: () => null,
  }),
  Polyline = vue.defineComponent({
    props: { options: { type: Object, required: !0 } },
    emits: polylineEvents,
    setup(a, { emit: b }) {
      a = vue.toRef(a, 'options');
      return { polyline: useSetupMapComponent('Polyline', polylineEvents, a, b) };
    },
    render: () => null,
  }),
  Polygon = vue.defineComponent({
    props: { options: { type: Object, required: !0 } },
    emits: polylineEvents,
    setup(a, { emit: b }) {
      a = vue.toRef(a, 'options');
      return { polygon: useSetupMapComponent('Polygon', polylineEvents, a, b) };
    },
    render: () => null,
  });
let rectangleEvents = polylineEvents.concat(['bounds_changed']);
var Rectangle = vue.defineComponent({
  props: { options: { type: Object, required: !0 } },
  emits: rectangleEvents,
  setup(a, { emit: b }) {
    a = vue.toRef(a, 'options');
    return { rectangle: useSetupMapComponent('Rectangle', rectangleEvents, a, b) };
  },
  render: () => null,
});
let circleEvents = polylineEvents.concat(['center_changed', 'radius_changed']);
var Circle = vue.defineComponent({
    props: { options: { type: Object, required: !0 } },
    emits: circleEvents,
    setup(a, { emit: b }) {
      a = vue.toRef(a, 'options');
      return { circle: useSetupMapComponent('Circle', circleEvents, a, b) };
    },
    render: () => null,
  }),
  _sfc_main = vue.defineComponent({
    props: { position: { type: String, required: !0 }, index: { type: Number, default: 1 } },
    emits: ['content:loaded'],
    setup(a, { emit: b }) {
      let e = vue.ref(null),
        d = vue.inject(mapSymbol, vue.ref(null)),
        c = vue.inject(apiSymbol, vue.ref(null)),
        f = vue.inject(mapWasLoadedSymbol, vue.ref(!1)),
        g = vue.ref(!1),
        k = vue.watch(
          [f, c, e],
          ([c, d, e]) => {
            d && c && e && (l(a.position), (g.value = !0), b('content:loaded'), setTimeout(k, 0));
          },
          { immediate: !0 }
        ),
        l = (a) => {
          d.value && c.value && e.value && d.value.controls[c.value.ControlPosition[a]].push(e.value);
        },
        m = (a) => {
          if (d.value && c.value) {
            let b = null;
            a = c.value.ControlPosition[a];
            d.value.controls[a].forEach((a, c) => {
              a === e.value && (b = c);
            });
            null !== b && d.value.controls[a].removeAt(b);
          }
        };
      vue.onBeforeUnmount(() => m(a.position));
      vue.watch(
        () => a.position,
        (a, b) => {
          m(b);
          l(a);
        }
      );
      vue.watch(
        () => a.index,
        (b) => {
          b && e.value && (e.value.index = a.index);
        }
      );
      return { controlRef: e, showContent: g };
    },
  });
let _hoisted_1 = { ref: 'controlRef' };
function _sfc_render(a, b, e, d, c, f) {
  return (
    vue.openBlock(),
    vue.createBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(
          '\n    v-show must be used instead of v-if otherwise there\n    would be no rendered content pushed to the map controls\n  '
        ),
        vue.withDirectives(vue.createVNode('div', _hoisted_1, [vue.renderSlot(a.$slots, 'default')], 512), [
          [vue.vShow, a.showContent],
        ]),
      ],
      2112
    )
  );
}
_sfc_main.render = _sfc_render;
let aubergine = [
    { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
    { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
    { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#64779e' }] },
    { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
    { featureType: 'landscape.man_made', elementType: 'geometry.stroke', stylers: [{ color: '#334e87' }] },
    { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#023e58' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#283d6a' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6f9ba5' }] },
    { featureType: 'poi', elementType: 'labels.text.stroke', stylers: [{ color: '#1d2c4d' }] },
    { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#023e58' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#3C7680' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
    { featureType: 'road', elementType: 'labels.text.stroke', stylers: [{ color: '#1d2c4d' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2c6675' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#255763' }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#b0d5ce' }] },
    { featureType: 'road.highway', elementType: 'labels.text.stroke', stylers: [{ color: '#023e58' }] },
    { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
    { featureType: 'transit', elementType: 'labels.text.stroke', stylers: [{ color: '#1d2c4d' }] },
    { featureType: 'transit.line', elementType: 'geometry.fill', stylers: [{ color: '#283d6a' }] },
    { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#3a4762' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4e6d70' }] },
  ],
  dark = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
    { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
    { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] },
  ],
  grey = [
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [{ saturation: 36 }, { color: '#000000' }, { lightness: 40 }],
    },
    {
      featureType: 'all',
      elementType: 'labels.text.stroke',
      stylers: [{ visibility: 'on' }, { color: '#000000' }, { lightness: 16 }],
    },
    { featureType: 'all', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { featureType: 'administrative', elementType: 'geometry.fill', stylers: [{ color: '#000000' }, { lightness: 20 }] },
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#000000' }, { lightness: 17 }, { weight: 1.2 }],
    },
    { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#000000' }, { lightness: 20 }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#000000' }, { lightness: 21 }] },
    { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#000000' }, { lightness: 17 }] },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#000000' }, { lightness: 29 }, { weight: 0.2 }],
    },
    { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#000000' }, { lightness: 18 }] },
    { featureType: 'road.local', elementType: 'geometry', stylers: [{ color: '#000000' }, { lightness: 16 }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#000000' }, { lightness: 19 }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }, { lightness: 17 }] },
  ],
  minimal = [
    { featureType: 'administrative.land_parcel', elementType: 'all', stylers: [{ visibility: 'off' }] },
    {
      featureType: 'administrative.land_parcel',
      elementType: 'geometry.stroke',
      stylers: [{ visibility: 'off' }, { weight: 7 }],
    },
    { featureType: 'administrative.locality', elementType: 'geometry.stroke', stylers: [{ visibility: 'on' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ visibility: 'on' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.stroke', stylers: [{ visibility: 'on' }] },
    { featureType: 'administrative.neighborhood', stylers: [{ visibility: 'off' }] },
    {
      featureType: 'administrative.neighborhood',
      elementType: 'geometry.fill',
      stylers: [{ color: '#00ff28' }, { visibility: 'on' }, { weight: 2 }],
    },
    {
      featureType: 'administrative.neighborhood',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#00ff28' }, { visibility: 'on' }],
    },
    { featureType: 'administrative.neighborhood', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { featureType: 'administrative.neighborhood', elementType: 'labels.text.stroke', stylers: [{ visibility: 'off' }] },
    { featureType: 'landscape.natural', elementType: 'geometry.fill', stylers: [{ visibility: 'on' }] },
    { featureType: 'poi', elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.attraction', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.business', elementType: 'all', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.medical', elementType: 'all', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.place_of_worship', elementType: 'all', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.school', elementType: 'all', stylers: [{ visibility: 'off' }] },
    { featureType: 'poi.sports_complex', elementType: 'geometry.fill', stylers: [{ visibility: 'on' }] },
    { featureType: 'poi.sports_complex', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    {
      featureType: 'road',
      elementType: 'labels.text',
      stylers: [{ visibility: 'on' }, { lightness: -10 }, { color: '#b5b5b5' }, { weight: 0.2 }],
    },
    { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    {
      featureType: 'road.local',
      elementType: 'geometry.fill',
      stylers: [{ color: '#fbfbfb' }, { lightness: -15 }, { weight: 0.5 }],
    },
    { featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', elementType: 'all', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit.station', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { featureType: 'water', elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
  ],
  retro = [
    { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
    { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#c9b2a6' }] },
    { featureType: 'administrative.land_parcel', elementType: 'geometry.stroke', stylers: [{ color: '#dcd2be' }] },
    { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#ae9e90' }] },
    { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#93817c' }] },
    { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#a5b076' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#447530' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f5f1e6' }] },
    { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#fdfcf8' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#f8c967' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#e9bc62' }] },
    { featureType: 'road.highway.controlled_access', elementType: 'geometry', stylers: [{ color: '#e98d58' }] },
    { featureType: 'road.highway.controlled_access', elementType: 'geometry.stroke', stylers: [{ color: '#db8555' }] },
    { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#806b63' }] },
    { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
    { featureType: 'transit.line', elementType: 'labels.text.fill', stylers: [{ color: '#8f7d77' }] },
    { featureType: 'transit.line', elementType: 'labels.text.stroke', stylers: [{ color: '#ebe3cd' }] },
    { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
    { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#b9d3c2' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#92998d' }] },
  ],
  roadways = [
    { featureType: 'all', elementType: 'labels', stylers: [{ visibility: 'on' }] },
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [{ saturation: 36 }, { color: '#000000' }, { lightness: 40 }],
    },
    {
      featureType: 'all',
      elementType: 'labels.text.stroke',
      stylers: [{ visibility: 'on' }, { color: '#000000' }, { lightness: 16 }],
    },
    { featureType: 'all', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { featureType: 'administrative', elementType: 'geometry.fill', stylers: [{ color: '#000000' }, { lightness: 20 }] },
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#000000' }, { lightness: 17 }, { weight: 1.2 }],
    },
    { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#e5c163' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#c4c4c4' }] },
    { featureType: 'administrative.neighborhood', elementType: 'labels.text.fill', stylers: [{ color: '#e5c163' }] },
    { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#000000' }, { lightness: 20 }] },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{ color: '#000000' }, { lightness: 21 }, { visibility: 'on' }],
    },
    { featureType: 'poi.business', elementType: 'geometry', stylers: [{ visibility: 'on' }] },
    { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#e5c163' }, { lightness: 0 }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ visibility: 'off' }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#ffffff' }] },
    { featureType: 'road.highway', elementType: 'labels.text.stroke', stylers: [{ color: '#e5c163' }] },
    { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#000000' }, { lightness: 18 }] },
    { featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{ color: '#575757' }] },
    { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#ffffff' }] },
    { featureType: 'road.arterial', elementType: 'labels.text.stroke', stylers: [{ color: '#2c2c2c' }] },
    { featureType: 'road.local', elementType: 'geometry', stylers: [{ color: '#000000' }, { lightness: 16 }] },
    { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#999999' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#000000' }, { lightness: 19 }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }, { lightness: 17 }] },
  ],
  roadwaysMinimal = [...roadways, ...minimal],
  ultraLight = [
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e9e9e9' }, { lightness: 17 }] },
    { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f5f5f5' }, { lightness: 20 }] },
    { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }, { lightness: 17 }] },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#ffffff' }, { lightness: 29 }, { weight: 0.2 }],
    },
    { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#ffffff' }, { lightness: 18 }] },
    { featureType: 'road.local', elementType: 'geometry', stylers: [{ color: '#ffffff' }, { lightness: 16 }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#f5f5f5' }, { lightness: 21 }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#dedede' }, { lightness: 21 }] },
    { elementType: 'labels.text.stroke', stylers: [{ visibility: 'on' }, { color: '#ffffff' }, { lightness: 16 }] },
    { elementType: 'labels.text.fill', stylers: [{ saturation: 36 }, { color: '#333333' }, { lightness: 40 }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#f2f2f2' }, { lightness: 19 }] },
    { featureType: 'administrative', elementType: 'geometry.fill', stylers: [{ color: '#fefefe' }, { lightness: 20 }] },
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#fefefe' }, { lightness: 17 }, { weight: 1.2 }],
    },
  ];
exports.Circle = Circle;
exports.CustomControl = _sfc_main;
exports.GoogleMap = _sfc_main$1;
exports.Marker = Marker;
exports.Polygon = Polygon;
exports.Polyline = Polyline;
exports.Rectangle = Rectangle;
exports.aubergine = aubergine;
exports.dark = dark;
exports.grey = grey;
exports.minimal = minimal;
exports.retro = retro;
exports.roadways = roadways;
exports.roadwaysMinimal = roadwaysMinimal;
exports.ultraLight = ultraLight;
