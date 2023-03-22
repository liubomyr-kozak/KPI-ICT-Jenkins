async function fetchFruits() {
  const response = await fetch("http://localhost:3000/getFruits");
  const fruits = await response.json();
  const fruitsList = document.getElementById("fruits-list");

  fruits.forEach(fruit => {
    const li = document.createElement("li");
    li.textContent = fruit;
    fruitsList.appendChild(li);
  });
}

fetchFruits();
