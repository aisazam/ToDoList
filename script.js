const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventSubmit = document.querySelector(".add-event-btn");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const spanishDays = [
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
  "Domingo",
];

//Configuramos el array vacío
console.log("Configuramos el array vacío");
let eventsArr = [];

//then call get
getEvents();

/* function getEvents() {
  console.log("El flujo ingreso al metodo getEvents");
  db.collection("trabajos")
    .doc("pedido")
    .get()
    .then((doc) => {
      eventsArr.push(...JSON.parse(doc.data().arrayPedido));
      console.log(
        "Obtenemos el valor del array en la base de datos: " +
          JSON.stringify(eventsArr)
      );
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
} */

async function getEvents() {
  console.log("El flujo ingreso al metodo getEvents");
  var docRef = db.collection("trabajos").doc("pedido");
  try {
    var doc = await docRef.get();

    if (doc.exists) {
      console.log("Document data:", doc.data().arrayPedido);
      eventsArr.push(...JSON.parse(doc.data().arrayPedido));
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
    console.log("Iniciamos el calendario");
    initCalendar();
  } catch (err) {
    console.log("Error getting document:", err);
  }
}

//funcion para agregar dias
function initCalendar() {
  //para obtener los dias previos del mes y todos los dias
  //del mes actual y los dias remanentes del mes siguiente
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  //actualiza la fecha de arriba del calendario
  date.innerHTML = months[month] + " " + year;

  //agregando dias en el DOM
  let days = "";

  //dias del mes previo
  for (let x = day; x > 0; x--) {
    days += `<div class = "day prev-date">${
      prevDays - x + 1
    }</div>`;
  }
  //dias del mes actual
  for (let i = 1; i <= lastDate; i++) {
    //Verificar si el pedido actual esta en el dia actual

    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        //Si algún pedido fue encontrado
        event = true;
      }
    });
    // Si el día es hoy agregar la clase today
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      //Si el pedido fue encontrado tambien agregar el event Class
      //agregar active en el dia de hoy al startup
      if (event) {
        days += `<div class="day today  active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    }
    //agregando los demas dias
    else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day">${i}</div>`;
      }
    }
  }

  //dias del mes siguiente
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  //agregar una escuchador despues que el calendario es inicializado
  addListner();
}

//Mes anterior

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

//Mes siguiente
function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}
//Agregando un disparador del evento en prev y next
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("keyup", (e) => {
  //Permite solamente numeros, remueve cualquier otra cosa
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    //agregando un slash si dos numeros son ingresados
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    //No permite mas de 7 caracteres
    dateInput.value = dateInput.value.slice(0, 7);
  }
  //Si la tecla backspace es presionada
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", gotoDate);
//Función para ingresar la fecha
function gotoDate() {
  const dateArr = dateInput.value.split("/");
  //algunas validaciones para la fecha
  if (dateArr.length === 2) {
    if (
      dateArr[0] > 0 &&
      dateArr[0] < 13 &&
      dateArr[1].length === 4
    ) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  //Si la fecha es invalida
  alert("invalid date");
}

const addEventBtn = document.querySelector(".add-event"),
  addEventContainer = document.querySelector(
    ".add-event-wrapper"
  ),
  addEventCloseBtn = document.querySelector(".close"),
  addEventTitle = document.querySelector(".event-name"),
  addEventFrom = document.querySelector(".event-time-from");

addEventBtn.addEventListener("click", () => {
  addEventContainer.classList.toggle("active");
});
addEventCloseBtn.addEventListener("click", () => {
  addEventContainer.classList.remove("active");
});

document.addEventListener("click", (e) => {
  //si se clickea por fuera de wrapper
  if (
    e.target != addEventBtn &&
    !addEventContainer.contains(e.target)
  ) {
    addEventContainer.classList.remove("active");
  }
});

//permitir solo 50 caracteres en el nombre y en la cantidad
addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 50);
});
addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.slice(0, 6);
});

//Vamos a agregar la funciòn para agregar listner en dias despues de rendered
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      //configurar dia actual como dia activo
      activeDay = Number(e.target.innerHTML);

      //hacer el llamado para poner active el dia despues de hacer el click
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));

      //remove active from already active day
      days.forEach((day) => {
        day.classList.remove("active");
      });
      //Si el día del mes previo es clickeado el goto del mes previo y agregar active
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        setTimeout(() => {
          //seleciona todos los dias de ese mes
          const days = document.querySelectorAll(".day");
          //despues de ir al mes previo agregar active al cliqueado
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
        //igual para los dias del mes siguiente
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        setTimeout(() => {
          //seleciona todos los dias de ese mes
          const days = document.querySelectorAll(".day");
          //despues de ir al mes previo agregar active al cliqueado
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        //dias actuales del mes que sobran
        e.target.classList.add("active");
      }
    });
  });
}

