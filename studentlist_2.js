"use strict";

window.addEventListener("DOMContentLoaded", init);

const postContainer = document.querySelector(".container");
const template = document.querySelector("template");
let modal = document.querySelector("#modal");
let students = [];
let houseFilter = "all";
let newArray = [];
let bloodtypeJson = [];
let sortType;
let incArray = [];
let hackedStudent = false;

let inqNumber = 0;

const counts = {
  Gryffindor: 0,
  Slytherin: 0,
  Hufflepuff: 0,
  Ravenclaw: 0
};

const studentsProto = {

firstName: "--student-firstname--",
lastName: "--student-lastname--",
house: "--student-house--",
bloodtype: "--student-bloodtype--",
id: "--student-id--",
image: "--student-image--"

};


function init() {

    document.querySelectorAll(".house-item").forEach(button => {
    button.addEventListener("click", filterByHouse);
    });
  
    document.querySelectorAll(".firstname").forEach(button => {
    button.addEventListener("click", setSortByFirstName);
      });
  
    document.querySelectorAll(".lastname").forEach(button => {
    button.addEventListener("click", setSortByLastname);
        });
  
    document.querySelectorAll(".house").forEach(button => {
    button.addEventListener("click", setSortByHouse);
          });

          document.querySelector(".squads").addEventListener("click", () => {
            showSquad();
          });

 getJson();

}

//gets both json files 

async function getJson() {
  
     let myJson = await fetch("http://petlatkea.dk/2019/hogwarts/students.json");
     students = await myJson.json();

     let bloodJson = await fetch("http://petlatkea.dk/2019/hogwarts/families.json")
     bloodtypeJson = await bloodJson.json();


       newStudentArray(students);

  }



//json is "massaged", so that the fullname is split into first- and last name
// student is created based on prototype

function newStudentArray(inputArray) {

    inputArray.forEach(student => {

        counts[student.house]++;

        const firstSpace = student.fullname.indexOf(" ");
        const firstName = student.fullname.slice(0, firstSpace);
        const lastSpace = student.fullname.lastIndexOf(" ");
        const lastName = student.fullname.slice(lastSpace + 1);  
        const firstLetterFirstName = firstName.substring(0, 1);

        let imageName = lastName + "_" + firstLetterFirstName + ".png";
        imageName = imageName.toLowerCase();

        let newStudent = Object.create(studentsProto);

        newStudent.firstName = firstName;
        newStudent.lastName = lastName;
        newStudent.image = imageName;
        newStudent.house = student.house;
        newStudent.bloodtype = student.bloodtype;
        newArray.push(newStudent);


    });

    //creates me as an object and the object is pushed into the newarray

    let rebecca = Object.create(studentsProto);

    rebecca.firstName = "Rebecca";
    rebecca.lastName = "Mortensen";
    rebecca.image = "mortensen_r.png"
    rebecca.house = "Gryffindor";
    rebecca.bloodtype = "Muggle";
  
    newArray.push(rebecca);
    setBloodStatus();
    console.log(newArray);

buildList();

}

//set sort sets the sortType

function setSortByFirstName() {

  sortType = "firstName";

  buildList();

}

function sortByFirstname() {

    newArray.sort(compareFirstname);

  }


//compare functions sorts the data, and returns the lovest value last and highest value first - in this case, alphabetical order

function compareFirstname(a,b) {


  if (a.firstName < b.firstName)
    return -1;

  if (a.firstName > b.firstName)
    return 1;
  return 0;

}


function setSortByLastname() {

  sortType = "lastName";
  
  buildList();

}

function sortByLastname() {

  newArray.sort(compareLastname);

}

function compareLastname(a, b) {


if (a.lastName < b.lastName)
  return -1;

if (a.lastName > b.lastName)
  return 1;

return 0;

}

function setSortByHouse() {

  sortType = "house";

  buildList();

}

function sortByHouse() {

  newArray.sort(compareHouse);

}

function compareHouse(a, b) {

  if (a.house < b.house)
    return -1;

  if (a.house > b.house)
    return 1;
  return 0;
}


// sortlist checks if sorttype is equal to the wanted value, and calls the following function

