/**
 * Created by Cheng on 11/17/16.
 */
(function(){
  var hostname = document.location.hostname;
  var bundleName = 'bundle.release.js';
  if (hostname === "localhost" || hostname === "127.0.0.1") bundleName = 'bundle.js';
  var s = document.createElement("script");
  s.type = "text/javascript";
  s.src = "/static/" + bundleName;
  document.body.appendChild(s);
})();