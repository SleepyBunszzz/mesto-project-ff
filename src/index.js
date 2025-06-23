import './pages/index.css';
import { openModal, closeModal } from './components/modal.js';
import { createCard } from './components/card.js';
import { enableValidation, clearValidation } from './components/validation.js';
import { getUserInfo, getInitialCards, updateUserInfo, addCard, updateAvatar } from './components/api.js';

function renderLoading(isLoading, buttonElement, defaultText = 'Сохранить') {
  buttonElement.textContent = isLoading ? 'Сохранение...' : defaultText;
}

const profilePopup = document.querySelector('.popup_type_edit');
const newCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const avatarPopup = document.querySelector('.popup_type_avatar');

const editBtn = document.querySelector('.profile__edit-button');
const addBtn = document.querySelector('.profile__add-button');
const avatarEditBtn = document.querySelector('.profile__image');

const profileForm = profilePopup.querySelector('form[name="edit-profile"]');
const nameInput = profileForm.querySelector('.popup__input_type_name');
const descInput = profileForm.querySelector('.popup__input_type_description');

const newCardForm = newCardPopup.querySelector('form[name="new-place"]');
const titleInput = newCardForm.querySelector('.popup__input_type_card-name');
const urlInput = newCardForm.querySelector('.popup__input_type_url');

const avatarForm = avatarPopup.querySelector('form[name="avatar-form"]');
const avatarInput = avatarForm.querySelector('.popup__input_type_avatar-url');

const placesList = document.querySelector('.places__list');

const imageCloseBtn = imagePopup.querySelector('.popup__close');
const avatarCloseBtn = avatarPopup.querySelector('.popup__close');
const profileCloseBtn = profilePopup.querySelector('.popup__close');
const newCardCloseBtn = newCardPopup.querySelector('.popup__close');

profileCloseBtn.addEventListener('click', () => closeModal(profilePopup));
newCardCloseBtn.addEventListener('click', () => closeModal(newCardPopup));
imageCloseBtn.addEventListener('click', () => closeModal(imagePopup));
avatarCloseBtn.addEventListener('click', () => closeModal(avatarPopup));

function handlePreview({ name, link }) {
  const img = imagePopup.querySelector('.popup__image');
  const cap = imagePopup.querySelector('.popup__caption');
  img.src = link;
  img.alt = name;
  cap.textContent = name;
  openModal(imagePopup);
}

function handleDelete(cardEl) {
  cardEl.remove();
}

function handleLike(button) {
  button.classList.toggle('card__like-button_is-active');
}

editBtn.addEventListener('click', () => {
  const titleEl = document.querySelector('.profile__title');
  const descEl = document.querySelector('.profile__description');
  nameInput.value = titleEl.textContent;
  descInput.value = descEl.textContent;
  clearValidation(profileForm, validationConfig);
  openModal(profilePopup);
});

profileForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = profileForm.querySelector('.popup__button');
  renderLoading(true, submitButton);

  updateUserInfo({ name: nameInput.value, about: descInput.value })
    .then((userData) => {
      document.querySelector('.profile__title').textContent = userData.name;
      document.querySelector('.profile__description').textContent = userData.about;
      closeModal(profilePopup);
    })
    .catch((err) => console.error('Ошибка обновления профиля:', err))
    .finally(() => renderLoading(false, submitButton));
});

addBtn.addEventListener('click', () => {
  clearValidation(newCardForm, validationConfig);
  newCardForm.reset();
  openModal(newCardPopup);
});

newCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = newCardForm.querySelector('.popup__button');
  renderLoading(true, submitButton);

  addCard({ name: titleInput.value, link: urlInput.value })
    .then((newCard) => {
      const cardEl = createCard(newCard, {
        userId,
        onDelete: handleDelete,
        onLike: handleLike,
        onPreview: handlePreview
      });
      placesList.prepend(cardEl);
      closeModal(newCardPopup);
      newCardForm.reset();
    })
    .catch((err) => console.error('Ошибка добавления карточки:', err))
    .finally(() => renderLoading(false, submitButton));
});

avatarEditBtn.addEventListener('click', () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
});

avatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = avatarForm.querySelector('.popup__button');
  renderLoading(true, submitButton);

  updateAvatar(avatarInput.value)
    .then((userData) => {
      document.querySelector('.profile__image').style.backgroundImage = `url(${userData.avatar})`;
      avatarForm.reset();
      closeModal(avatarPopup);
    })
    .catch((err) => console.error('Ошибка обновления аватара:', err))
    .finally(() => renderLoading(false, submitButton));
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

let userId = null;

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    userId = userData._id;
    document.querySelector('.profile__title').textContent = userData.name;
    document.querySelector('.profile__description').textContent = userData.about;
    document.querySelector('.profile__image').style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach((cardData) => {
      const cardEl = createCard(cardData, {
        userId,
        onDelete: handleDelete,
        onLike: handleLike,
        onPreview: handlePreview
      });
      placesList.append(cardEl);
    });
  })
  .catch((err) => console.error('Ошибка при загрузке данных:', err));
