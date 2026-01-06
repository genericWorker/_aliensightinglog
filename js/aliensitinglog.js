    $(function() {
    $("#datepicker").datepicker({ inline: true });
    $("input[type='radio']").checkboxradio({ icon: false });
    $("#spinnereyes, #spinnerarms, #spinnerlegs").spinner({ min: 0 });

    $("#slider").slider({
        range: "max", min: 1, max: 500, value: 20,
        slide: function(event, ui) { $("#w-label").text(ui.value + " kg"); }
    });
    $("#slider2").slider({
        range: "max", min: 1, max: 20, value: 2,
        slide: function(event, ui) { $("#h-label").text(ui.value + " m"); }
    });

    function refreshSwatch() {
        const r = $("#red").slider("value"),
              g = $("#green").slider("value"),
              b = $("#blue").slider("value");
        $("#swatch").css("background-color", "rgb(" + r + "," + g + "," + b + ")");
    }

    $("#red, #green, #blue").slider({
        orientation: "horizontal", range: "min", max: 255,
        slide: refreshSwatch, change: refreshSwatch
    });

    $("#red").slider("value", 255);
    $("#green").slider("value", 140);
    $("#blue").slider("value", 60);

    $("#dialog").dialog({ 
        autoOpen: false, 
        modal: true, 
        width: 450,
        buttons: {
            "Close": function() { $(this).dialog("close"); }
        }
    });

    $("#dialog-link").click(function(event) {
        event.preventDefault();
        const dateObj = $("#datepicker").datepicker("getDate");
        const siteReport = {
            date: dateObj ? $.datepicker.formatDate("yy-mm-dd", dateObj) : "None",
            type: $("#creatureType input:radio:checked").attr('id'),
            weight: $("#slider").slider("value"),
            height: $("#slider2").slider("value"),
            color: $("#swatch").css("background-color"),
            eyes: $("#spinnereyes").spinner("value"),
            arms: $("#spinnerarms").spinner("value"),
            legs: $("#spinnerlegs").spinner("value"),
        };
        $("#results").html("<pre>" + JSON.stringify(siteReport, null, 2) + "</pre>");
        $("#dialog").dialog("open");
    });
});