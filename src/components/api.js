const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-41',
  headers: {
    authorization: 'd56b3a49-e7ce-4489-a84a-cfbf9ade9895',
    'Content-Type': 'application/json'
  }
};

export function getUserInfo() {
  return fetch('https://nomoreparties.co/v1/wff-cohort-41/users/me', {
    headers: {
      authorization: 'd56b3a49-e7ce-4489-a84a-cfbf9ade9895'
    }
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    });
} 
export function getInitialCards() {
  return fetch('https://nomoreparties.co/v1/wff-cohort-41/cards', {
    headers: {
      authorization: 'd56b3a49-e7ce-4489-a84a-cfbf9ade9895'
    }
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    });
}
export function updateUserInfo({ name, about }) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ name, about })
  }).then(res => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  });
}
export function addCard({ name, link }) {
  return fetch('https://nomoreparties.co/v1/wff-cohort-41/cards', {
    method: 'POST',
    headers: {
      authorization: 'd56b3a49-e7ce-4489-a84a-cfbf9ade9895',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, link })
  }).then(res => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  });
}

const baseUrl = 'https://nomoreparties.co/v1/wff-cohort-41';
const headers = {
  authorization: 'd56b3a49-e7ce-4489-a84a-cfbf9ade9895',
  'Content-Type': 'application/json'
};

export function deleteCard(cardId) {
  return fetch(`${baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers
  }).then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`));
}

export function toggleLike(cardId, isLiked) {
  return fetch(`${baseUrl}/cards/likes/${cardId}`, {
    method: isLiked ? 'DELETE' : 'PUT',
    headers
  }).then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`));
}

export function updateAvatar(avatarUrl) {
  return fetch('https://nomoreparties.co/v1/wff-cohort-41/users/me/avatar', {
    method: 'PATCH',
    headers: {
      authorization: 'd56b3a49-e7ce-4489-a84a-cfbf9ade9895',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ avatar: avatarUrl })
  })
  .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`));
}