function sortList() {

if (sortType === "firstName") {

    sortByFirstname();

} else if (sortType === "lastName") {

  sortByLastname();

} else if (sortType === "house") {

    sortByHouse();
  }
}

//build list is like a cone, where all of our arrays are gathered before it's being displayed, to pretent overwriting arrays

function buildList() {

  sortList();
  const liste = filterByType(houseFilter);
  showList(liste);

}

//sets the housefilter to match the clicked house

function filterByHouse() {

houseFilter = this.dataset.category;

console.log(houseFilter);

  buildList();

}

//returns "house" all, if no house has been clicked on 

function filterByType(house) {

    function filterType(element) {

            return house === "all" || element.house == house;
    }

    let filterJson = newArray.filter(filterType);
    return filterJson;
  
}

//adds the clicked student to inquisitorial squad, if they are pureblood or slytherin - if not, the user gets a "warning"

function addToSquad(student) {

  console.log(student);

  if (student.bloodtype === "Pure" || student.house === "Slytherin") {

    incArray.push(student);

    console.log(incArray);

  } else {

  alert("Not Possible");

  }

refreshSquad();
}

//refreshSquad refreshes the number of people in inq squad, to make sure they are not added again everytime you open the modal

function refreshSquad() {

  inqNumber =  incArray.length;
  document.querySelector("#inqNumber").innerHTML = " " + inqNumber;

 // console.log(inqNumber);
}

//display information in HTML and adds eventlistener to modal

function showList(liste) {

    postContainer.textContent = "";

    liste.forEach(student => {
    let clone = template.cloneNode(true).content;

      clone.querySelector("[data-fullname]").textContent = student.firstName + " " + student.lastName;
      clone.querySelector("[data-fullname]").addEventListener("click", () => {
        showModal(student);
      });

      if (student.firstName === "Rebecca") {

        clone.querySelector(".removeThis").addEventListener("click", () => {
          hacked(student);
        });

      } else {


      clone.querySelector(".removeThis").addEventListener("click", () => {
        expelStudent(student);
      });

    }

      clone.querySelector(".addThis").addEventListener("click", () => {
        addToSquad(student);
      });


      clone.querySelector(".begone").addEventListener("click", () => {
        removeFromSquad(student);
      });

      clone.querySelector("[data-house]").textContent = student.house;
      postContainer.appendChild(clone);
    
  });

  document.querySelector("#all").innerHTML = " " + newArray.length;
  document.querySelector("#raw").innerHTML = " " + filterByType("Ravenclaw").length;
  document.querySelector("#huff").innerHTML = " " + filterByType("Hufflepuff").length;
  document.querySelector("#gryf").innerHTML = " " + filterByType("Gryffindor").length;
  document.querySelector("#slyth").innerHTML = " " + filterByType("Slytherin").length;

}

//hacked is what happens if you try to expel Rebecca, and calls the function for the hacked version of the list

function hacked() {

alert("Expelling this student is not possible, as it would be an immense loss to Hogwarts");
hackedStudent = true;

hackedBloodtypes() 

//red is equal false, and we set an interval changing red from true to false every 1000 miliseconds - if true, bg is red and otherwise bg is black

let red = false;

setInterval(function() {
//console.log("interval function");
  red = !red;
  if (red) {
  document.querySelector("body").style.backgroundColor = "red";
  //console.log("red")
  } else {
    //console.log("not red");
  document.querySelector("body").style.backgroundColor = "purple";
  }}, 1000);


}
//setBloodSTatus checks every student and match last name in both, to set blood status of students. Halfbloods overwrite Purebloods
//this function could be optimised, as it runs 2695 times

function setBloodStatus() {

  console.log(bloodtypeJson);

  let i = 0;

  newArray.forEach(student => {
    i++;
    let bloodFound = false;
    bloodtypeJson.pure.forEach(name => {
      i++;
      if (name === student.lastName) {

        student.bloodtype = "Pure";
        bloodFound = true;

      }

    });

    bloodtypeJson.half.forEach(name => {
      i++;
      if (name === student.lastName) {

        student.bloodtype = "Half";
        bloodFound = true;
    
      }

    });
    if (!bloodFound) {
        student.bloodtype = "Muggleborn";
      }

  });
  console.log("number", i);
}

