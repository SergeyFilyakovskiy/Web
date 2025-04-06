document.getElementById("surveyForm").addEventListener("submit", function(event) {
    event.preventDefault();
  
    const product = document.getElementById("product").value;
    const quantity = document.getElementById("quantity").value;
    const rating = document.getElementById("rating").value;
    const comments = document.getElementById("comments").value;
  
    document.getElementById("resultProduct").textContent = product;
    document.getElementById("resultQuantity").textContent = quantity;
    document.getElementById("resultRating").textContent = rating;
    document.getElementById("resultComments").textContent = comments;
  
    document.getElementById("modal").style.display = "flex"; 
  });
  
  function closeModal() {
    document.getElementById("modal").style.display = "none";
  }