const userUrl = "http://localhost:3000/users";
logInUser();
createUser();

function myFetch(url, options = {}) {
  return fetch(url, options).then((res) => res.json());
}

//from Raul
// fetch("http://localhost:3000/users_signin", {
//   method: "POST",
//   headers: { "Content-Type": "application/json", Accept: "application/json" },
//   body: JSON.stringify({ name: "Bob" }),
// })
//   .then((res) => res.json())
//   .then(console.log);

function logInUser() {
  const logInForm = document.createElement("form");
  logInForm.classList.add("initial-log-in-form");
  const welcomeP = document.createElement("p");
  const enterNameLabel = document.createElement("label");
  welcomeP.innerHTML =
    "Enter your name and we'll pull up your job search tracker. If you're new, we'll get you started.";
  enterNameLabel.setAttribute("for", "username");
  const typeInName = document.createElement("input");
  typeInName.classList.add("entered-name");
  typeInName.setAttribute("type", "text");
  typeInName.setAttribute("id", "username");
  const submitName = document.createElement("input");
  submitName.setAttribute("type", "submit");
  submitName.setAttribute("value", "Submit");
  logInForm.addEventListener("submit", (e) => {
    e.preventDefault();
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

    myFetch(userUrl, options).then((user) => {
      showUser(user);
      console.log(user);
      //   myFetch(url).then((applications) => {
      //     for (const application of applications) {
      //       showApplication(application);
      //     }
      //   });
    });
  });

  logInForm.append(welcomeP, enterNameLabel, typeInName, submitName);
  document.querySelector(".page-banner").append(logInForm);
}

function showUser(user) {
  const username = document.querySelector("#username");
  username.textContent = `Hello ${user.name}!`;

  const status = document.querySelector("#status");
  status.textContent = `Status: ${user.status}`;

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
    fetch(`${userUrl}/1`, patchOptions)
      .then((res) => res.json())
      .then((user) => {
        username.textContent = `Hi ${updateName}`;
        status.textContent = `Status: ${updateStatus}`;
      });
  });
}

// Modal for a user to Edit their info
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

function createUser() {
  const welcome = document.createElement("p");
  welcome.textContent = "Create account here";

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

  form.append(label, inputName, spacing, submitBtn);

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
      });
  });

  pageBanner.append(welcome, form);
}
