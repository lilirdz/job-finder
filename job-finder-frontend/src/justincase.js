const userUrl = "http://localhost:3000/users";

function myFetch(url, options = {}) {
  return fetch(url, options).then((res) => res.json());
}

showLogInButton();
showSignUpButton();

function showSignUpButton() {
  const signUpButton = document.createElement("button");
  signUpButton.innerHTML = "I'd like to sign up.";
  signUpButton.classList.add("sign-up-button");
  signUpButton.addEventListener("click", (e) => createUser(signUpButton));
  document.querySelector(".log-in-options").append(signUpButton);
}

function logInUser(logInButton) {
  logInButton.remove();
  const enterNameLabel = createNameInputDirections();
  const typeInName = createNameInputField();
  const submitName = createSubmitNameButton();

  const logInForm = document.createElement("form");
  logInForm.classList.add("initial-log-in-form");
  logInForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (document.querySelector(".entered-name").value != 0) {
      logMeIn();
    } else {
      pleaseEnterName();
    }
    logInForm.reset();
  });
  logInForm.append(enterNameLabel, typeInName, submitName);
  document.querySelector("h2").append(logInForm);
}
function showUser(user) {
  const username = document.querySelector("#username");
  username.innerHTML = `Hello ${user.name}!`;

  const status = document.querySelector("#status");
  status.innerHTML = `Status: ${user.status}`;

  const editUserForm = document.querySelector("#edit-user-form");
  editUserForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const updateName = document.querySelector("#user-name-change").value;
    const updateStatus = document.querySelector("#user-status-change").value;
    const patchOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: updateName,
        status: updateStatus,
      }),
    };
    myFetch(`${userUrl}/1`, patchOptions).then((user) => {
      username.textContent = `Hi ${updateName}`;
      status.textContent = `Status: ${updateStatus}`;
    });
  });
}

// Get the modal
const userModal = document.getElementById("userModal");
// Get the button that opens the modal
const updateBtn = document.getElementById("edit-btn");
// Get the <span> element that closes the modal
const userSpan = document.getElementsByClassName("close")[0];
const userForm = document.querySelector("#edit-user-form");
// When the user clicks on the button, open the modal
updateBtn.onclick = function () {
  userModal.style.display = "block";
};
// When the user clicks on <span> (x), close the userModal
userSpan.onclick = function () {
  userModal.style.display = "none";
};

userForm.onsubmit = function () {
  userModal.style.display = "none";
};
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == userModal) {
    userModal.style.display = "none";
  }
};

function showLogInButton() {
  const logInButton = document.createElement("button");
  logInButton.innerHTML = "I have an account.";
  logInButton.classList.add("log-in-button");
  logInButton.addEventListener("click", (e) => logInUser(logInButton));
  document.querySelector(".log-in-options").append(logInButton);
}

function pleaseSignUp() {
  const pleaseSignUp = document.createElement("p");
  pleaseSignUp.classList.add("please-sign-up");
  pleaseSignUp.innerHTML = "Account not found. Please sign up.";
  document.querySelector(".initial-log-in-form").innerHTML = "";
  document.querySelector(".initial-log-in-form").append(pleaseSignUp);
}

function pleaseEnterName() {
  if (document.querySelector(".initial-log-in-form p")) {
    const error_message = document.querySelector(".initial-log-in-form p");
    error_message.append("!");
  } else {
    const error_message = document.createElement("p");
    error_message.textContent = "Please enter a name";
    document.querySelector(".initial-log-in-form").append(error_message);
  }
}

function logMeIn() {
  const username = document.querySelector("#username");
  const status = document.querySelector("#status");
  const findName = document.querySelector(".entered-name").value;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: findName,
    }),
  };
  myFetch("http://localhost:3000/users_signin", options).then((user) => {
    if (user.error) {
      pleaseSignUp();
    } else {
      document.querySelector(".initial-log-in-form").innerHTML = "";
      document.querySelector(".log-in-options").innerHTML = "";

      showUser(user);

      if (user.applications.length) {
        for (const application of user.applications) {
          showApplication(application);
        }
      } else {
        const noAppsYet = document.createElement("p");
        noAppsYet.innerHTML = "You don't have any applications added yet.";
        document.querySelector(".column-right").append(noAppsYet);
      }
    }
  });
}
function createNameInputDirections() {
  const enterNameLabel = document.createElement("label");
  enterNameLabel.innerHTML = "Enter your name to pull up your information.";
  enterNameLabel.setAttribute("for", "username");
  return enterNameLabel;
}
function createNameInputField() {
  const typeInName = document.createElement("input");
  typeInName.classList.add("entered-name");
  typeInName.setAttribute("type", "text");
  typeInName.setAttribute("id", "username");
  return typeInName;
}

function createSubmitNameButton() {
  const submitName = document.createElement("input");
  submitName.setAttribute("type", "submit");
  submitName.setAttribute("value", "Submit");
  return submitName;
}

function createUser(signUpButton) {
  signUpButton.remove();
  const welcome = document.createElement("label");
  welcome.textContent = "Enter name for new account:";

  const form = document.createElement("form");
  form.classList.add("new-user-form");

  const label = document.createElement("label");
  label.setAttribute("for", "name");

  const inputName = document.createElement("input");
  inputName.setAttribute("type", "text");
  inputName.setAttribute("id", "new-name");

  const submitBtn = document.createElement("input");
  submitBtn.setAttribute("type", "submit");
  submitBtn.setAttribute("value", "Submit");

  const spacing = document.createElement("br");

  form.append(welcome, label, inputName, spacing, submitBtn);

  const pageBanner = document.querySelector(".page-banner");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const newUserName = document.querySelector("#new-name").value;
    const postOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: newUserName,
      }),
    };

    fetch(userUrl, postOptions)
      .then((res) => res.json())
      .then((user) => {
        showUser(user);
        document.querySelector(".log-in-options").innerHTML = "";

        document.querySelector(".new-user-form").innerHTML = "";
        if (user.applications.length) {
          for (const application of user.applications) {
            showApplication(application);
          }
        } else {
          const noAppsYet = document.createElement("p");
          noAppsYet.innerHTML = "You don't have any applications added yet.";
          document.querySelector(".column-right").append(noAppsYet);
        }
      });
  });
  document.querySelector("h2").append(form);
}