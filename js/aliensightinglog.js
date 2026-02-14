$(function() {
    // 1. INITIALIZE WIDGETS
    $("#datepicker").datepicker({ inline: true });
    
    // Initialize radio buttons
    $("input[type='radio']").checkboxradio({ icon: false });
    
    // Initialize Spinners
    $("#spinnereyes, #spinnerarms, #spinnerlegs").spinner({ min: 0 });

    // Initialize Weight Slider
    $("#slider").slider({
        range: "min", 
        min: 1, 
        max: 500, 
        value: 20,
        slide: function(event, ui) { $("#w-label").text(ui.value + " kg"); }
    });

    // Initialize Height Slider
    $("#slider2").slider({
        range: "min", 
        min: 1, 
        max: 20, 
        value: 2,
        slide: function(event, ui) { $("#h-label").text(ui.value + " m"); }
    });

    // 2. COLOR SWATCH LOGIC
    function refreshSwatch() {
        const r = $("#red").slider("value"),
              g = $("#green").slider("value"),
              b = $("#blue").slider("value");
        $("#swatch").css("background-color", "rgb(" + r + "," + g + "," + b + ")");
    }

    $("#red, #green, #blue").slider({
        orientation: "horizontal", 
        range: "min", 
        max: 255,
        slide: refreshSwatch, 
        change: refreshSwatch
    });

    $("#red").slider("value", 255);
    $("#green").slider("value", 140);
    $("#blue").slider("value", 60);

    // 3. DIALOG INITIALIZATION
    if ($("#dialog").length) {
        $("#dialog").dialog({ 
            autoOpen: false, 
            modal: true, 
            width: 450,
            open: function() {
                if ($(this).parent().find(".dialog-logo").length === 0) {
                    $(this).parent().find(".ui-dialog-title").prepend(
                        '<img src="images/aliens.png" class="dialog-logo" style="width:30px; height:15px; vertical-align:middle; margin-right:10px;">'
                    );
                }
            },
            buttons: { 
                "Close": function() { $(this).dialog("close"); } 
            }
        });
    }

    // 4. GOOGLE SHEETS SUBMISSION FUNCTION
    function sendToGoogleSheets(data, $btn, originalText) {
        const scriptURL = "https://script.google.com/macros/s/AKfycbwSb8EHqx3sDEZhYyChcdxSVppDMxlHrlyAvCINvWCQRHvJVxk2_48Rax5Th4wEpEUr/exec";

        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors', 
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(() => {
            console.log("Data sent successfully!");
            
            // Reset Button State
            $btn.prop('disabled', false).removeClass('btn-loading').text(originalText);
            
            // Reset Form and Sliders
            $("#alienForm")[0].reset();
            $("#slider").slider("value", 20);
            $("#w-label").text("20 kg");
            $("#slider2").slider("value", 2);
            $("#h-label").text("2 m");
            
            // Reset Color Swatch
            $("#red").slider("value", 255);
            $("#green").slider("value", 140);
            $("#blue").slider("value", 60);
            $("#swatch").css("background-color", "rgb(255, 140, 60)");
            
            if ($("#results").length) {
                const sheetURL = "https://docs.google.com/spreadsheets/d/11ej9qW-W0Dgs1jbdxiaHNcEEQVMHtcEGQl8wMxxzH1I/edit?usp=sharing";
                const link = $("<p style='color:green; font-weight:bold; cursor:pointer;'>" +
                             "✔ <span id='open-sheet' style='text-decoration:underline;'>View Transmission in Google Sheets</span>" +
                             "</p>");

                $("#results").append(link);

                $("#open-sheet").on("click", function() {
                    const width = 800, height = 600, left = 100, top = 100;
                    window.open(sheetURL, "GoogleSheet", 
                        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
                    );
                });
            }
        })
        .catch(error => {
            console.error('Error!', error.message);
            $btn.prop('disabled', false).removeClass('btn-loading').text("Error - Try Again");
        });
    }

    // 5. CLICK HANDLER
    $("#submit-btn").click(function(event) {
        event.preventDefault();
        
        const $btn = $(this);
        const originalText = $btn.text();

        // Enter Loading State
        $btn.prop('disabled', true).addClass('btn-loading');
        $btn.html('<span class="spinner"></span> UPLOADING...');
        
        const dateObj = $("#datepicker").datepicker("getDate");
        
        const siteReport = {
            date: dateObj ? $.datepicker.formatDate("yy-mm-dd", dateObj) : "None",
            type: $("input[name='ct']:checked").attr('id') || "None",
            weight: $("#slider").slider("value"),
            height: $("#slider2").slider("value"),
            color: $("#swatch").css("background-color"),
            eyes: $("#spinnereyes").spinner("value"),
            arms: $("#spinnerarms").spinner("value"),
            legs: $("#spinnerlegs").spinner("value"),
        };

        if ($("#dialog").length) {
            $("#results").html("<pre>" + JSON.stringify(siteReport, null, 2) + "</pre>");
            $("#dialog").dialog("open");
        }

        sendToGoogleSheets(siteReport, $btn, originalText);
    });
});