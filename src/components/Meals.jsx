import { useEffect, useState } from "react";

export default function Meals() {
  // 컴포넌트 함수를 async함수로 사용할 수 없다.

  const [loadedMeals, setLoadedMeals] = useState([]);

  useEffect(() => {
    // 이 훅을 사용해 모든 부수적인 요소를 컴포넌트가 렌더링된 뒤에 실행할 수 있다. 또 의존성배열을 정의하여 함수가 루프에 빠지는 시점에서 함수를 제어할 수 있다.
    async function fetchMeals() {
      // try {

      // } catch (error) {

      // }

      const response = await fetch("http://localhost:3000/meals");

      if (!response.ok) {
        return;
      }

      const meals = await response.json();
      setLoadedMeals(meals);
    }

    fetchMeals();
  }, []);

  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        <li key={meal.id}>{meal.name}</li>
      ))}
    </ul>
  );
}
