"use strict";

/**
 * Represents a Contact With A NAME , Contact NUMBER AND EMAIL ADDRESS
 */

(function (core) {
    class Contact {

        /**
         * Constructs a new Contact Instance
         * @param fullName
         * @param contactNumber
         * @param emailAddress
         */
        constructor(fullName = "", contactNumber = "", emailAddress = "") {
            this._fullName = fullName;
            this._contactNumber = contactNumber;
            this._emailAddress = emailAddress;
        }


        get fullName() {
            return this._fullName;
        }


        /**
         * set the full name of the contact . Validates inout to ensure its non-empty string
         * @param fullName
         */

        set fullName(fullName) {
            if (typeof fullName !== "string" || fullName.trim() === "") {
                throw new Error("Invalid full name : must be non-empty string");
            }
            this._fullName = fullName;
        }

        get contactNumber() {
            return this._contactNumber;
        }

        /**
         * sets the contact number . validate to ensure it matches a 10-digit number format
         * @param contactNumber
         */

        set contactNumber(contactNumber) {
            const phoneRegex = /^\d{3}-\d{3}-\d{4}$/
            //905-55-4569
            if (!phoneRegex.test(contactNumber)) {
                throw new Error("Invalid Contact number: must be 10 digit number");
            }
            this._contactNumber = contactNumber;
        }

        get emailAddress() {
            return this._emailAddress;

        }

        set emailAddress(address) {
            const emailRegex = /[^\s@]+@[^\s@]+.[^\s@]+$/;
            if (!emailRegex.test(address)) {
                throw new Error("Invalid email address : must be a valid email address format ");
            }

            this._emailAddress = address;
        }

        /**
         * Converts the contact details into a human-readable string
         * @returns {string}
         */

        toString() {
            return `Full Name: ${this._fullName}\n
                Contact Number : ${this._contactNumber}\n
                Email Address: ${this._emailAddress}`;
        }

        /**
         * Serializes the contact details into a string format suitable for stage
         * @returns {string|null}
         */

        serialize() {
            if (!this._fullName || !this._contactNumber || !this._emailAddress) {
                console.error("One or more Contact Properties are missing or invalid ");
                return null;
            }

            return `${this._fullName},${this._contactNumber},${this._emailAddress}`;
        }

        /**
         * Deserialize a (csv) string if contact details and update the contact properties
         * @param data
         */



        deserialize(data) {
            if (typeof data !== "string" || data.split(",").length !== 3) {
                console.error("Invalid data format for deserialization ");
                return;
            }

            const propArray = data.split(",");


            this._fullName = propArray[0];
            this._contactNumber = propArray[1];
            this._emailAddress = propArray[2];
        }

    }
    core.Contact = Contact;

})(core || (core = {}));