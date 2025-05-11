// @todo: Темплейт карточки

// @todo: DOM узлы
const placesList = document.querySelector('.places__list');
const cardTemplateContent = document                             
  .querySelector('#card-template')
  .content;
// @todo: Функция создания карточки
function createCard({ name, link }, onDelete) {
    const cardElement = cardTemplateContent
      .querySelector('.card')
      .cloneNode(true);
      const cardImage = cardElement.querySelector('.card__image');
      const cardTitle = cardElement.querySelector('.card__title');
      const deleteBtn = cardElement.querySelector('.card__delete-button');
      cardImage.src = link;
      cardImage.alt = name;
      cardTitle.textContent = name;
      deleteBtn.addEventListener('click', () => onDelete(cardElement));
    return cardElement;
}
// @todo: Функция удаления карточки
function removeCard(cardElement) {
    cardElement.remove();
  }

// @todo: Вывести карточки на страницу
initialCards.forEach(cardData => {
    const cardElement = createCard(cardData, removeCard);
    placesList.append(cardElement);
  });