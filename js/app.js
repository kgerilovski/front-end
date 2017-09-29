import { controllers } from "controllers";
import { attachEvents } from "events";

(function() {

    var sammyApp = Sammy("#content", function() {

        this.get('#/', function(context) {
            context.redirect('#/home');
        });

        this.get('#/home', controllers.map.all);

        this.get("#/browse", controllers.browse.all);

        this.get("#/register", controllers.register.all);

        this.get("#/club/:id", controllers.clubProfile.all);

        this.get("#/profile", controllers.userProfile.all);


    });


    sammyApp.run('#/');
    attachEvents();
}());