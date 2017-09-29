"use strict";

import { home } from "home";
import { browse } from "browse";
import { registerController } from "register-controller";
import { clubProfile } from "club-profile";
import { userProfile } from "user-profile";
import { map } from "map";

let controllers = (function() {
    return {
        home: home,
        browse: browse,
        register: registerController,
        clubProfile: clubProfile,
        userProfile: userProfile,
        map: map
    };
}());

export { controllers };