// call setupt ui
setupUi();

let urlParms = new URLSearchParams(window.location.search);
let userId = urlParms.get("userId");
console.log(userId);

let PostsContainer = document.querySelector(".posts");
let baseUrl = "https://tarmeezacademy.com/api/v1";
// let userId = 1161; //user id
// function getuser info
getuser();
//function thst get user
function getuser() {
  let url = `${baseUrl}/users/${userId}`;
  axios
    .get(url)
    .then((response) => {
      console.log(response.data.data);
      let user = response.data.data;
      document.querySelector(".user-image img").src =
        typeof user.profile_image == "string"
          ? user.profile_image
          : "../imgs/none.png";
      document.querySelector(".info-details .user-name").innerHTML = user.name;
      document.querySelector(".info-details .user-email").innerHTML =
        user.email;
      document.querySelector(".info-details .user-username").innerHTML =
        user.username;
    })
    .catch((error) => {
      console.log(error.response.data.message);
      let errorMsg = error.response.data.message;
      showAlert(errorMsg, false);
    });
}

// get user posts
getUserPosts();
function getUserPosts() {
  PostsContainer.innerHTML = "";
  console.log("Base Url " + baseUrl);

  let Url = `${baseUrl}/users/${userId}/posts`;

  toggleLoader(true);
  axios.get(Url).then((response) => {
    toggleLoader(false);
    // console.log(response.data.data);

    let postsList = response.data.data;
    console.log(postsList);
    for (let i = 0; i < postsList.length; i++) {
      // console.log(postsList[i]);
      //post title
      let postTitle = postsList[i].title;
      //post body
      let postBody = postsList[i].body;
      //comments count
      let commentsCount = postsList[i].comments_count;
      //the time create at it
      let createAt = postsList[i].created_at;
      //post img
      let postImageSrc = postsList[i].image;
      //username
      let userName = postsList[i].author.username;
      //profile src img
      let userProfileImageSrc = postsList[i].author.profile_image;

      // console.log(userProfileImageSrc);
      // console.log(postImageSrc);
      //create post div element
      let postElement = document.createElement("div");
      //set class name for the post div
      postElement.className = "post";
      // set userId as attr
      postElement.setAttribute("postId", postsList[i].id);
      // postElement.setAttribute("user")
      //create the post card div
      let postCardElement = document.createElement("div");
      postCardElement.classList.add("card", "shadow-lg", "mb-4");

      //create card header div
      let cardHeaderElement = document.createElement("div");

      //set classes for the card header
      cardHeaderElement.classList.add(
        "card-header",
        "d-flex",
        "align-items-center",
        "post-header"
      );

      //create image profile element
      let imageProfileElement = document.createElement("img");
      //set class for the img profile
      imageProfileElement.className = "image-profile";
      cardHeaderElement.appendChild(imageProfileElement);
      //check if profile img empty or not  if empty it equal {} empty object
      if (typeof userProfileImageSrc == "string") {
        //set img src
        imageProfileElement.src = userProfileImageSrc;
      } else {
        //if the url is {} then create Icon
        imageProfileElement.src = "../imgs/none.png";
      }

      // if the url exist but the image not found mean if the image not loaded correctly
      //if the image not found
      // imageProfileElement.onerror = function () {
      //   this.onerror = null;
      //   cardHeaderElement.innerHTML = "";
      //   //create icon
      //   let icon = document.createElement("i");
      //   //set classes
      //   icon.classList.add("fa-solid", "fa-user-xmark", "image-profile");
      //   //append icon
      //   cardHeaderElement.appendChild(icon);
      //   //append username element
      //   cardHeaderElement.appendChild(usernameElement);
      // };

      //user name element
      let usernameElement = document.createElement("h5");
      //add classes for username element
      usernameElement.classList.add("mb-0", "ms-3", "fw-bold", "username");
      //append the username value into usernam element
      usernameElement.appendChild(document.createTextNode(userName));
      cardHeaderElement.appendChild(usernameElement);

      // edit post button

      if (localStorage.getItem("token") != null) {
        // this mean user logged in
        // so show edit and delete btns for his posts

        let User = JSON.parse(localStorage.getItem("user"));
        if (User.id == postsList[i].author.id) {
          // this mean show btn on post that user has it
          let editDeleteBtnsContentDiv = document.createElement("div");
          // set class
          editDeleteBtnsContentDiv.classList.add("ms-auto");
          // create edit post btn
          let editPostButton = document.createElement("button");
          // set class for the btn
          editPostButton.classList.add(
            "btn",
            "btn-primary",

            "edit-post-btn"
          );
          editPostButton.textContent = "Edit";

          // add addEventListener on edit btn
          editPostButton.addEventListener("click", function () {
            editPostDetails(postsList[i]);
          });

          // delete post btn
          let deletePostButton = document.createElement("button");
          deletePostButton.classList.add(
            "btn",
            "btn-danger",
            "ms-2",
            "delete-post-btn"
          );
          deletePostButton.textContent = "Delete";

          // add eventListiner on the delete btn
          deletePostButton.addEventListener("click", function () {
            deletePostFunction(postsList[i]);
          });
          // append the edit btn into div content
          editDeleteBtnsContentDiv.appendChild(editPostButton);
          // append the delte post btn
          editDeleteBtnsContentDiv.appendChild(deletePostButton);
          // append the div into cardheader
          cardHeaderElement.appendChild(editDeleteBtnsContentDiv);
        }
      }

      // let editPostButton = document.createElement("button");
      // editPostButton.textContent = "Edit";
      // editPostButton.classList.add(
      //   "btn",
      //   "btn-primary",
      //   "ms-auto",
      //   "edit-post-btn"
      // );
      // editPostButton.addEventListener("click", function () {
      //   editPostDetails(postsList[i]);
      // });

      // // append edit btn into post header
      // cardHeaderElement.appendChild(editPostButton);
      //append the card header into the post card element
      postCardElement.appendChild(cardHeaderElement);

      // post image element
      //create Card img
      let cardPostImgElement = document.createElement("div");
      //set class for the element
      cardPostImgElement.className = "card-image";
      //create img element
      let postImgElement = document.createElement("img");
      //add class for img element
      postImgElement.classList.add("img-fluid");

      //create span under img
      let spanCreatedAt = document.createElement("span");
      //set class
      spanCreatedAt.className = "text-white-50";
      //append the create at value into the span
      spanCreatedAt.appendChild(document.createTextNode(createAt));

      if (typeof postImageSrc == "string") {
        postImgElement.src = postImageSrc;
        //append img element into card img element
        cardPostImgElement.appendChild(postImgElement);
        //if the img not found
        // postImgElement.onerror = function () {
        //   this.onerror = null;
        //   postImgElement.src = "../imgs/myimage.jpg";
        //   // cardPostImgElement.appendChild(postImgElement);
        // };
      }

      //append span element into card img element
      cardPostImgElement.appendChild(spanCreatedAt);

      //append card img element into post card
      postCardElement.appendChild(cardPostImgElement);

      // post body
      let cardBody = document.createElement("div");
      //set class
      cardBody.className = "card-body";
      //post title
      let postTitleElement = document.createElement("h5");
      //set class
      postTitleElement.className = "card-title";
      //psot title text
      postTitle = postTitle == null ? "" : postTitle;
      let titleText = document.createTextNode(postTitle);
      //append the title
      postTitleElement.appendChild(titleText);

      // post par
      let postPar = document.createElement("p");
      postPar.className = "card-text";
      //append post body into par element
      postPar.appendChild(document.createTextNode(postBody));

      //append the title element
      cardBody.appendChild(postTitleElement);

      //append the post par into card body
      cardBody.appendChild(postPar);

      //  creat hr
      let hrElement = document.createElement("hr");

      cardBody.appendChild(hrElement);

      // create comments tags container
      let commentsTagsElmenet = document.createElement("div");
      // set clsses for it
      commentsTagsElmenet.classList.add(
        "comments-tags",
        "d-md-flex",
        "align-items-md-center",
        "justify-content-md-between"
      );
      // create comments elment
      let commentsElement = document.createElement("div");
      // set class for comments element
      commentsElement.className = "comments";

      // create comments icon
      let commentsIconElement = document.createElement("i");
      commentsIconElement.classList.add("fa-solid", "fa-pen-clip");

      // create comments span
      let commentsSpanElement = document.createElement("span");
      // set class
      commentsSpanElement.className = "ms-2";
      commentsSpanElement.appendChild(
        document.createTextNode(`(${commentsCount}) Comments`)
      );
      // append icon into comments element
      commentsElement.appendChild(commentsIconElement);
      // append the span
      commentsElement.appendChild(commentsSpanElement);

      // append the comments element into comments tags container element
      commentsTagsElmenet.appendChild(commentsElement);

      let tagsList = postsList[i].tags;
      console.log(tagsList, i);
      if (tagsList.length > 0) {
        // create tags div element
        let tagsELment = document.createElement("div");
        // add classes for it
        tagsELment.classList.add("tags", "mt-3", "mt-md-0");
        for (let t = 0; t < tagsList.length; t++) {
          // create tag span
          let spanTag = document.createElement("span");
          spanTag.appendChild(document.createTextNode(tagsList[t].name));
          // append the span
          tagsELment.appendChild(spanTag);
        }

        // append tags elments to the tags comments container elment:commentsTagsElmenet
        commentsTagsElmenet.appendChild(tagsELment);
      }

      cardBody.appendChild(commentsTagsElmenet);
      //append the card body
      postCardElement.appendChild(cardBody);
      //append the card into post element
      postElement.appendChild(postCardElement);

      //append the post div into posts container
      PostsContainer.appendChild(postElement);
    }
  });
}

document.querySelector("#logout-btn").addEventListener("click", function () {
  logout();
});

// register event
document.querySelector(".register-button").onclick = function () {
  // call register function
  register();
};
// login btn event click
document.querySelector(".login-button").onclick = function () {
  //call the login method
  login();
};
// create post btn

let createPostButton = document.querySelector(".create-post-button");
console.log(createPostButton);
createPostButton.onclick = function () {
  createNewPost();
};

// to show post details
document.addEventListener("click", function (event) {
  if (event.target.closest(".card-body")) {
    // get the post element
    let cardBodyElement = event.target.closest(".card-body");
    let post = cardBodyElement.parentElement.parentElement;
    console.log(post);
    let postId = post.getAttribute("postId");
    console.log(postId);

    this.location.href = `post_details.html?postId=${postId}`;
  }
});
