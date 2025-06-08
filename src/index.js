import './pages/index.css';
import { initialCards } from './components/cards.js';
import { openModal, closeModal } from './components/modal.js';
import { createCard } from './components/card.js';

const profilePopup = document.querySelector('.popup_type_edit');
const newCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

const editBtn = document.querySelector('.profile__edit-button');
const addBtn = document.querySelector('.profile__add-button');

const titleEl = document.querySelector('.profile__title');
const descEl = document.querySelector('.profile__description');

const profileForm = profilePopup.querySelector('form[name="edit-profile"]');
const nameInput = profileForm.querySelector('.popup__input_type_name');
const descInput = profileForm.querySelector('.popup__input_type_description');

const newCardForm = newCardPopup.querySelector('form[name="new-place"]');
const titleInput = newCardForm.querySelector('.popup__input_type_card-name');
const urlInput = newCardForm.querySelector('.popup__input_type_url');

const placesList = document.querySelector('.places__list');

editBtn.addEventListener('click', () => {
  nameInput.value = titleEl.textContent;
  descInput.value = descEl.textContent;
  openModal(profilePopup);
});

profilePopup.querySelector('.popup__close').addEventListener('click', () => closeModal(profilePopup));

profileForm.addEventListener('submit', evt => {
  evt.preventDefault();
  document.querySelector('.profile__title').textContent = nameInput.value;
  document.querySelector('.profile__description').textContent = descInput.value;
  closeModal(profilePopup);
});

addBtn.addEventListener('click', () => openModal(newCardPopup));
newCardPopup.querySelector('.popup__close').addEventListener('click', () => closeModal(newCardPopup));

function handleDelete(cardEl) { cardEl.remove(); }
function handleLike(button) { button.classList.toggle('card__like-button_is-active'); }
function handlePreview({ name, link }) {
  const img = imagePopup.querySelector('.popup__image');
  const cap = imagePopup.querySelector('.popup__caption');
  img.src = link; img.alt = name;
  cap.textContent = name;
  openModal(imagePopup);
}
imagePopup.querySelector('.popup__close').addEventListener('click', () => closeModal(imagePopup));

newCardForm.addEventListener('submit', evt => {
  evt.preventDefault();
  const cardData = { name: titleInput.value, link: urlInput.value };
  const cardEl = createCard(cardData, { onDelete: handleDelete, onLike: handleLike, onPreview: handlePreview });
  placesList.prepend(cardEl);
  newCardForm.reset();
  closeModal(newCardPopup);
});

initialCards.forEach(data => {
  const cardEl = createCard(data, { onDelete: handleDelete, onLike: handleLike, onPreview: handlePreview });
  placesList.append(cardEl);
});