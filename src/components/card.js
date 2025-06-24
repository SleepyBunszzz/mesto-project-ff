import { deleteCard, toggleLike } from './api.js';

export function createCard({ name, link, owner, _id, likes = [] }, { userId, onPreview }) {
  const template = document.querySelector('#card-template').content;
  const card = template.querySelector('.card').cloneNode(true);

  const img = card.querySelector('.card__image');
  const title = card.querySelector('.card__title');
  const likeBtn = card.querySelector('.card__like-button');
  const likeCount = card.querySelector('.card__like-count');
  const deleteBtn = card.querySelector('.card__delete-button');

  img.src = link;
  img.alt = name;
  title.textContent = name;
  likeCount.textContent = likes.length;

  if (likes.some(user => user._id === userId)) {
    likeBtn.classList.add('card__like-button_is-active');
  }

  likeBtn.addEventListener('click', () => {
    const isLiked = likeBtn.classList.contains('card__like-button_is-active');

    toggleLike(_id, isLiked)
      .then((updatedCard) => {
        likeBtn.classList.toggle('card__like-button_is-active');
        likeCount.textContent = updatedCard.likes.length;
      })
      .catch(err => console.error('Ошибка при лайке:', err));
  });

  if (owner._id === userId) {
    deleteBtn.addEventListener('click', () => {
      deleteCard(_id)
        .then(() => {
          card.remove();
        })
        .catch(err => console.error('Ошибка при удалении:', err));
    });
  } else {
    deleteBtn.remove();
  }

  if (onPreview) {
    img.addEventListener('click', () => onPreview({ name, link }));
  }

  return card;
}

