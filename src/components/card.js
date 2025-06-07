export function createCard({ name, link }, { onDelete, onLike, onPreview }) {
  const template = document.querySelector('#card-template').content;
  const card = template.querySelector('.card').cloneNode(true);
  const img = card.querySelector('.card__image');
  const title = card.querySelector('.card__title');
  const likeBtn = card.querySelector('.card__like-button');
  const deleteBtn = card.querySelector('.card__delete-button');

  img.src = link;
  img.alt = name;
  title.textContent = name;

  if (onDelete) deleteBtn.addEventListener('click', () => onDelete(card));
  if (onLike) likeBtn.addEventListener('click', () => onLike(likeBtn));
  if (onPreview) img.addEventListener('click', () => onPreview({ name, link }));

  return card;
}