//vamos a mostrar pedidos del dia activo y la fecha en la parte de arriba

function getActiveDay(date) {
  let dayName = "";
  const day = new Date(year, month, date);
  //console.log("fecha: " + day.toString().split(" ")[0]);
  switch (day.toString().split(" ")[0]) {
    case "Mon":
      dayName = "Lunes";
      break;
    case "Tue":
      dayName = "Martes";
      break;
    case "Wed":
      dayName = "Miercoles";
      break;
    case "Thu":
      dayName = "Jueves";
      break;
    case "Fri":
      dayName = "Viernes";
      break;
    case "Sat":
      dayName = "Sabado";
      break;
    case "Sun":
      dayName = "Domingo";
      break;
    default:
      console.log("No existe el dia");
      break;
  }
  eventDay.innerHTML = dayName;
  eventDate.innerHTML =
    date + " " + months[month] + " " + year;
}

//funcion para mostrar los eventos del ese dia
function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
    //conseguir pedidos de dias activos solamente
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
      //ahora se debe mostrar el pedido en el documento
      event.events.forEach((event) => {
        events += `
        <div class="event">
        <div class="title">
        <i class="fas fa-circle"></i>
        <h3 class="event-title">${event.title}</h3>
        </div>
        <div class="event-time">${event.time}</div>
        </div>
        `;
      });
    }
  });

  // si nada se encuentra en la fecha del pedido
  if (events === "") {
    events = `
    <div class="no-event">
    <h3 class="event-title">No hay pedidos</h3>
    </div>`;
  }

  eventsContainer.innerHTML = events;
  //guardar pedidos cuando se actualizan los pedidos
  saveEvents();
}

//Ahora vamos a crear las funciones para guardar los datos en la base de datos
addEventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;

  const newEvent = {
    title: eventTitle,
    time: eventTimeFrom,
  };

  let eventAdded = false;
  //Verificamos que el eventArray no este vacío
  if (eventsArr.length > 0) {
    //verificamos if el dia actual tiene algun pedido para agregar
    eventsArr.forEach((item) => {
      if (
        item.day === activeDay &&
        item.month === month + 1 &&
        item.year === year
      ) {
        item.events.push(newEvent);
        eventAdded = true;
      }
    });
  }

  // if el event array esta vacío o
  // para el dia actual no se agregado ningun pedido
  if (!eventAdded) {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }

  //removemos el active del form de agregar eventos
  addEventContainer.classList.remove("active");
  //Limpiamos los campos
  addEventTitle.value = "";
  addEventFrom.value = "";

  //mostramos el pedido recien agregado
  updateEvents(activeDay);

  //also add event class to newly added day if not already
  const activeDayElem =
    document.querySelector(".day.active");
  if (!activeDayElem.classList.contains("event")) {
    activeDayElem.classList.add("event");
  }
});

//vamos a crear la funcion para eliminar pedidos con un click
eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    const eventTitle =
      e.target.children[0].children[1].innerHTML;
    //encontrar el titulo del pedido que buscamos en el array por titulo y borrarlo
    eventsArr.forEach((event) => {
      if (
        event.day === activeDay &&
        event.month === month + 1 &&
        event.year === year
      ) {
        event.events.forEach((item, index) => {
          if (item.title === eventTitle) {
            event.events.splice(index, 1);
          }
        });

        //Si no hay pedidos guardados en ese dia
        //remover completamente el dia
        if (event.events.length === 0) {
          eventsArr.splice(eventsArr.indexOf(event), 1);
          // y ahora removemos la barra de abajo
          const activeDayElem =
            document.querySelector(".day.active");
          if (activeDayElem.classList.contains("event")) {
            activeDayElem.classList.remove("event");
          }
        }
      }
    });
    //luego de remover el la info del array actualizamos el pedido
    updateEvents(activeDay);
  }
});

//vamos crear las funciones para guardar los pedidos en la base de datos
// y poder obtener la info desde alli
function saveEvents() {
  db.collection("trabajos")
    .doc("pedido")
    .set({
      arrayPedido: JSON.stringify(eventsArr),
    })
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.log(error);
      alert("Error al guardar");
    });
}
