 import { templates } from "templates";
 import { requester } from "requester";

 let browse = (function() {

     function getBrowsing(context) {
         let data;
         let templateListFunc;
         requester.getAllClubs()
             .then((result) => {
                 data = result;
                 return templates.get("browse");
             })
             .then((templateFunc) => {
                 context.$element().html(templateFunc());

                 templates.get("clubs-list")
                     .then((listFunc) => {
                         templateListFunc = listFunc;
                         $("#clubs-list").html(templateListFunc({ data }));
                     });

                 $("#browse-container").on("click", ".add-to-favourites", function(ev) {
                     const parent = $(ev.target).parents(".club");
                     const id = parent.attr("data-id");
                     console.log(id);
                     requester.addClubToFavourites(id)
                         .then(() => {
                             toastr.success("Added to favourites!");
                         })
                         .catch((ex) => {
                             if (ex.message.indexOf("is already added to favourites") >= 0) {
                                 toastr.success("The place is already added to favourites.");
                             } else {
                                 toastr.error("An error occured and the place is not added to favourites.");
                             }
                         });

                     ev.preventDefault();
                     return false;
                 });

                 let description;
                 let parent;
                 $("#browse-container").on("click", ".btn-info", function(ev) {
                     parent = $(ev.target).parents('.club');

                     if (parent.children().children('.desc').children().length == 0) {
                         let id = parent.attr("data-id");
                         requester.getClubById(id)
                             .then((res) => {
                                 description = res.description;
                                 return templates.get('description');
                             })
                             .then((templateFunc) => {
                                 parent.children().children('.desc').append(templateFunc(description));
                             })
                     } else {
                         parent.children().children('.desc').children().remove('#club-description');
                     }
                     ev.preventDefault();
                     return false;
                 });

                 let comment;
                 let parentComment;
                 $("#browse-container").on("click", ".btn-comments", function(ev) {
                     parentComment = $(ev.target).parents('.club');

                     if (parentComment.children().children('.comments').children().length == 0) {
                         var id = parentComment.attr('data-id');
                         requester.getClubById(id)
                             .then((res) => {
                                 comment = res.comments;
                                 return templates.get('comment');
                             })
                             .then((templateFunc) => {
                                 parentComment.children().children('.comments').append(templateFunc(comment));
                             })
                     } else {
                         parentComment.children().children('.comments').children().remove('.club-comment');
                     }
                     ev.preventDefault();
                     return false;
                 });

                 addAutocomplete("type", "type", data);
                 addAutocomplete("city", "city", data);
                 addAutocomplete("genre", "genre", data, true);
                 addAutocomplete("name", "place-name", data);

                 $("#search-clubs").on("click", function(ev) {
                     const city = $("#city").val().toLowerCase();
                     const type = $("#type").val().toLowerCase();
                     const genre = $("#genre").val().toLowerCase();
                     const name = $("#place-name").val().toLowerCase();

                     $("#city").val("");
                     $("#type").val("");
                     $("#genre").val("");
                     $("#place-name").val("");

                     const options = { city, type, genre, name };

                     requester.getAllClubs()
                         .then((clubs) => {
                             let sortedClubs = [];
                             clubs.forEach((club) => {
                                 let answersConditions = true;
                                 for (let property in options) {
                                     if (options[property] === "") {
                                         continue;
                                     }

                                     if (Array.isArray(club[property])) {
                                         let hasMatch = club[property].some((element) => element.toLowerCase() === options[property]);
                                         if (hasMatch) {
                                             continue;
                                         } else {
                                             answersConditions = false;
                                             break;
                                         }
                                     }

                                     if (options[property] !== club[property].toLowerCase()) {
                                         answersConditions = false;
                                         break;
                                     }
                                 }

                                 if (answersConditions) {
                                     sortedClubs.push(club);
                                 }
                             });

                             $("#clubs-list").html(templateListFunc({ data: sortedClubs }));

                         });

                     ev.preventDefault();
                     return false;
                 });
             })
             .catch(() => {
                 console.log();
                 templates.get("not-logged-in")
                     .then((templateFunc) => {
                         context.$element().html(templateFunc());
                     });
             });

     }

     function addAutocomplete(property, field, data, isInArray) {
         isInArray = isInArray || false;
         let options = [];
         if (isInArray) {
             data.map(r => r[property])
                 .forEach((array) => {
                     options.push(...array);
                 });
             options = options.filter(function(elem, index, self) {
                 return index == self.indexOf(elem);
             });
         } else {
             options = data.map(r => r[property]).filter(function(elem, index, self) {
                 return index == self.indexOf(elem);
             });
         }
         $(`#${field}`).autocomplete({ source: options });
     }

     return {
         all: getBrowsing
     };
 }());

 export { browse };