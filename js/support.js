$(function () {
    var api = 'https://info.opacapp.de';

    $(".support-row").hide();
    if (location.hash != "") {
        $(location.hash).show();
    } else {
        $(".support-row-first").show();
    }
    function handlers($e) {
        $e.on("click", "[data-next]", function () {
            $(this).closest(".support-row").slideUp();
            $($(this).attr("data-next")).fadeIn();
            location.hash = $($(this).attr("data-next")).attr("id");
        });
    }
    handlers($(".support-row"));

    $("#list-loader").hide();
    var search_query = null;
    function search(query) {
        if (query === search_query) {
            // not necessary
            return;
        }
        search_query = query;
        $("#libraries").html('');
        $("#list-loader").stop().show();
        $.getJSON(api + "/libraries/?limit=10&has_active_androidconfig=1&search=" + encodeURIComponent(query), function (data) {
            if (query !== search_query) {
                // race condition
                return;
            }
            data.sort(function (a, b) {
                // Reverse order since we prepend
                return -a.shortname.localeCompare(b.shortname);
            });
            $.each(data, function (i, lib) {
                var target = "#support-row-unsupported";
                if (lib.support_contract) {
                    target = "#support-row-supported";
                }
                var $a = $("<a>").attr("href", target).addClass("collection-item").attr("data-next", target)
                    .append($("<span>").text(lib.shortname))
                    .append(" ")
                    .append(lib.region ? $("<b>").text(lib.region.name) : "");
                $("#libraries").prepend($a);
            });
            $("#list-loader").fadeOut(500);
            if ($("#libraries a, #libraries li").length === 0) {
                $("#libraries").html('<li class="collection-item loading">' + map_strings.noresults + '</li>');
            }
            handlers($("#libraries"));
        });
    }
    $("#library-search").on("keyup change", function () {
        search($(this).val());
    });
});