//hacked blood types changes the bloodtype for every student that are not pure to pure
//people who are originally purebloods get a random bloodtype 

function hackedBloodtypes() {

  newArray.forEach(student => {

    console.log(student.firstName);

  if (student.bloodtype !== "Pure") {

    student.bloodtype = "Pure";

    console.log("student is not pure");

  } else if (student.bloodtype === "Pure") {

    student.bloodtype = Math.floor(Math.random() * 3 + 1);

    //switch is made to set the terms for all three outcomes

    switch (student.bloodtype) {
      case 1:
        student.bloodtype = "Pure";
        break;
  
      case 2:
      student.bloodtype = "Half";
      break;

      case 3:
      student.bloodtype = "Muggle";
      break;
  
      default:
        alert("Not a bloodtype");
        break;
    }

  }

});

}

//removeFromSquad finds the name of the student that should be removes, and removes them from the array

function removeFromSquad(student) {

  let objectIndex = findByNameInq( student.firstName );

  incArray.splice(objectIndex, 1);

  refreshSquad();

}

//expel removes people the clicked student from the student array

function expelStudent(student) {

  let objectIndex = findByName( student.firstName );

  newArray.splice(objectIndex, 1);

  console.log("newArray", newArray);

  showList(newArray);

}

//finds name from array and returns it

function findByName( firstName ) {

    return newArray.findIndex( obj => obj.firstName === firstName );
}

function findByNameInq( firstName ) {

  return incArray.findIndex( obj => obj.firstName === firstName );
}

//display the modal for the inq squad 

function showSquad() {
    
  document.querySelector("#squad").classList.add("showSquad");
  document.querySelector("#hideSquad").addEventListener("click", hideSquad);

//if hackedStudent is true, it sets and interval that removes them after 100 ms
//sets the number to match length of array

  if (hackedStudent) {
    setInterval(function() {
        incArray.pop();
        console.log("popped");
        createSquadTable()
        inqNumber =  incArray.length;
        document.querySelector("#inqNumber").innerHTML = " " + inqNumber;
              }, 1000);

  }
createSquadTable();

}

//table is set in the HTML to display students in rows

function createSquadTable() {
  let table = document.getElementById("squadtablebody");
  table.innerHTML = "";
  incArray.forEach(student => {     
     let row = table.insertRow();
     row.insertCell().innerHTML = student.firstName + " " + student.lastName;
  });
}

//show modal with all values and image
//adds class matching the house types

function showModal(student) {
  
    modal.classList.add("show");
    modal.querySelector(".modal-fullname").textContent = student.firstName + student.lastName;
    modal.querySelector(".modal-house").textContent = student.house;
    modal.querySelector(".modal-bloodtype").textContent = student.bloodtype;
    modal.querySelector(".modal-img").src = "images/" + student.image;
    modal.querySelector("button").addEventListener("click", hideModal);

   
   if (student.house === "Gryffindor") {

    modal.classList.remove("slytherin");
    modal.classList.remove("ravenclaw");
    modal.classList.remove("hufflepuf");
    modal.classList.add("gryffindor");

   } else if (student.house === "Hufflepuff") {

    modal.classList.remove("griffindor");
    modal.classList.remove("slytherin");
    modal.classList.remove("ravenclaw");
      modal.classList.add("hufflepuf");

    } else if (student.house === "Slytherin") {

      modal.classList.remove("griffindor");
      modal.classList.remove("hufflepuf");
      modal.classList.remove("ravenclaw");
      modal.classList.add("slytherin");

    } else if (student.house === "Ravenclaw") {

      modal.classList.remove("griffindor");
      modal.classList.remove("slytherin");
      modal.classList.remove("hufflepuf");
      modal.classList.add("ravenclaw");

    }
}

function hideModal() {
    modal.classList.remove("show");
  }

function hideSquad() {
  //document.querySelector(".squad-fullname").textContent = "";
  document.querySelector("#squad").classList.remove("showSquad");
}