frappe.ui.form.on("Sales Order", {

    refresh(frm) {

        if (frm.doc.latitude && frm.doc.longitude) {

            frm.add_custom_button(__("Google Map"), function() {

                window.open(
                    `https://www.google.com/maps?q=${frm.doc.latitude},${frm.doc.longitude}`,
                    "_blank",
                    "noopener,noreferrer"
                );

            });
        }
    },

    before_save(frm) {

        if (frm.doc.latitude && frm.doc.longitude) {
            return;
        }

        if (frm.location_fetching) {
            return;
        }

        if (!navigator.geolocation) {

            frappe.msgprint(
                __("Geolocation is not supported in this browser.")
            );

            frappe.validated = false;
            return;
        }

        frappe.validated = false;
        frm.location_fetching = true;

        navigator.geolocation.getCurrentPosition(

            function(position) {

                frm.set_value(
                    "latitude",
                    position.coords.latitude
                );

                frm.set_value(
                    "longitude",
                    position.coords.longitude
                );

                frappe.show_alert({
                    message: __("Location Captured"),
                    indicator: "green"
                });

                frm.location_fetching = false;

                setTimeout(() => {
                    frm.save();
                }, 300);

            },

            function(error) {

                frm.location_fetching = false;

                console.error(error);

                frappe.msgprint(
                    __("Please allow location access before saving.")
                );

            },

            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    },
    google_map(frm) {

        if (!frm.doc.latitude || !frm.doc.longitude) {

            frappe.msgprint(
                __("Latitude and Longitude are not available.")
            );

            return;
        }

        window.open(
            `https://www.google.com/maps?q=${frm.doc.latitude},${frm.doc.longitude}`,
            "_blank",
            "noopener,noreferrer"
        );
    }
});