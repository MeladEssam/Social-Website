let baseUrl = "https://tarmeezacademy.com/api/v1";
// https://www.gravatar.com/avatar/?d=mp  if user not have image
// author name element
let authorNameElement = document.querySelector(
  ".author-info .author-name span"
);
let usernameElement = document.querySelector(".post-header .username");
let imageProfileElement = document.querySelector(".post-header .image-profile");
// post img element
let postImageElement = document.querySelector(".post .card-image img");
// card image
let cardImagePost = document.querySelector(".post .card-image");
// post title element
let postTitleElement = document.querySelector(".card-body .card-title");
// post body element
let postBodyElement = document.querySelector(".card-body .card-text");
// created at element
let createAtElement = document.querySelector(".card-image span");
// comments element
let commentsSpanElment = document.querySelector(".comments span");
// setup ui
setupUi();
// get req get post that clicked

// console.log(localStorage.getItem("postId"));

// get the query parm value
let urlParms = new URLSearchParams(window.location.search);
let postId = urlParms.get("postId");
console.log(postId);

function getPost() {
  let url = `${baseUrl}/posts/${postId}`;
  axios
    .get(url)
    .then((response) => {
      console.log(response.data);
      //   console.log(response.data.data.author.username);
      let post = response.data.data;
      console.log(post);
      let commentsList = post.comments;
      console.log(commentsList);
      let author = response.data.data.author;
      let authorName = author.username;
      authorNameElement.innerHTML = authorName;
      //   set username
      usernameElement.innerHTML = author.username;
      // set profile image
      if (typeof author.profile_image == "string") {
        imageProfileElement.src = author.profile_image;
        // imageProfileElement.src = "https://www.gravatar.com/avatar/?d=mp";
      } else {
        imageProfileElement.src = "../imgs/none.png";
      }

      // set post image
      if (typeof post.image == "string") {
        let imagepost = document.createElement("img");
        imagepost.src = post.image;
        cardImagePost.prepend(imagepost);
        // postImageElement.src = post.image;
      }
      // postImageElement.src = post.image;
      //   set post title
      if (post.title != null) {
        postTitleElement.innerHTML = post.title;
        postTitleElement.style.display = "block";
      } else {
        postTitleElement.style.display = "none";
      }

      //   set post body
      postBodyElement.innerHTML = post.body;
      //  set created_at
      createAtElement.innerHTML = post.created_at;
      // set comments count
      commentsSpanElment.innerHTML = `(${post.comments_count}) Comments`;

      let commentsContainer = document.querySelector(".comments-content");
      commentsContainer.innerHTML = "";
      // add comments
      // commentsList[i].author.profile_image ||.username , body
      for (let i = 0; i < commentsList.length; i++) {
        // create comment div element
        let commentElment = document.createElement("div");
        // set class for div element
        commentElment.className = "comment";

        // create author div info
        let authorCommentElement = document.createElement("div");
        authorCommentElement.classList.add(
          "comment-author-info",
          "d-flex",
          "align-items-center"
        );
        // create image for user profile image
        let commentUserProfileImg = document.createElement("img");
        if (typeof commentsList[i].author.profile_image != "string") {
          commentUserProfileImg.src = "../imgs/none.png";
        } else {
          commentUserProfileImg.src = commentsList[i].author.profile_image;
        }
        // commentUserProfileImg.onerror = function () {
        //   this.onerror = null;
        //   commentUserProfileImg.src = "https://www.gravatar.com/avatar/?d=mp";
        // };
        // create bold element for username for comment author
        let commentUserName = document.createElement("b");
        // set classes for elemnt
        commentUserName.classList.add("comment-username", "ms-1", "fs-6");
        commentUserName.appendChild(
          document.createTextNode(commentsList[i].author.username)
        );
        // append commentUserProfileImg
        authorCommentElement.appendChild(commentUserProfileImg);
        // append commentUserName
        authorCommentElement.appendChild(commentUserName);

        // append authorCommentElement into comment element
        commentElment.appendChild(authorCommentElement);

        // create comment body element
        let commentBodyElement = document.createElement("div");
        // set classes for it
        commentBodyElement.classList.add("comment-body", "mt-2");
        // set comment body
        commentBodyElement.innerHTML = `${commentsList[i].body}`;

        // append comment body element into comment elment
        commentElment.appendChild(commentBodyElement);
        // append comment div element
        // commentsContainer.appendChild(commentElment);
        commentsContainer.prepend(commentElment);
      }

      // ============
    })
    .catch((error) => {
      console.log(error);
    });
}
// call getpost function
getPost();
// login btn event click
document.querySelector(".login-button").onclick = function () {
  //call the login method
  login();
};

// registeration
console.log(document.querySelector(".register-button"));
document.querySelector(".register-button").onclick = function () {
  // call register function
  register();
};

document.querySelector("#logout-btn").onclick = function () {
  logout();
};

document.querySelector(".add-comment-button").onclick = function () {
  addComment();
};

function addComment() {
  let commentInput = document.querySelector("#add-comment-input");
  console.log(commentInput);
  if (commentInput.value != "") {
    // api url
    let url = `${baseUrl}/posts/${postId}/comments`;

    // do api request
    // console.log(commentInput);
    // body parm js object
    let bodyParms = {
      body: commentInput.value,
    };
    let userToken = localStorage.getItem("token");
    let config = {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    };
    axios
      .post(url, bodyParms, config)
      .then((response) => {
        console.log(response.data);
        let author = response.data.data.author;
        let commentBody = response.data.data.body;
        console.log(author);
        console.log(commentBody);

        // create comment div element to add it to previous comments in coomments container

        // start logic
        let commentsContainer = document.querySelector(".comments-content");
        // create comment div element
        let commentElment = document.createElement("div");
        // set class for div element
        commentElment.className = "comment";

        // create author div info
        let authorCommentElement = document.createElement("div");
        authorCommentElement.classList.add(
          "comment-author-info",
          "d-flex",
          "align-items-center"
        );
        // create image for user profile image
        let commentUserProfileImg = document.createElement("img");
        if (typeof author.profile_image == "string") {
          commentUserProfileImg.src = author.profile_image;
        } else {
          commentUserProfileImg.src = "../imgs/none.png";
        }
        // commentUserProfileImg.onerror = function () {
        //   this.onerror = null;
        //   commentUserProfileImg.src = "https://www.gravatar.com/avatar/?d=mp";
        // };
        // create bold element for username for comment author
        let commentUserName = document.createElement("b");
        // set classes for elemnt
        commentUserName.classList.add("comment-username", "ms-1", "fs-6");
        commentUserName.appendChild(document.createTextNode(author.username));
        // append commentUserProfileImg
        authorCommentElement.appendChild(commentUserProfileImg);
        // append commentUserName
        authorCommentElement.appendChild(commentUserName);

        // append authorCommentElement into comment element
        commentElment.appendChild(authorCommentElement);

        // create comment body element
        let commentBodyElement = document.createElement("div");
        // set classes for it
        commentBodyElement.classList.add("comment-body", "mt-2");
        // set comment body
        commentBodyElement.innerHTML = `${commentBody}`;

        // append comment body element into comment elment
        commentElment.appendChild(commentBodyElement);
        // append comment div element
        // commentsContainer.appendChild(commentElment);
        commentsContainer.prepend(commentElment);
        showAlert("Your Comment Added With successfully!", true);
        // empty the input
        commentInput.value = "";

        // end logic
      })
      .catch((error) => {
        let errorMsg = error.response.data.message;
        showAlert(errorMsg, false);
      });
  } else {
    showAlert("Enter your comment", false);
  }
}
