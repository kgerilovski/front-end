import { jqueryRequester } from "jquery-requester";

var requester = (function() {

    const CURRENT_USER_ID = "current-user-id";
    const AUTH_TOKEN = "auth-token";
    const CURRENT_USER_NAME = "username";
    const appId = "kid_HJGG8Wvj-";
    const appSecret = "2eb956ad7b2047b0b38c90bf7d1aefa1";
    const masterSecret = "873fe9393dd34fac9a812a7707a2606a";



    var authorizationString = btoa(`${appId}:${appSecret}`);


    const url = "https://baas.kinvey.com";
    const getUrl = url + appId;
    const userUrl = url + `/user/${appId}`;
    const loginUserUrl = userUrl + "/login";
    const logoutUserUrl = userUrl + "/_logout";
    const getClubsUrl = url + `/appdata/${appId}/clubs`;

    function registerUserRequest(username, password) {
        let favourites = [];
        const data = { username, password, favourites };
        const headers = { Authorization: `Basic ${authorizationString}` };
        return jqueryRequester.post(userUrl, headers, data);
    }

    function loginUserRequest(username, password) {
        const data = { username, password };
        const headers = { Authorization: `Basic ${authorizationString}` };
        return jqueryRequester.post(loginUserUrl, headers, data)
            .then((res) => {
                console.log(res);

                localStorage.setItem(CURRENT_USER_ID, res._id);
                localStorage.setItem(AUTH_TOKEN, res._kmd.authtoken);
                localStorage.setItem(CURRENT_USER_NAME, res.username);
            });
    }

    function logoutUserRequest(username, password) {
        const data = { username, password };
        var authtoken = localStorage.getItem(AUTH_TOKEN);
        const headers = { Authorization: `Kinvey ${authtoken}` };
        return jqueryRequester.post(logoutUserUrl, headers)
            .then(() => {

                localStorage.removeItem(CURRENT_USER_ID);
                localStorage.removeItem(CURRENT_USER_NAME);
                localStorage.removeItem(AUTH_TOKEN);
            });
    }

    function isLoggedIn() {
        return new Promise((resolve, reject) => {
            const username = localStorage.getItem(CURRENT_USER_NAME);
            if (username) {
                resolve(username);
            }
            reject();
        });
    }

    function getUserInfo() {
        const id = localStorage.getItem(CURRENT_USER_ID);
        const url = userUrl + `/${id}`;
        const authtoken = localStorage.getItem(AUTH_TOKEN);
        const headers = { Authorization: `Kinvey ${authtoken}` };
        return jqueryRequester.get(url, headers);
    }

    function getAllClubs() {
        var authtoken = localStorage.getItem(AUTH_TOKEN);
        const headers = { Authorization: `Kinvey ${authtoken}` };
        return jqueryRequester.get(getClubsUrl, headers);
    }

    function getClubById(id) {
        const authtoken = localStorage.getItem(AUTH_TOKEN);
        const headers = { Authorization: `Kinvey ${authtoken}` };
        const url = getClubsUrl + `/${id}`;
        return jqueryRequester.get(url, headers);
    }

    function addClubToFavourites(clubId) {
        const userId = localStorage.getItem(CURRENT_USER_ID);
        const authtoken = localStorage.getItem(AUTH_TOKEN);
        const headers = { Authorization: `Kinvey ${authtoken}` };
        const url = userUrl + `/${userId}`;
        let newFavourites;
        return getUserInfo()
            .then((user) => {
                let favourites = user.favourites;
                newFavourites = favourites;
                if (newFavourites.indexOf(clubId) < 0) {
                    newFavourites.push(clubId);
                } else {
                    throw new Error("The place is already added to favourites.");
                }
            })
            .then(() => {
                let data = { favourites: newFavourites };
                return jqueryRequester.put(url, headers, data);
            });
    }

    function addCommentToClub(id, content) {
        const authtoken = localStorage.getItem(AUTH_TOKEN);
        const headers = { Authorization: `Kinvey ${authtoken}` };
        const url = getClubsUrl + `/${id}`;
        const username = localStorage.getItem(CURRENT_USER_NAME);
        var dateNow = new Date();
        var date = `${dateNow.getDate()}.${dateNow.getMonth()}.${dateNow.getFullYear()}`;

        return getClubById(id)
            .then((club) => {
                club.comments.push({ content, date, username });
                return club;
            })
            .then((club) => {
                return jqueryRequester.put(url, headers, club);
            });
    }


    return {
        registerUser: registerUserRequest,
        loginUser: loginUserRequest,
        logoutUser: logoutUserRequest,
        isLoggedIn: isLoggedIn,
        getUserInfo: getUserInfo,
        getAllClubs: getAllClubs,
        getClubById: getClubById,
        addClubToFavourites: addClubToFavourites,
        addCommentToClub: addCommentToClub
    };
}());

export { requester };