import { templates } from "templates";
import { requester } from "requester";

var userProfile = (function() {

    function getProfile(context) {
        var userInfo;


        //TODO: fix promise structure
        requester.getUserInfo()
            .then((user) => {
                userInfo = user;
                return templates.get("user-profile");
            })
            .then((templateFunc) => {
                context.$element().html(templateFunc(userInfo));
            })
            .then(() => {
                var allClubs = [];
                var length = userInfo.favourites.length;
                var itemsProcessed = 0;
                return new Promise((resolve, reject) => {
                    if (userInfo.favourites.length === 0) {
                        resolve(allClubs);
                        return;
                    }
                    userInfo.favourites.forEach((id) => {
                        requester.getClubById(id)
                            .then((club) => {
                                allClubs.push(club);
                                itemsProcessed++;
                                if (itemsProcessed === length) {
                                    resolve(allClubs);
                                }
                            });
                    });
                });

            })
            .then((allClubs) => {
                templates.get("clubs-list")
                    .then((listTemplateFunc) => {
                        console.log(allClubs);
                        $("#clubs-list").html(listTemplateFunc({ data: allClubs }));

                        $(".add-to-favourites").addClass("hidden");
                    });
            });
    }

    return {
        all: getProfile
    };
}());

export { userProfile }