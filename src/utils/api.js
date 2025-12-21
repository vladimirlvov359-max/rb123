export const BASE_URL = 'https://norma.education-services.ru/api';

export const checkResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`Ошибка: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error('Ошибка API');
  }

  return data;
};

export const request = async (endpoint, options = {}) => {
  const { headers = {}, ...restOptions } = options;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...restOptions,
  });

  return checkResponse(response);
};
