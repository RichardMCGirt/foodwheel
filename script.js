const restaurants = ['Gothoms'];
const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF'];

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const selectedRestaurantDiv = document.getElementById('selectedRestaurant');
const restaurantInput = document.getElementById('restaurantInput');
const addRestaurantBtn = document.getElementById('addRestaurant');
const editRestaurantBtn = document.getElementById('editRestaurant');
const removeRestaurantBtn = document.getElementById('removeRestaurant');
const restaurantList = document.getElementById('restaurantList');

const wheelRadius = canvas.width / 2;
const arcSize = (2 * Math.PI) / restaurants.length;
let startAngle = 0;
let spinAngle = 0;
let spinTimeout = null;

function drawWheel() {
    console.log('Drawing wheel with current restaurants:', restaurants);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw segments
    const arc = (2 * Math.PI) / restaurants.length;
    for (let i = 0; i < restaurants.length; i++) {
      const angle = startAngle + i * arc;
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.moveTo(wheelRadius, wheelRadius);
      ctx.arc(wheelRadius, wheelRadius, wheelRadius, angle, angle + arc);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
  
      // Add text with larger font size
      ctx.save();
      ctx.translate(
        wheelRadius + Math.cos(angle + arc / 2) * (wheelRadius - 70), // Move text outward
        wheelRadius + Math.sin(angle + arc / 2) * (wheelRadius - 70)
      );
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      ctx.fillStyle = '#000';
      ctx.font = 'bold 18px Arial'; // Larger and bold font
      ctx.textAlign = 'center'; // Center-align text
      ctx.fillText(restaurants[i], 0, 0); // Center text on the position
      ctx.restore();
    }
  
    // Center circle
    ctx.beginPath();
    ctx.arc(wheelRadius, wheelRadius, 40, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.stroke();
  }
  
  
  function rotateWheel() {
    spinAngle *= 0.97; // Apply friction
    startAngle += (spinAngle * Math.PI) / 180;
    drawWheel();
  
    // Adjust arrow wobble speed based on spin angle
    const wobbleSpeed = Math.max(0.2, 1 / (spinAngle / 50)); // Speed slows as wheel slows
    const arrow = document.getElementById('arrow');
    arrow.style.animation = `arrowWobble ${wobbleSpeed}s infinite ease-in-out`;
  
    if (spinAngle > 0.1) {
      spinTimeout = requestAnimationFrame(rotateWheel);
    } else {
      console.log('Wheel stopped spinning.');
  
      // Ensure the arrow points to the correct segment
      const arc = (2 * Math.PI) / restaurants.length; // Size of each segment
  
      // Normalize the arrow angle to [0, 2π]
      const arrowAngle = ((Math.PI * 1.5 - startAngle) % (2 * Math.PI) + (2 * Math.PI)) % (2 * Math.PI);
  
      console.log('Normalized arrow angle:', arrowAngle);
  
      // Calculate the segment index
      const selectedIndex = Math.floor(arrowAngle / arc) % restaurants.length;
  
      console.log('Selected restaurant index:', selectedIndex);
  
      if (restaurants.length > 0 && selectedIndex >= 0) {
        selectedRestaurantDiv.textContent = `Selected Restaurant: ${restaurants[selectedIndex]}`;
        console.log('Selected restaurant:', restaurants[selectedIndex]);
      } else {
        selectedRestaurantDiv.textContent = `No restaurants available. Add some to spin the wheel!`;
        console.log('No restaurants available.');
      }
  
      // Stop arrow wobble when the wheel stops
      arrow.style.animation = '';
      spinButton.disabled = false;
    }
  }
  
  
  
  function updateRestaurantList() {
    console.log('Updating restaurant list:', restaurants);
    restaurantList.innerHTML = '';
    restaurants.forEach((restaurant, index) => {
      const li = document.createElement('li');
      li.textContent = restaurant;
      li.dataset.index = index;
      restaurantList.appendChild(li);
    });
    drawWheel(); // Redraw the wheel with the updated list
  
    // Disable spin button if no restaurants are available
    spinButton.disabled = restaurants.length === 0;
  }
  
  addRestaurantBtn.addEventListener('click', () => {
    const newRestaurant = restaurantInput.value.trim();
    if (newRestaurant && !restaurants.includes(newRestaurant)) {
      restaurants.push(newRestaurant);
      console.log('Added new restaurant:', newRestaurant);
      updateRestaurantList();
      restaurantInput.value = '';
    } else if (!newRestaurant) {
      console.log('Invalid restaurant name entered.');
      alert('Please enter a valid restaurant name.');
    } else {
      console.log('Duplicate restaurant name entered.');
      alert('Restaurant already exists.');
    }
  });
  
  editRestaurantBtn.addEventListener('click', () => {
    const selectedRestaurant = restaurantList.querySelector('.selected');
    const newRestaurant = restaurantInput.value.trim();
    if (selectedRestaurant && newRestaurant) {
      const index = parseInt(selectedRestaurant.dataset.index, 10);
      console.log('Editing restaurant:', restaurants[index], 'to:', newRestaurant);
      restaurants[index] = newRestaurant;
      updateRestaurantList();
      restaurantInput.value = '';
    } else {
      console.log('No restaurant selected or invalid name entered.');
    }
  });
  
  removeRestaurantBtn.addEventListener('click', () => {
    const selectedRestaurant = restaurantList.querySelector('.selected');
    if (selectedRestaurant) {
      const index = parseInt(selectedRestaurant.dataset.index, 10);
      console.log('Removing restaurant:', restaurants[index]);
      restaurants.splice(index, 1);
      updateRestaurantList();
      restaurantInput.value = '';
    } else {
      console.log('No restaurant selected for removal.');
    }
  });
  
  restaurantList.addEventListener('click', (e) => {
    const li = e.target;
    if (li.tagName === 'LI') {
      console.log('Restaurant selected from list:', li.textContent);
      restaurantList.querySelectorAll('li').forEach((el) => el.classList.remove('selected'));
      li.classList.add('selected');
      restaurantInput.value = li.textContent;
    }
  });
  
  spinButton.addEventListener('click', () => {
    console.log('Spin button clicked.');
    spinButton.disabled = true;
    selectedRestaurantDiv.textContent = '';
    spinAngle = Math.random() * 1000 + 500;
    console.log('Spin initiated. Initial spin angle:', spinAngle);
  
    rotateWheel();
  });
  
  // Initial rendering
  updateRestaurantList();
  drawWheel();
  