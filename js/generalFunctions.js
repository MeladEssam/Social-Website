function setupUi() {
  // logged-btn reg-btn
  let loggedBtn = document.querySelector("#logged-btn");
  let registerdBtn = document.querySelector("#reg-btn");
  let logoutBtn = document.querySelector("#logout-btn");
  let creatPostElementHeader = document.querySelector(".create-post-header");
  let usernameImgprofileContent = document.querySelector(
    ".username-imgprofile"
  );
  let addPostButton = document.querySelector("#add-post-button");

  // add comment element
  let addCommentElement = document.querySelector(".add-comments-content");

  console.log(usernameImgprofileContent);
  if (localStorage.getItem("token") !== null) {
    //user logged in
    loggedBtn.style.display = "none";
    registerdBtn.style.display = "none";
    logoutBtn.style.display = "block";
    // creatPostElementHeader.style.display = "block";
    // user-profile-image
    let user = JSON.parse(localStorage.getItem("user"));
    document.querySelector("#usernameButton").innerHTML = user.username;
    document.querySelector("#user-profile-image").src = user.profile_image;
    usernameImgprofileContent.classList.remove("d-none");
    usernameImgprofileContent.classList.add("d-flex");
    // addPostButton.style.display = "flex";

    if (addPostButton != null) {
      // exist
      addPostButton.style.display = "flex";
    }
    if (creatPostElementHeader != null) {
      // exist
      creatPostElementHeader.style.display = "block";
    }

    if (addCommentElement != null) {
      // appear it
      addCommentElement.classList.remove("d-none");
      addCommentElement.classList.add("d-flex");
    }
  } else {
    //user not logged in
    loggedBtn.style.display = "block";
    registerdBtn.style.display = "block";
    logoutBtn.style.display = "none";

    usernameImgprofileContent.classList.remove("d-flex");
    usernameImgprofileContent.classList.add("d-none");

    if (addPostButton != null) {
      // exist
      addPostButton.style.display = "none";
    }
    if (creatPostElementHeader != null) {
      // exist
      creatPostElementHeader.style.display = "none";
    }
    if (addCommentElement != null) {
      // appear it
      addCommentElement.classList.remove("d-flex");
      addCommentElement.classList.add("d-none");
    }
  }
}

// registeration function
function register() {
  let usernameInput = document.querySelector(
    "#registerationModal form #reg-username-input"
  );
  let nameInput = document.querySelector(
    "#registerationModal form #reg-name-input"
  );
  let emailInput = document.querySelector(
    "#registerationModal form #reg-email-input"
  );
  let passwordInput = document.querySelector(
    "#registerationModal form #reg-password-input"
  );
  let image = document.querySelector("#reg-image-input").files[0];

  if (
    usernameInput.value !== "" &&
    nameInput.value !== "" &&
    emailInput.value !== "" &&
    passwordInput.value !== ""
  ) {
    // do register api request using axios
    let url = `${baseUrl}/register`;

    let bodyParms;

    // if user uplaoded an profile image
    if (image) {
      bodyParms = new FormData();
      bodyParms.append("username", usernameInput.value);
      bodyParms.append("password", usernameInput.value);
      bodyParms.append("name", nameInput.value);
      bodyParms.append("email", emailInput.value);
      bodyParms.append("image", image);
    }
    // // not uploaded image
    else {
      bodyParms = {
        username: usernameInput.value,
        password: passwordInput.value,
        name: nameInput.value,
        email: emailInput.value,
      };
    }
    // if user uplaoded an profile image

    axios
      .post(url, bodyParms)
      .then((response) => {
        // console.log(response.data);
        // store token and user into the local storage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        // hide register modal
        hideModal("registerationModal");
        // show alert
        showAlert("Registeration Done With Successfully", true);
        // setupUi
        setupUi();
        // empty the inputs
        usernameInput.value = "";
        nameInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";
        // if the page is not post details page call get posts
        if (!window.location.href.includes("post_details")) {
          // call get posts to toggle the edit & delete btns
          if (window.location.href.includes("profile")) {
            // call fun that get user posts
            getUserPosts();
          } else {
            // call fun that get post for all users
            currentPage = 1;
            getPosts(currentPage, true);
          }
        }
      })
      .catch((error) => {
        // alert(error.response.data.message);
        console.log(error);
        let errorMsg = error.response.data.message;
        showAlert(errorMsg, false);
      });
  } else {
    showAlert("name,username,email and password Are Required", false);
  }
}

