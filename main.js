let cardContent = document.querySelector(".card__content");
let input = document.querySelector(".card__input-container__input");
let btnAdd = document.querySelector(".card__input-container__button-add");
let pagination = document.querySelector(".card__footer__pagination");
let emptyListMessage = document.querySelector(".card__content__empty-list");
let noteCount = document.querySelector(".card__footer__note-count");

const SAVEDNOTES = "savedNotes";
let notes = new Array();
let currentPage = 1;
const pageSize = 8;
const numOfPageButton = 5;

let saveItems = () => {
  let saveNotes = JSON.stringify(notes);
  localStorage.setItem(SAVEDNOTES, saveNotes);
};

let addItem = (_content) => {
  notes.push(_content);
  saveItems();
};

let removeItem = (_index) => {
  notes.splice(_index, 1);
  saveItems();
};

let addItemToView = (_index, _content) => {
  let cardContentItem = document.createElement("div");
  let contentContainer = document.createElement("div");
  let content = document.createElement("div");
  let index = document.createElement("div");
  let btnContainer = document.createElement("div");
  let btnDetail = document.createElement("button");
  let btnDelete = document.createElement("button");

  cardContentItem.classList.add("card__content__item");
  contentContainer.classList.add("card__content__item__content-container");

  index.innerHTML = _index;
  index.classList.add("card__content__item__content-container__index");

  content.innerHTML = _content;
  content.classList.add("card__content__item__content-container__content");

  contentContainer.append(index);
  contentContainer.append(content);

  btnContainer.classList.add("card__content__item_button-container");
  btnDetail.classList.add(
    "card__content__item_button-container__button--detail",
    "card__content__item_button-container__button"
  );
  btnDelete.classList.add(
    "card__content__item_button-container__button--delete",
    "card__content__item_button-container__button"
  );

  btnDetail.innerHTML = "Detail";
  btnDelete.innerHTML = "Remove";

  // btnContainer.append(btnDetail);
  btnContainer.append(btnDelete);

  cardContentItem.append(contentContainer);
  cardContentItem.append(btnContainer);
  cardContent.append(cardContentItem);

  btnDelete.addEventListener("click", () => {
    removeItem(_index - 1);
    let page = Math.ceil(notes.length / pageSize);
    if (currentPage > page) {
      currentPage = page;
    }
    renderNotes(currentPage);
  });
};

let renderNotes = (_currentPage) => {
  cardContent.replaceChildren();
  paginationCalculation();
  checkEmptyAndShowMessage();

  noteCount.innerHTML = notes.length > 0 ? `Count: ${notes.length}` : "";
  if (notes.length === 0) {
    return;
  }

  for (
    let index = (_currentPage - 1) * pageSize;
    index < _currentPage * pageSize;
    index++
  ) {
    if (index < notes.length) {
      addItemToView(index + 1, notes[index]);
    }
  }
};

btnAdd.addEventListener("click", () => {
  if (!input.value) {
    alert("You must enter task title to add new task!");
    return;
  }
  addItem(input.value);
  if (currentPage === 0) {
    currentPage = 1;
  }
  renderNotes(currentPage);
  input.value = null;
});

input.addEventListener("keypress", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    btnAdd.click();
  }
});

let paginationCalculation = () => {
  pagination.replaceChildren();
  let page = Math.ceil(notes.length / pageSize);
  let btnPrev = document.createElement("button");
  btnPrev.classList.add("card__footer__pagination__button");
  btnPrev.innerHTML = "<";
  btnPrev.addEventListener("click", () => {
    if (currentPage === 1) {
      return;
    }
    currentPage = currentPage - 1;
    renderNotes(currentPage);
  });
  if (notes.length > 0) {
    pagination.append(btnPrev);
  }

  let startPage = () => {
    if (currentPage > 2) {
      return currentPage - 2;
    } else {
      return 1;
    }
  };

  let endPage = () => {
    if (currentPage > 2) {
      if (currentPage >= page) {
        return page;
      }
      return currentPage + 2 > page ? page : currentPage + 2;
    } else {
      return numOfPageButton > page ? page : numOfPageButton;
    }
  };

  for (let index = startPage(); index <= endPage(); index++) {
    if (index > notes.length) {
      break;
    }
    let btn = document.createElement("button");
    btn.classList.add("card__footer__pagination__button");
    if (currentPage === index) {
      btn.classList.add("active");
    }
    btn.innerHTML = index;
    btn.addEventListener("click", () => {
      currentPage = index;
      renderNotes(currentPage);
    });
    pagination.append(btn);
  }

  let btnNext = document.createElement("button");
  btnNext.classList.add("card__footer__pagination__button");
  btnNext.innerHTML = ">";
  btnNext.addEventListener("click", () => {
    if (currentPage === page) {
      return;
    }
    currentPage = currentPage + 1;
    renderNotes(currentPage);
  });
  if (notes.length > 0) {
    pagination.append(btnNext);
  }
};

let checkEmptyAndShowMessage = () => {
  if (notes.length > 0) {
    emptyListMessage.classList.add("card__content__empty-list-hidden");
    return;
  }
  cardContent.append(emptyListMessage);
  emptyListMessage.classList.remove("card__content__empty-list-hidden");
};

let loadSaveItems = () => {
  let savedNotes = JSON.parse(localStorage.getItem(SAVEDNOTES));
  notes = savedNotes === null ? new Array() : savedNotes;
  if (notes.length > 0) {
    renderNotes(currentPage);
  }
};

loadSaveItems();
