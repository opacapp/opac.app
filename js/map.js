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
            $(".map-info .support-search").text(conf._active ? "done" : "clear");
            $(".map-info .support-account").text((conf._active && conf.account_supported) ? "done" : "clear");
            $(".map-info .support-onleihe").text((conf._active && conf.data.onleihe) ? "done" : "clear");
            $(".map-info .infosite").attr("href", data.link_infosite);
            popup.setContent($(".map-info").html());
            popup.update();
        });
    }

    var markers = L.markerClusterGroup({
        showCoverageOnHover: false
    });
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

        map.addLayer(markers);
        $(".map-loading").fadeOut(1000);
    });


    function load_region(region, callback) {
        $("#sub-regions").html('');
        $("#list-loader").stop().show();
        $.getJSON(api + "/regions/?non_empty=1&parent=" + region, function (data) {
            data.sort(function (a, b) {
                return a.name.localeCompare(b.name)
            });
            $.each(data, function (i, subreg) {
                if (subreg.name === "Test") {
                    return;
                }
                var $a = $("<a>").attr("href", "#region-list").addClass("collection-item").attr("data-region", subreg.id).text(subreg.name);
                $("#sub-regions").append($a);
            });

            if (region) {
                $.getJSON(api + "/libraries/?long=true&region=" + region, function (data) {
                    data.sort(function (a, b) {
                        // Reverse order since we prepend
                        return -a.shortname.localeCompare(b.shortname);
                    });
                    $.each(data, function (i, lib) {
                        var url = lib.link_android || "https://play.google.com/store/apps/details?id=de.geeksfactory.opacclient";
                        var conf = lib.active_androidconfig_plus || lib.active_androidconfig;

                        var $a = $("<li>").addClass("collection-item").attr("data-library", lib.id)
                            .append($("<b>").text(lib.libname))
                            .append("<br>");
                        if (conf) {
                            if (conf._active) {
                                $a.append($("<i>").addClass("material-icons").text("search")).append("Suche");
                            }
                            if (conf._active && conf.account_supported) {
                                $a.append($("<i>").addClass("material-icons").text("person")).append("Kontozugang");
                            }
                            if (conf._active && conf.data.onleihe) {
                                $a.append($("<i>").addClass("material-icons").text("smartphone")).append("Onleihe-Integration");
                            }
                            $a.append(
                                $("<a>").attr("href", url).attr("target", "_blank").text("App-Download").prepend(
                                    $("<i>").addClass("material-icons").text("file_download")
                                )
                            );
                        } else {
                            $a.append($("<i>").addClass("material-icons").text("clear")).append("Aktuell nicht unterstützt");
                        }
                        $("#sub-regions").prepend($a);
                    });

                    $("#list-loader").fadeOut(500);
                    if ($("#sub-regions a, #sub-regions li").length === 0) {
                        $("#sub-regions").html('<li class="collection-item loading">Keine Ergebnisse</li>');
                    }
                    if (callback) {
                        callback();
                    }
                });
            } else {
                $("#list-loader").fadeOut(500);
                if (callback) {
                    callback();
                }
            }
        });
    }

    $("#sub-regions").on("click", "a[data-library]", function (e) {
        e.preventDefault();

    });

    $("#sub-regions").on("click", "a[data-region]", function (e) {
        e.preventDefault();
        $("#region-crumbs").append(
            $("<a>")
                .attr("href", "#region-list")
                .attr("data-region", $(this).attr("data-region"))
                .addClass("breadcrumb")
                .text($(this).text())
        );
        $(document).scrollTop($("#region-list").position().top - $(".navbar-fixed").height() - 20);
        load_region($(this).attr("data-region"));
    });

    $("#region-crumbs").on("click", "a[data-region]", function (e) {
        e.preventDefault();
        $(this).nextAll("a").remove();
        $(document).scrollTop($("#region-list").position().top - $(".navbar-fixed").height() - 20);
        load_region($(this).attr("data-region"));
    });

    load_region("");
});
