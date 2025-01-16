"use scripts";

// IIFE - Immediately Invoked functional expression
(function () {

    function DisplayHomePage() {
        console.log("Calling HomePage");

        let aboutUsButton = document.getElementById("AboutUsBtn");
        aboutUsButton.addEventListener("click", function () {
            location.href="about.html";
        });

        let MainContent = document.getElementsByTagName("main")[0];
        let MainParagraph = document.createElement("p");

        //<p id= "MainParagraph" class="mt-3">
        MainParagraph.setAttribute("id", "MainParagraph");
        MainParagraph.setAttribute("class", "mt-3");
        MainParagraph.textContent = "This is my first main paragraph";

        //display to screen
        MainContent.appendChild(MainParagraph);

        let FirstString = "This is";
        //string literal
        let SecondString = `${FirstString} my second string`;
        MainParagraph.textContent = SecondString;
        //display to screen
        MainContent.appendChild(MainParagraph);

        let DocumentBody = document.body;

        // <article></article>
        let Article = document.createElement("article");
        let ArticleParagraph = `<p id = "ArticleParagraph" class="mt-3"> This is my first article paragraph</p>`;
        Article.setAttribute("class", "container");
        Article.innerHTML = ArticleParagraph;
        DocumentBody.appendChild(Article);
    }

    function DisplayProductsPage() {
        console.log("Calling ProductsPage");
    }

    function DisplayServicesPage() {
        console.log("Calling ServicessPage");
    }

    function DisplayContactPage() {
        console.log("Calling ContactPage");
    }

    function DisplayAboutPage() {
        console.log("Calling AboutPage");
    }

    function Start() {
        console.log("Starting app...");

        switch(document.title){
            case "Home":
                DisplayHomePage();
                break;
            case "products":
                DisplayProductsPage();
                break;
            case "services":
                DisplayServicesPage();
                break;
            case "contact":
                DisplayContactPage();
                break;
            case "about":
                DisplayAboutPage();
                break;
        }

    }
    window.addEventListener("Load", Start);

})()