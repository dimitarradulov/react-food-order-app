import { useState, useEffect } from 'react';

import useFetch from '../../hooks/use-fetch';
import classes from './AvailableMeals.module.css';
import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';

const AvailableMeals = () => {
  const [mealsData, setMealsData] = useState([]);
  const { errorOccured, isLoading, httpRequest } = useFetch();

  const applyDataTransformation = function (data) {
    const transformedData = [];

    Object.keys(data).forEach((mealKey) => {
      transformedData.push({ id: mealKey, ...data[mealKey] });
    });

    setMealsData(transformedData);
  };

  useEffect(() => {
    httpRequest(
      {
        url: 'https://custom-hooks-9ea7a-default-rtdb.europe-west1.firebasedatabase.app/meals.json',
      },
      applyDataTransformation
    );
  }, [httpRequest]);

  let content = <p>Loading...</p>;

  if (!isLoading && !errorOccured) {
    const mealsList = mealsData.map((meal) => (
      <MealItem
        key={meal.id}
        id={meal.id}
        name={meal.name}
        description={meal.description}
        price={meal.price}
      />
    ));

    content = <ul>{mealsList}</ul>;
  }

  if (errorOccured) {
    content = <p>{errorOccured}</p>;
  }

  return (
    <section className={classes.meals}>
      <Card>{content}</Card>
    </section>
  );
};

export default AvailableMeals;
