'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "94e65472a8e71bcfe7cd35cbecaca54b",
"assets/assets/bg/blur-bg.jpg": "35d5402dca78dfd2e3ee8198543d234b",
"assets/assets/bg/dynamic.jpg": "4a00137d6cff73deefd993ce9684208b",
"assets/assets/bg/fractional.jpg": "0fa278d7b19f79adce3cc96e2bbd83ae",
"assets/assets/bg/infinity.jpg": "0864e42355c99ac2b81b26ee7b3e721c",
"assets/assets/bg/mesh-mini.png": "9564e271a3fac8490f348feb360ff8ff",
"assets/assets/bg/mesh.png": "c792a5cf3139254b0dd7dc5ad7991adc",
"assets/assets/bg/mesh1.png": "d3160604dfd38a24adbdc831ca774782",
"assets/assets/bg/mesh2.png": "4b4831b51d91d264837510df7156105d",
"assets/assets/bg/multiple.jpg": "e6bc3698168bbc74b895ebcd6fc812d8",
"assets/assets/bg/painter.jpg": "a0af6c20ce44becf4aee953a52b36250",
"assets/assets/elements/upload.jpg": "5aac0afbfa4730e26befefa334fc63ec",
"assets/assets/faces/face0.jpg": "5b85d2b8732f54dab309b1b771d39e59",
"assets/assets/faces/face1.jpg": "1d24fd26cf911f54e2aab689e83feb3d",
"assets/assets/faces/face2.jpg": "3dd7de95f49e7fdf04d7b94fd4834b01",
"assets/assets/faces/face3.jpg": "5875cfd3e18ca14c6fb7d45ff06c38af",
"assets/assets/faces/face4.jpg": "fbf4112322ed74768f395614e913d1e3",
"assets/assets/images/103.jpg": "64904ebe314f8360f1a7c5fdc6b14c11",
"assets/assets/images/baby-jesus.jpg": "99e111535c46251dcd4ea1054b8f479f",
"assets/assets/images/background.jpg": "4a2579016590bf0510076afab1e78b64",
"assets/assets/images/bg.jpg": "564393b1c99f31f91146cfa017a101b0",
"assets/assets/images/bg2.jpg": "131a90c483ce76cd84514c2e662d8d50",
"assets/assets/images/human.png": "fb28a6bf9fd9aa78fccf207c7b29f40b",
"assets/assets/images/HumanFace.png": "8a75ca956c4beddaf34e8e7853816876",
"assets/assets/images/humanoid.png": "6341873d33f9182c4790a0944e81bb82",
"assets/assets/images/jesus-nft.png": "281089ad76fdfdbca47378a73657babf",
"assets/assets/images/joker.jpg": "7420199656d4ecb558220b0afa9ece7c",
"assets/assets/images/treasure.png": "70818817005fd522d423096179bc34cf",
"assets/FontManifest.json": "5a32d4310a6f5d9a6b651e75ba0d7372",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "deaa2d509df801b16108062ae5344d2f",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "3241d1d9c15448a4da96df05f3292ffe",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "eaed33dc9678381a55cb5c13edaf241d",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "ffed6899ceb84c60a1efa51c809a57e4",
"assets/packages/glass_kit/assets/noise.png": "86f22ae1a498bb8f0c39264f9c7c796c",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "33affa1b9cc5fcd3fb50fd6f9672cf8e",
"/": "33affa1b9cc5fcd3fb50fd6f9672cf8e",
"main.dart.js": "287eb882f4aebd933e164513738b0d05",
"manifest.json": "106eca3c1661f8e93242ee87ff1b3b1a",
"version.json": "179c0ff7e6af2e3dc8c5635f5fa78089"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
