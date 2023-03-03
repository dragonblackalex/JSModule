class RenderCalendar {
  constructor() {
    this.container = document.querySelector('.calendar-container');
    this.renderAll();
  }

  renderOne(currentTime) {
    const rangeOfHour = document.createElement('div');
    rangeOfHour.className = 'hour hour-range';
    rangeOfHour.innerHTML = `
        <p class="hour hour-current">${currentTime}:00</p>
        <p class="hour hour-half">${currentTime}:30</p>
        `;
    if (currentTime === 17) {
      rangeOfHour.innerHTML = `
        <p class="hour-current">${currentTime}:00</p>
        `;
    }
    return this.container.append(rangeOfHour);
  }

  renderAll() {
    for (let i = 8; i <= 17; i++) {
      this.renderOne(i);
    }
  }
}

class Event {
  constructor(item) {
    Object.assign(this, item);
    this.width = 200;
    this.end = item.start + item.duration;
    this.leftX = 40;
    this.id = Event.id++;
  }
  static id = 0;
}

class ListOfEvents {
  constructor(list) {
    list = list.sort(function (a, b) {
      return a.start - b.start;
    });
    this.items = list.map((item) => new Event(item));

    this.calculateWidthAndLeft();
  }

  calculateWidthAndLeft() {
    // width
    this.items.forEach((item) => {
      for (let i = 0; i < this.items.length; i++) {
        if (
          (item.end > this.items[i].start &&
            item.start < this.items[i].start) ||
          (item.end > this.items[i].start && item.end < this.items[i].end)
        ) {
          item.width = 100;
          this.items[i].width = 100;

          // left coordinate

          if (item.leftX === this.items[i].leftX) {
            this.items[i].leftX += 100;
          }
          if (item.leftX === 140 && this.items[i].leftX == 40) {
            this.items[i].leftX += 200;
          }
        }
      }
    });
  }
}

class RenderEvents {
  #listOfTasks = null;
  #renderCalendar = null;

  constructor(listOfEvents, renderCalendar) {
    this.container = document.querySelector('.calendar-container');

    this.#listOfTasks = listOfEvents.items;

    this.#renderCalendar = renderCalendar;

    this.renderEventsList(this.#listOfTasks);
  }

  renderOneEvent(event) {
    const taskContainer = document.createElement('div');
    taskContainer.className = 'task-item';
    taskContainer.innerHTML = `
          <p>${event.title}</p>`;
    taskContainer.setAttribute(
      'style',
      `height: ${event.duration * 2}px; width: ${event.width}px; top: ${
        event.start * 2
      }px; left: ${event.leftX}px;`
    );
    return taskContainer;
  }

  renderEventsList(list) {
    this.container.innerHTML = '';
    this.#renderCalendar.renderAll();

    // list of events
    let eventsCollection = list.map((item) => this.renderOneEvent(item));
    this.container.append(...eventsCollection);

    this.eventModalWindow();
  }
  eventModalWindow() {
    let listOfEventItems = this.container.querySelectorAll('.task-item');
    let eventsArr = Array.from(listOfEventItems);

    // duble click to delete event
    eventsArr.forEach((item) => {
      item.addEventListener('dblclick', () => {
        listOfTasks = listOfTasks.filter((i) => {
          return listOfTasks.indexOf(i) !== eventsArr.indexOf(item);
        });

        this.#listOfTasks = new ListOfEvents(listOfTasks);
        this.renderEventsList(this.#listOfTasks.items);
      });
    });
  }
}

class Inputs {
  #renderEvents = null;
  constructor(renderEvents) {
    this.#renderEvents = renderEvents;
    this.list = null;

    this.modalBtn = document.querySelector('.modal-btn');
    this.modalWindow = document.querySelector('.modal-window');
    this.closeModal = document.querySelector('.modal-close');
    this.addEvent = document.querySelector('.modal-add-event');

    this.startInput = document.querySelector('.event-time');
    this.durationInput = document.querySelector('.event-duration');
    this.titleInput = document.querySelector('.event-name');
    this.startInput.value = '08:00';
    this.createEvent();
  }
  createEvent() {
    // open modal
    this.modalBtn.addEventListener('click', () => {
      this.modalWindow.classList.toggle('active');
      this.modalBtn.classList.toggle('hide');
    });
    // close modal
    this.closeModal.addEventListener('click', () => {
      this.modalWindow.classList.toggle('active');
      this.modalBtn.classList.toggle('hide');
    });

    this.addEvent.addEventListener('click', () => {
      // calculating start for event from time
      let hours = this.startInput.value.slice(0, 2);
      let minutes = this.startInput.value.slice(3);
      minutes = +minutes;

      let startTime = (+hours - 8) * 60 + minutes;

      // create new Event

      let newEvent = {
        start: startTime,
        duration: +this.durationInput.value,
        title: this.titleInput.value,
      };

      // control time for the new event
      if (this.durationInput.value > 0 && startTime < 540) {
        this.modalWindow.classList.remove('active');
        this.modalBtn.classList.toggle('hide');
        listOfTasks.push(newEvent);

        this.list = new ListOfEvents(listOfTasks);
        this.#renderEvents.renderEventsList(this.list.items);

        this.startInput.value = '08:00';
        this.durationInput.value = null;
        this.titleInput.value = '';
      }
    });
  }
}

const renderCalendar = new RenderCalendar();
const listofEvents = new ListOfEvents(listOfTasks);
const renderEvents = new RenderEvents(listofEvents, renderCalendar);
const inputs = new Inputs(renderEvents);
