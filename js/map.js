/*global $,L*/
$(function () {
    var map = L.map('map').setView([49.40, 8.64], 2);
    var api = 'https://info.opacapp.de';

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    function load_marker_data(libid, branchname, popup) {
        $.getJSON(api + '/libraries/' + libid + '/', function (data) {
            $(".map-info .libname").text(data.libname);
            $(".map-info .branchname").toggle(branchname != data.libname).text(branchname);

            $(".map-info .playstore").attr("href", data.link_android || "https://play.google.com/store/apps/details?id=de.geeksfactory.opacclient");

            var conf = data.active_androidconfig_plus || data.active_androidconfig;
            console.log(conf);
            $(".map-info .support-search").text(conf._active ? "done" : "clear");
            $(".map-info .support-account").text((conf._active && conf.account_supported) ? "done" : "clear");
            $(".map-info .support-onleihe").text((conf._active && conf.data.onleihe) ? "done" : "clear");
            $(".map-info .infosite").attr("href", data.link_infosite);
            popup.setContent($(".map-info").html());
            popup.update();
        });
    }

    var markers = L.markerClusterGroup();
    $.getJSON(api + '/libraries/?has_active_androidconfig=1', function (data) {
        $("#num").text(data.length);

        $.each(data, function (i, lib) {
            if (lib.branches.length) {
                $.each(lib.branches, function (j, branch) {
                    if (branch.lat && branch.lon) {
                        var marker = L.marker([branch.lat, branch.lon]);
                        marker.bindPopup("Loading…");
                        marker.on('click', function (e) {
                            var popup = e.target.getPopup();
                            load_marker_data(lib.id, branch.name, popup);
                        });
                        markers.addLayer(marker);
                    }
                });
            }
        });

        $(".map-loading").hide();
        map.addLayer(markers);
    });
});
