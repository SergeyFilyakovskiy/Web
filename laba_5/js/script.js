class CarCatalog {
    constructor() {
      this.cars = JSON.parse(localStorage.getItem("cars")) || [];
      this.properties = ["carSeries", "carDate", "carPurpose", "manufacturerAddress"];
    }
  
    addCar(car) {
      this.cars.push(car);
      this.updateLocalStorage();
    }
  
    removeCar(id) {
      this.cars = this.cars.filter(car => car.id !== id);
      this.updateLocalStorage();
    }
  
    addProperty(property) {
      if (!this.properties.includes(property)) {
        this.properties.push(property);
        this.updateLocalStorage();
      }
    }
  
    removeProperty(property) {
      this.properties = this.properties.filter(p => p !== property);
      this.updateLocalStorage();
    }
  
    updateLocalStorage() {
      localStorage.setItem("cars", JSON.stringify(this.cars));
      localStorage.setItem("properties", JSON.stringify(this.properties));
    }
  
    renderCars() {
      const tbody = document.querySelector("#carTable tbody");
      tbody.innerHTML = "";
      this.cars.forEach(car => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${car.id}</td>
          <td>${car.carSeries}</td>
          <td>${car.carDate}</td>
          <td>${car.carPurpose}</td>
          <td>${car.manufacturerAddress}</td>
          <td>
            <button class="deleteBtn" data-id="${car.id}">Удалить</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    }
  }
  
  const catalog = new CarCatalog();
  catalog.renderCars();
  
  document.getElementById("addPropertyBtn").addEventListener("click", () => {
    const property = document.getElementById("propertySelect").value;
    catalog.addProperty(property);
  });
  
  document.getElementById("removePropertyBtn").addEventListener("click", () => {
    const property = document.getElementById("propertySelect").value;
    catalog.removeProperty(property);
  });
  
  document.getElementById("carForm").addEventListener("submit", (event) => {
    event.preventDefault();
  
    const car = {
      id: Date.now(),
      carSeries: document.getElementById("carSeries").value,
      carDate: document.getElementById("carDate").value,
      carPurpose: document.getElementById("carPurpose").value,
      manufacturerAddress: document.getElementById("manufacturerAddress").value
    };
  
    catalog.addCar(car);
    catalog.renderCars();
    document.getElementById("carForm").reset();
  });
  
  document.getElementById("clearFormBtn").addEventListener("click", () => {
    document.getElementById("carForm").reset();
  });
  
  document.getElementById("removeEntryBtn").addEventListener("click", () => {
    const id = document.getElementById("carSeries").value; // Пример: получить ID из поля ввода
    catalog.removeCar(id);
    catalog.renderCars();
  });
  
  document.querySelector("#carTable").addEventListener("click", (event) => {
    if (event.target.classList.contains("deleteBtn")) {
      const id = event.target.dataset.id;
      catalog.removeCar(id);
      catalog.renderCars();
    }
  });
  