// login function
function login() {
  let usernameInput = document.querySelector(
    "#loginModal form #username-input"
  );
  let passwordInput = document.querySelector(
    "#loginModal form #password-input"
  );

  if (usernameInput.value !== "" && passwordInput.value !== "") {
    let url = `${baseUrl}/login`;
    let bodyPrams = {
      username: usernameInput.value,
      password: passwordInput.value,
    };
    toggleLoader(true);
    axios
      .post(url, bodyPrams)
      .then((response) => {
        let token = response.data.token;
        console.log(token);
        console.log(response.data);
        let user = response.data.user;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        usernameInput.value = "";
        passwordInput.value = "";

        // hide login modal after click on login btn and login success
        hideModal("loginModal");
        // show toast alert
        showAlert("Congratulations! Login Done With Successfully", true);

        // call setupUi method
        setupUi(); //set ui when login

        // if the page is not post details page call get posts
        if (!window.location.href.includes("post_details")) {
          // call get posts to toggle the edit & delete btns
          if (window.location.href.includes("profile")) {
            // call fun that get user posts
            getUserPosts();
          } else {
            // call fun that get post for all users
            currentPage = 1;
            getPosts(currentPage, true);
          }
        }
      })
      .catch((e) => {
        // alert(e.response.data.message);
        let errorMsg = e.response.data.message;
        showAlert(errorMsg, false);
      })
      .finally(() => {
        toggleLoader(false);
      });
  } else {
    // alert("All Inputs Are Required");
    showAlert("All Inputs Are Required", false);
  }
}

// logout function
function logout() {
  //  remove token & the user form local storage
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // show toast alert

  showAlert("Logged Out Done With Successfully", false);
  // call setupUi Method
  setupUi();

  // if the page is not post details page call get posts
  if (!window.location.href.includes("post_details")) {
    // call get posts to toggle the edit & delete btns
    if (window.location.href.includes("profile")) {
      // call fun that get user posts
      getUserPosts();
    } else {
      // call fun that get post for all users
      currentPage = 1;
      getPosts(currentPage, true);
    }
  }
  // call the get posts
  // if (window.location.href.includes("profile")) {
  //   // call fun that get user posts
  //   getUserPosts();
  // } else {
  //   // call fun that get post for all users
  //   currentPage = 1;
  //   getPosts(currentPage, true);
  // }
}

// function that show alert
function showAlert(alertMessage, successFlag) {
  let myToastEl = document.getElementById("myToast");
  let myToast = new bootstrap.Toast(myToastEl);
  let toastBodyElment = document.querySelector(".toast-body");
  toastBodyElment.innerHTML = alertMessage;
  if (successFlag) {
    toastBodyElment.classList.remove("text-danger");
    toastBodyElment.classList.add("text-primary");
  } else {
    toastBodyElment.classList.remove("text-primary");
    toastBodyElment.classList.add("text-danger");
  }

  myToast.show(); //show alert
}

// hide modal function
function hideModal(modalId) {
  let myModalEl = document.getElementById(modalId);
  let modalInstance = bootstrap.Modal.getInstance(myModalEl);
  modalInstance.hide();
}

// edit post details function
// edit post details function
function editPostDetails(post) {
  let editPostTitleInput = document.querySelector("#edit-post-title-input");
  let editPostBodyInput = document.querySelector("#edit-post-body-input");

  // set the input feilds with post title and body before update

  editPostTitleInput.value = post.title;
  editPostBodyInput.value = post.body;

  let editpostModal = new bootstrap.Modal(
    document.getElementById("editPostModal")
  );
  editpostModal.show();

  // get post id
  let postId = post.id;
  // api url
  let url = `${baseUrl}/posts/${postId}`; //req api url

  document.querySelector(".edit-post-button").onclick = function () {
    // start logic

    if (editPostBodyInput.value == "") {
      showAlert("Post Body Is Required", false);
    } else {
      let bodyParms = new FormData();
      bodyParms.append("title", editPostTitleInput.value);
      bodyParms.append("body", editPostBodyInput.value);

      //get postImage
      let postImage = document.querySelector("#edit-post-image-input").files[0];
      // do the api request

      if (postImage) {
        // if choosed image
        bodyParms.append("image", postImage);
      }
      // user token
      let userToken = localStorage.getItem("token");
      // add token to headers
      let config = {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      };

      // do api request
      // specify this is put request
      bodyParms.append("_method", "put");
      axios
        .post(url, bodyParms, config)
        .then((response) => {
          console.log(response.data);
          // hide the modal
          editpostModal.hide(); //hide the mpdal
          // show alert
          showAlert("Your Post Updated With Successfully!", true);
          // call get posts
          if (window.location.href.includes("profile")) {
            // call fun that get user posts
            getUserPosts();
          } else {
            // call fun that get post for all users
            currentPage = 1;
            getPosts(currentPage, true);
          }
        })
        .catch((error) => {
          let errorMsg = error.response.data.message;
          showAlert(errorMsg, false);
          console.log("error");
        });
    }

    // end logic

    // hideModal("editPostModal");
  };
}

