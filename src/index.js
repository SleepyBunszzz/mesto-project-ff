import './pages/index.css';
import { initialCards } from './components/cards.js';
import { openModal, closeModal } from './components/modal.js';
import { createCard } from './components/card.js';
import { enableValidation, clearValidation } from './components/validation.js';

const profilePopup = document.querySelector('.popup_type_edit');
const newCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

const editBtn = document.querySelector('.profile__edit-button');
const addBtn = document.querySelector('.profile__add-button');
const profileCloseBtn = profilePopup.querySelector('.popup__close');
const newCardCloseBtn = newCardPopup.querySelector('.popup__close');
const imageCloseBtn = imagePopup.querySelector('.popup__close');

const profileForm = profilePopup.querySelector('form[name="edit-profile"]');
const nameInput = profileForm.querySelector('.popup__input_type_name');
const descInput = profileForm.querySelector('.popup__input_type_description');

const newCardForm = newCardPopup.querySelector('form[name="new-place"]');
const titleInput = newCardForm.querySelector('.popup__input_type_card-name');
const urlInput = newCardForm.querySelector('.popup__input_type_url');

const placesList = document.querySelector('.places__list');

function handleDelete(cardEl) {
  cardEl.remove();
}

function handleLike(button) {
  button.classList.toggle('card__like-button_is-active');
}

function handlePreview({ name, link }) {
  const img = imagePopup.querySelector('.popup__image');
  const cap = imagePopup.querySelector('.popup__caption');
  img.src = link;
  img.alt = name;
  cap.textContent = name;
  openModal(imagePopup);
}

editBtn.addEventListener('click', () => {
  const titleEl = document.querySelector('.profile__title');
  const descEl = document.querySelector('.profile__description');
  nameInput.value = titleEl.textContent;
  descInput.value = descEl.textContent;

  clearValidation(profileForm, validationConfig);
  openModal(profilePopup);
});

profileCloseBtn.addEventListener('click', () => closeModal(profilePopup));

profileForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  document.querySelector('.profile__title').textContent = nameInput.value;
  document.querySelector('.profile__description').textContent = descInput.value;
  closeModal(profilePopup);
});

addBtn.addEventListener('click', () => {
  clearValidation(newCardForm, validationConfig);
  newCardForm.reset();
  openModal(newCardPopup);
});

newCardCloseBtn.addEventListener('click', () => closeModal(newCardPopup));

imageCloseBtn.addEventListener('click', () => closeModal(imagePopup));

newCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const cardData = {
    name: titleInput.value,
    link: urlInput.value
  };
  const cardEl = createCard(cardData, {
    onDelete: handleDelete,
    onLike: handleLike,
    onPreview: handlePreview
  });
  placesList.prepend(cardEl);
  newCardForm.reset();
  closeModal(newCardPopup);
});

initialCards.forEach((data) => {
  const cardEl = createCard(data, {
    onDelete: handleDelete,
    onLike: handleLike,
    onPreview: handlePreview
  });
  placesList.append(cardEl);
});

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

enableValidation(validationConfig);
