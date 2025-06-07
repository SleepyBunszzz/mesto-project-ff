export function openModal(popup) {
  popup.classList.add('popup_is-opened', 'popup_is-animated');
  document.addEventListener('keydown', handleEscClose);
  popup.addEventListener('mousedown', handleOverlayClose);
}

export function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscClose);
  popup.removeEventListener('mousedown', handleOverlayClose);
}

function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const opened = document.querySelector('.popup_is-opened');
    if (opened) closeModal(opened);
  }
}

function handleOverlayClose(evt) {
  if (evt.target.classList.contains('popup')) {
    closeModal(evt.currentTarget);
  }
}