// delete post function

// delete post function
function deletePostFunction(post) {
  console.log(post);

  // firstly show the delete modal
  let deletePostModal = new bootstrap.Modal(
    document.getElementById("deletePostModal")
  );
  deletePostModal.show();

  // when click on delete post btn
  let deltePostBtn = document.querySelector(".delete-post-button");
  deltePostBtn.onclick = function () {
    console.log(post.id);
    let postId = post.id;

    // user token
    let userToken = localStorage.getItem("token");
    // add token to headers
    let config = {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    };

    //do api requset
    let url = `${baseUrl}/posts/${postId}`;
    axios
      .delete(url, config)
      .then((response) => {
        console.log(response.data);
        // hide the modal
        deletePostModal.hide();
        // show the alert
        showAlert("Your Post Deleted With Successfully.", true);

        if (window.location.href.includes("profile")) {
          // call fun that get user posts
          getUserPosts();
        } else {
          // call fun that get post for all users
          currentPage = 1;
          getPosts(currentPage, true);
        }
        // call get posts
        // currentPage = 1;
        // getPosts(currentPage, true);
      })
      .catch((error) => {
        let errorMsg = error.response.data.message;
        showAlert(errorMsg, false);
      });
  };
}

// // when click on profile link in navbar
// document.querySelector("#profile-link-btn").onclick = function () {
//   // redirect it to user profile page
//   window.location.href = "profile.html";
// };
// console.log(document.querySelector("#profile-link-btn"));
// // when click on profile link in navbar redirect you to your profile page
document
  .querySelector("#profile-link-btn")
  .addEventListener("click", function () {
    if (localStorage.getItem("token") != null) {
      // you logged in
      let user = JSON.parse(localStorage.getItem("user"));
      let userId = user.id;
      window.location.href = `profile.html?userId=${userId}`;
    } else {
      // not logged in
      showAlert("Currently Not Logged in So Can't Visit Profile Page");
    }
  });

// when click on his image or it's username in nav go it to his profile page
document
  .querySelector(".username-imgprofile")
  .addEventListener("click", function () {
    if (localStorage.getItem("token") != null) {
      // you logged in
      let user = JSON.parse(localStorage.getItem("user"));
      let userId = user.id;
      window.location.href = `profile.html?userId=${userId}`;
    } else {
      // not logged in
      showAlert("Currently Not Logged in So Can't Visit Profile Page");
    }
  });

// create new post function

function createNewPost() {
  let postTitle = document.querySelector("#post-title-input").value;
  let postBody = document.querySelector("#post-body-input").value;
  let postImage = document.querySelector("#post-image-input").files[0];
  console.log(postTitle);
  console.log(postBody);
  console.log(postImage);

  if (postBody === "") {
    showAlert("Post Body Is Required", false);
  } else {
    let bodyParms = new FormData();
    bodyParms.append("title", postTitle);
    bodyParms.append("body", postBody);
    if (postImage) {
      // if choosed image
      bodyParms.append("image", postImage);
    }
    // user token
    let userToken = localStorage.getItem("token");
    // add token to headers
    let config = {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    };
    let url = `${baseUrl}/posts`;
    toggleLoader(true);
    axios
      .post(url, bodyParms, config)
      .then((response) => {
        toggleLoader(false);

        console.log(response.data);
        // clear inputs
        document.querySelector("#post-title-input").value = "";
        document.querySelector("#post-body-input").value = "";
        document.querySelector("#post-image-input").value = "";
        // hide the modal
        hideModal("createPostModal");
        // show alert
        showAlert("New Post Create With Successfully!", true);
        // call get posts method
        // getPosts();
        // call get posts
        if (window.location.href.includes("profile")) {
          // call fun that get user posts
          getUserPosts();
        } else {
          // call fun that get post for all users
          currentPage = 1;
          getPosts(currentPage, true);
        }
      })
      .catch((error) => {
        let errorMsg = error.response.data.message;
        showAlert(errorMsg, false);
      })
      .finally(() => {
        toggleLoader(false);
      });
  }
}

// function toggle loader
function toggleLoader(show) {
  if (show == true) {
    document.querySelector(".the-loader").style.display = "flex";
  } else {
    document.querySelector(".the-loader").style.display = "none";
  }
}
