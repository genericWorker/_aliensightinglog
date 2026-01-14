$(function() {
    // 1. INITIALIZE WIDGETS
    $("#datepicker").datepicker({ inline: true });
    $("input[type='radio']").checkboxradio({ icon: false });
    $("#spinnereyes, #spinnerarms, #spinnerlegs").spinner({ min: 0 }).spinner("value", 0);

    $("#slider").slider({
        range: "max", min: 1, max: 500, value: 20,
        slide: function(event, ui) { $("#w-label").text(ui.value + " kg"); }
    });
    $("#slider2").slider({
        range: "max", min: 1, max: 20, value: 2,
        slide: function(event, ui) { $("#h-label").text(ui.value + " m"); }
    });
    $("#creatureType").controlgroup();
    $( "input[type='radio']" ).checkboxradio({
    icon: false
});

    // 2. COLOR SWATCH LOGIC
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

    // 3. DIALOG INITIALIZATION
    $("#dialog").dialog({ 
        autoOpen: false, 
        modal: true, 
        width: 450,
        buttons: { "Close": function() { $(this).dialog("close"); } }
    });

    // 4. GOOGLE SHEETS SUBMISSION FUNCTION
    function sendToGoogleSheets(data) {
        const scriptURL = "https://script.google.com/macros/s/AKfycbwSb8EHqx3sDEZhYyChcdxSVppDMxlHrlyAvCINvWCQRHvJVxk2_48Rax5Th4wEpEUr/exec";

        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors', // Critical for local and GitHub Pages testing
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(() => {
            console.log("Data sent to Google Sheets successfully!");
            $("#results").append("<p style='color:green; font-weight:bold;'>✔ Sent to Google Sheet</p>");
        })
        .catch(error => {
            console.error('Error!', error.message);
            $("#results").append("<p style='color:red;'>✘ Submission Error</p>");
        });
    }

    // 5. CLICK HANDLER
    $("#dialog-link").click(function(event) {
        event.preventDefault();
        
        const dateObj = $("#datepicker").datepicker("getDate");
        
        // Construct the JSON object
        const siteReport = {
            date: dateObj ? $.datepicker.formatDate("yy-mm-dd", dateObj) : "None",
            type: $("input[name='ct']:checked").attr('id') || "None", // Ensure radio 'name' matches HTML
            weight: $("#slider").slider("value"),
            height: $("#slider2").slider("value"),
            color: $("#swatch").css("background-color"),
            eyes: $("#spinnereyes").spinner("value"),
            arms: $("#spinnerarms").spinner("value"),
            legs: $("#spinnerlegs").spinner("value"),
        };

        // Display preview in Dialog
        $("#results").html("<pre>" + JSON.stringify(siteReport, null, 2) + "</pre>");
        $("#dialog").dialog("open");

        // Send to Google
        sendToGoogleSheets(siteReport);
    });
});