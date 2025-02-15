"use scripts";


//IIFE Immediately invoked functional Expression


(function (){


    function CheckLogin(){
        console.log("[INFO] checking user login status");

        //const loginNav = document.getElementById("login");
        const loginNav = document.getElementById("login");

        if (!loginNav) {
            console.warn("[WARNING] logNav element not found. Skipping CheckLogin.");
            return;

        }
        const userSession = sessionStorage.getItem("users");

        if (userSession) {

            loginNav.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
            loginNav.href = "#";
            loginNav.addEventListener("click", function (event) {
                event.preventDefault();
                sessionStorage.removeItem("users");
                location.href = "login.html";
            })
        }


    }

    function updateActiveNavLink(){
        console.log("[INFO] updateActiveLink called....")

        const  currentPage = document.title.trim();
        const navLinks = document.querySelectorAll('nav a');

        navLinks.forEach(link => {

            if(link.textContent.trim() === currentPage){
                link.classList.add('active');
            }else {
                link.classList.remove('active');
            }

        });
    }

    /**
     * Loads the navbar into the current page
     * @returns {Promise<void>}
     */

    async function LoadHeader() {
        console.log("[INFO] LoadHeader called...");

        return fetch("header.html")
            .then(response => response.text())
            .then(data => {
                document.querySelector("header").innerHTML = data;
            })
            .catch(error => console.error("[INFO] Error: "));

    }

    function  DisplayLoginPage() {
        console.log("[INFO] DisplayLoginPage called...");

        const messageArea = document.getElementById("messageArea");
        const loginButton = document.getElementById("submitButton");
        const cancelButton = document.getElementById("cancelButton");

        // hide message area initially
        messageArea.style.display = "none";

        if(!loginButton){
            console.error("[ERROR] LoginButton was not found in DOM");
            return;
        }

        loginButton.addEventListener("click", async(event)=>{

            event.preventDefault();

            const username= document.getElementById("username").value.trim();
            const password= document.getElementById("password").value.trim();

            try{

                const response = await fetch("data/users.json");
                if(!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const jsonData = await response.json();
                 console.log("[DEBUG] Fetched JSON data", jsonData);

                const users = jsonData.users;
                if (!Array.isArray(users)){
                    throw new Error(`[ERROR] Users array was not an array`);
                }

                let success = false;
                let authenticatedUser = null;

                for(const user of users){
                    if(user.Username === username && user.Password === password){
                        success = true;
                        authenticatedUser = user;
                        break;
                    }
                }

                if(success) {

                    sessionStorage.setItem("user", JSON.stringify({
                        DisplayName: authenticatedUser.DisplayName,
                        EmailAddress: authenticatedUser.EmailAddress,
                        Username: authenticatedUser.username
                    }));

                    messageArea.style.display = "none";
                    messageArea.classList.remove('active', "alert-danger");
                    location.href = "contacts-list.html";
                }else{

                    messageArea.style.display = "none";
                    messageArea.classList.remove('active', "alert-danger");
                    messageArea.textContent ="Invalid Username or password. please try again";

                    document.getElementById("username").focus();
                    document.getElementById("username").select();

                }


            }catch (error){
                console.error("[ERROR] Invalid Username or password. Please try again");


            }

        });

        cancelButton.addEventListener("click", async(event)=>{
            document.getElementById("loginForm").reset();
            location.href = "index.html";
        })
    }

    function DisplayRegisterPage() {
        console.log("[INFO] DisplayRegisterPage called...");
    }



    /**
     * Redirects user back to the contact-list page
     */
    function handleCancelClick(){
        location.href = "contacts-list.html";
    }

    /**
     * Handles the process of ending an existing contact
     * @param event
     * @param contact contact to update
     * @param page unique contact identifier
     */
    function handleEditClick(event, contact, page){
        //Prevents default form submission behaviour
        event.preventDefault();

        if(!validateForm()){
            alert("Invalid data! please check your input ");
            return;
        }

        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;

        //update the contact object with the new values
        contact.fullName = fullName;
        contact.contactNumber = contactNumber;
        contact.emailAddress = emailAddress;

        //Sve the updated contact (in local storage) with the updated csv
        localStorage.setItem(page, contact.serialize());

        //redirect
        location.href = "contacts-list.html";
    }

    /**
     * Handles the process of adding a new contact
     * @param event - the event object prevent default form submission
     */
    function handleAddClick(event){
        //Prevents default form submission behaviour
        event.preventDefault();

        if(!validateForm()){
            alert("Form contains errors. Please correct them before submitting");
            return ;
        }

        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;

        //Crate the correct in localstorage
        AddContact(fullName, contactNumber, emailAddress);

        //redirection
        location.href="contacts-list.html";
    }

    /**
     * Validates the entire form by checking validity each input
     * @returns {boolean}
     */
    function validateForm(){
        return(
            validateInout("fullName") &&
                validateInout("contactNumber") &&
                    validateInout("emailAddress")

        );
    }

    /**
     * Attaches validation event Listeners to form inout field dynamically
     * @param elementID
     * @param event
     * @param handler
     */

    function addEventListenersOnce(elementID, event, handler) {

        //retrieve element from DOM
        const element = document.getElementById(elementID);

        if (element) {
            //remove any existing event listeners of the same type
            element.removeEventListener(event, handler);

            //attach the new (latest) event for that element
            element.addEventListener(event, handler);


        }else {
            console.warn(`[WARN]Element with id "${elementID}" not found` );
        }

    }

    function attachValidationListeners(){
        console.log("[INFO] Attaching validation listeners...");


        Object.keys(VALIDATION_RULES).forEach((fieldID) => {

            const  field = document.getElementById(fieldID);

            if (!field){
                console.warn(`[WARN] field ${field} not found. skipping listeners`);
                return;
            }

            //Attach event listener using centralize validation method
            addEventListenersOnce(field, "input", () =>validateInout(fieldID));



        });


    }

    /**
     * Validates an inout based a predefined validation rule
     * @param fieldID
     * @returns {boolean} - returns true if , false otherwise
     */

    function validateInout(fieldID){

        const field = document.getElementById(fieldID);
        const errorElement = document.getElementById(`${fieldID}-error`);
        const rule = VALIDATION_RULES[fieldID];

        if(!field || !errorElement || !rule){
            console.warn(`[WARN] Validation rules not found for ${fieldID}!`);
            return false;
        }

        //Check if inout is empty

        if(field.value.trim() === "") {
            errorElement.textContent = "This is a required field.";
            errorElement.style.display = "block";
            return false;
        }

        // Check field against regular expression

        if(!rule.regex.test(field.value)){
            errorElement.textContent = rule.errorMessage;
            errorElement.style.display = "block";
            return false;
        }

        errorElement.textContent ="";
        errorElement.style.display = "none";
        return true;
    }

    /**
     * Centralize validation rules for input fields
     * @type {{fullName: {regex: RegExp, errorMessage: string}, contactNumber: {regex: RegExp, errorMessage: string}, emailAddress: {regex: RegExp, errorMessage: string}}}
     */

    const VALIDATION_RULES = {
        fullName: {
            regex: /^[A-Za-z\s]+$/,   //Allows for only letters , and spaces
            errorMessage : "Full name must contain only letters and spaces"
        },
        contactNumber: {
            regex: /^\d{3}-\d{3}-\d{4}$/,
            errorMessage : "Contact number must be in format "
        },
        emailAddress:  {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage : "Invalid email address"
        }

    }

    function AddContact(fullName , contactNumber , emailAddress){
        console.log("[DEBUG] AddContact() triggered...");

        if(!validateForm()){
            alert("Form contains errors. Please correct them before submitting");
            return;
        }



        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if(contact.serialize()){
            let key = `contact_${Date.now()}`;
            localStorage.setItem(key, contact.serialize());
            console.log(`[INFO] Contact added: ${key}`);
        }else{
            console.error("[ERROR] Contact serialization failed");
        }

        //redirection
        location.href = "contacts-list.html";
    }

    function DisplayEditPage()  {
        console.log("Called DisplayEditPage() ...");

        const page = location.hash.substring(1);
        const editButton = document.getElementById("editButton");

        switch (page)
        {
            case "add":
            {
                document.title = "Add Contact";
                document.querySelector("main > h1").textContent = "Add Contact";

                if(editButton){
                    editButton.innerHTML = `<i class="fa-solid fa-user-plus"></i> Add Contact`;
                    editButton.classList.remove("btn-primary");
                    editButton.classList.add("btn-success");
                }

                addEventListenersOnce("editButton", "click", handleAddClick);
                addEventListenersOnce("cancelButton", "click", handleCancelClick);


                break;
            }
            default:
            {
                // edit an existing contact
                const  contact = new core.Contact();
                const  contactData = localStorage.getItem(page);

                if(contactData){
                    contact.deserialize(contactData);
                }

                //Prepopulate the form with current values
                document.getElementById("fullName").value = contact.fullName;
                document.getElementById("contactNumber").value = contact.contactNumber;
                document.getElementById("emailAddress").value = contact.emailAddress;


                if(editButton){
                    editButton.innerHTML = `<i class="fas fa-edit fa-lg"></i> Edit Contact`;
                    editButton.classList.remove("btn-success");
                    editButton.classList.add("btn-primary");
                }

                addEventListenersOnce("editButton", "click",
                    (event) => handleEditClick(event,contact, page));
                addEventListenersOnce("cancelButton", "click",handleCancelClick);
                break;
            }

        }

    }

    async function DisplayWeather(){
        const apiKey = "12b70ea59b22c084964162f53447977d";
        const city = "Oshawa";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try{

            const  response = await fetch(url);
            if(!response.ok){
                throw new Error("Failed to fetch weather data");
            }

            const  data = await response.json();
            console.log(data);

            const weatherDataElement = document.getElementById("weather-data");
            weatherDataElement.innerHTML = `<strong>City:</strong> ${data.name}<br>
                                            <strong>Tempreture:</strong> ${data.main.temp}°C <br>
                                            <strong>Weather: </strong> ${data.weather[0].description}<br>`;

        } catch (error){
            console.error("Error calling openweathermap for Weather");
            document.getElementById("weather-data").textContent = "Unable to fetch weather data at this time";
        }

    }

    function DisplayHomePage(){
        console.log("Calling DisplayHomePage");

        let aboutUsButton=document.getElementById("aboutUsButton");
        aboutUsButton.addEventListener("click", ()=> {
            location.href= "about.html";
        });

        DisplayWeather();

        document.querySelector("main").insertAdjacentHTML(
            'beforeend',
            `<p id="MainParagraph" class=:mt-3">This is my first Paragraph</p>`
        );

        document.body.insertAdjacentHTML(
            'beforeend',
                ` <article class="container">
                    <p id="ArticleParagraph" class="mt-3">This is my first article paragraph</p>
                    </article>`
        );

    }
    function DisplayProductsPage(){
        console.log("Calling DisplayProductPage")
    }
    function DisplayServicesPage(){
        console.log("Calling DisplayServicesPage")
    }
    function DisplayAboutPage(){
        console.log("Calling DisplayAboutPage")
    }

    function DisplayContactsPage(){
        console.log("Calling DisplayContactPage")

        let sendButton=document.getElementById("sendButton");
        let subscriptionCheckBox=document.getElementById("subscriptionCheckbox");

        sendButton.addEventListener("click", function(){

            if(subscriptionCheckBox.checked){
                AddContact(
                    document.getElementById("fullName").value,
                    document.getElementById("contactNumber").value,
                    document.getElementById("emailAddress").value
                );
            }
            alert("Form Successfully Submitted!");
        });
    }

    function DisplayContactsListPage(){
        console.log("Calling DisplayContactListPage");

        if(localStorage.length > 0){

            let contactList = document.getElementById("contactList");
            let data = "";

            let keys = Object.keys(localStorage);
            //console.log(keys);

            let index = 1;
            for(const key of keys){

                if(key.startsWith("contact_")){
                    let contactData = localStorage.getItem(key);

                    try{
                        //console.log(contactData);
                        let contact = new core.Contact();
                        console.log(contactData);
                        contact.deserialize(contactData); // re-construct contact Object
                        data += `<tr> 
                                     <th scope="row" class="text-center">${index}</th>
                                     <td>${contact.fullName}</td>
                                     <td>${contact.contactNumber}</td>
                                     <td>${contact.emailAddress}</td>
                                     <td class="text-center">
                                        <button value="${key}" class="btn btn-warning btn-sm edit">
                                            <i class="fa-solid fa-pen-to-square"></i>Edit
                                        </button>
                                     </td> 
                                     <td class="text-center">
                                        <button value="${key}" class="btn btn-danger btn-sm delete">
                                            <i class="fa-solid fa-trash"></i>Delete
                                        </button>
                                     </td>
                                 </tr>`;
                        index++;


                    }catch (error){
                        console.error("Error deserializing contact data", contactData , error.message);
                    }
                }else {
                    console.warn(`Skipping non-contact key: ${key}`);
                }
            }
            contactList.innerHTML = data;
        }

        const addButton = document.getElementById("addButton");
        addButton.addEventListener("click", ()=>{
            location.href = "edit.html#add";
        });

        const deleteButtons = document.querySelectorAll("button.delete");
        deleteButtons.forEach((button)=>{

            button.addEventListener("click", function (){

                if(confirm("Delete contact,please confirm")){
                    localStorage.removeItem(this.value);
                    location.href = "contacts-list.html";
                }
            });
        });

        const editButtons = document.querySelectorAll("button.edit");
        editButtons.forEach((button)=>{
            button.addEventListener("click", function (){
                location.href = "edit.html#" + this.value;
            });
        });

    }

    async function Start(){
        console.log("Starting App..");
        console.log(`Current document title: ${document.title}`);

        //load header first then run Checklogin
       LoadHeader().then( ()=>{
           CheckLogin();
       });

        switch(document.title){
                case "Home":
                    DisplayHomePage();
                    break;
                case "Products":
                    DisplayProductsPage();
                    break;
                case "Services":
                    DisplayServicesPage();
                    break;
                case "About":
                    console.log("HERE");
                    DisplayAboutPage();
                    break;
                case "Contacts":
                    attachValidationListeners()
                    DisplayContactsPage();
                    break;
                case "Contacts-list":
                    DisplayContactsListPage();
                break;
                case "Edit Contact":
                    attachValidationListeners()
                    DisplayEditPage();
                break;
                case "Login":
                    DisplayLoginPage();
                break;
                case "Register":
                    DisplayRegisterPage();
                break;
                default:
                console.error("No matching case for page title");
            }

        }
        window.addEventListener("DOMContentLoaded", ()=> {
            console.log("Dom Fully loaded and parsed");
            Start();
        })
})();