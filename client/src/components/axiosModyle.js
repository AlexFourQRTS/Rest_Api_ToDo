import React from 'react';
import Axios from './components/Axios';

const axiosModyle = () => {
  return (
    <Axios
      url="https://api.example.com/data"
      method="get"
      onSuccess={(data) => console.log('Успех:', data)}
      onError={(error) => console.error('Ошибка:', error)}
    >
      {({ isLoading, result, error }) => {
        if (isLoading) {
          return <div>Загрузка...</div>;
        }

        if (error) {
          return <div>Ошибка: {error.message}</div>;
        }

        if (result) {
          return <div>Данные: {JSON.stringify(result)}</div>;
        }

        return <div>Нет данных</div>;
      }}
    </Axios>
  );
};

export default axiosModyle;