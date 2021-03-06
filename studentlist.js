"use strict";

window.addEventListener("DOMContentLoaded", init);

let students;
let postContainer = document.querySelector(".container");
let template = document.querySelector("template");
let filterType = "all";
let modal = document.querySelector("#modal");


// TODO: Load JSON, create clones, build list, add event listeners, show modal, find images, and other stuff ...

function init() {

  getJson();

  document.querySelectorAll(".house-item").forEach(button => {
    button.addEventListener("click", filtrering);
  });

  document.querySelector(".firstname").addEventListener("click", sortByFirstname);
  document.querySelector(".lastname").addEventListener("click", sortByLastname);
  document.querySelector(".house").addEventListener("click", sortByHouse);

}

//fetches json data from teachers json

async function getJson() {
  
  let myJson = await fetch("http://petlatkea.dk/2019/hogwarts/students.json");

  students = await myJson.json();

  showList();
}


//split the name into firstname and last name again, also added first letter of last name to match image to students and sets to lower case

function imageNameFinder(student) {

  const firstSpace = student.fullname.indexOf(" ");
  const lastSpace = student.fullname.lastIndexOf(" ");
  
  const firstName = student.fullname.slice(0, firstSpace);
  const lastName = student.fullname.slice(lastSpace + 1)

  let firstLetterFirstName = firstName.substring(0, 1);
  let imageName = lastName + "_" + firstLetterFirstName + ".png";

  imageName = imageName.toLowerCase();

  showModal(imageName, student)

}

function showModal(imageName, student) {
  console.log("modal");

  modal.classList.add("show");
  modal.querySelector(".modal-fullname").textContent = student.fullname;
  modal.querySelector(".modal-house").textContent = student.house;
  modal.querySelector(".modal-img").src = "images/" + imageName;
  modal.querySelector("button").addEventListener("click", hideModal);
  modal.className = "show";

  // modal.classList.add(house.toLowerCase());

  // too many if statements, so I tried switch instead - I made some cases, and added a default

  switch (student.house) {
    case "Gryffindor":
      modal.classList.add("gryffindor");
      break;

    case "Hufflepuff":
      modal.classList.add("hufflepuf");
      break;

    case "Slytherin":
      modal.classList.add("slytherin");
      break;

    case "Ravenclaw":
      modal.classList.add("ravenclaw");
      break;

    default:
      alert("Not a real Hogwarts House");
      break;
  }
}
//basically just the x on the modul 
function hideModal() {
  modal.classList.remove("show");
}

//empties container and sets tilferType to what data category you click

function filtrering() {
  console.log("filter");

  postContainer.textContent = "";

  filterType = this.getAttribute("data-category");

  showList();
}



//empties container, sort by compare first name

function sortByFirstname() {

  postContainer.textContent = "";
  students.sort(compareFirstname);
  showList();
}
//empties container, sort by compare last name

function sortByLastname() {
  postContainer.textContent = "";
  students.sort(compareLastname);
  showList();
}

//empties container, sort by house

function sortByHouse() {
  postContainer.textContent = "";
  students.sort(compareHouse);
  showList();
}

//these fuunctions use the parameter student and splits the fullname into first, middle and last name

function getFirstname(student){
  
  const firstSpace = student.fullname.indexOf(" ");
  const firstName = student.fullname.slice(0, firstSpace);

  return firstName;
}

function getLastname(student){

  const lastSpace = student.fullname.lastIndexOf(" ");
  const lastName = student.fullname.slice(lastSpace + 1);

  return lastName;
}

//these functions compare names by having two variables set to a and b. If one is bigger than the other, returns the lowest one (-1) last and vica versa 
//javascript can sort alphabetically and knows to return the last letter of alphabet as lowest value

//return 0 is in case a name is repeated (i.e. if you have Emma Roberts and Emma Watson)

function compareFirstname(a,b) {

  let aFirstname = getFirstname(a);
  let bFirstname = getFirstname(b);

  if (aFirstname < bFirstname)
    return -1;

  if (aFirstname > bFirstname)
    return 1;
  return 0;
}

function compareLastname(a,b) {
  let aLastname = getLastname(a);
  let bLastname = getLastname(b);

  if (aLastname < bLastname)
    return -1;

  if (aLastname > bLastname)
    return 1;
  return 0;

}

function compareHouse(a,b) {
  if (a.house < b.house)
    return -1;

  if (a.house > b.house)
    return 1;
  return 0;
}


//this is the part where we clone the data (forEach clone data - also added a pop up module if you click on fullname, to get more details)

function showList() {
  students.forEach(student => {
    let clone = template.cloneNode(true).content;

    if (student.house == filterType || filterType == "all") {
      clone.querySelector("[data-fullname]").textContent = student.fullname;
      clone.querySelector("[data-fullname]").addEventListener("click", () => {
        imageNameFinder(student);
      });
      clone.querySelector("[data-house]").textContent = student.house;
      postContainer.appendChild(clone);
    }
  });
}


