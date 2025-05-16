const display = document.querySelector(".display");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const equalButton = document.querySelector(".equal");
const clearButton = document.querySelector(".C");

let currentInput = "";
let previousInput = "";
let currentOperation = "";
let isResultDisplayed = false;

// Update tampilan display
function updateDisplay() {
  if (currentOperation) {
    display.textContent = `${previousInput} ${currentOperation} ${currentInput}`;
  } else {
    display.textContent = currentInput || previousInput || "0";
  }
}

function appendNumber(number) {
  if (isResultDisplayed) {
    currentInput = number;
    isResultDisplayed = false;
  } else {
    currentInput += number;
  }
  updateDisplay();
}

function appendOperation(operation) {
  if (currentInput === "" && previousInput === "") return; // Tidak ada input
  if (currentInput === "" && previousInput !== "") {
    // Jika user ingin mengganti operator
    currentOperation = operation;
    updateDisplay();
    return;
  }
  if (previousInput !== "") {
    calculate(); // Hitung dulu jika ada operasi sebelumnya
  } else {
    previousInput = currentInput;
  }
  currentOperation = operation;
  currentInput = "";
  updateDisplay();
}

function calculate() {
  if (previousInput === "" || currentInput === "" || currentOperation === "") return;

  let prev = parseFloat(previousInput);
  let current = parseFloat(currentInput);
  let result;

  switch (currentOperation) {
    case "+":
      result = prev + current;
      break;
    case "-":
      result = prev - current;
      break;
    case "*":
      result = prev * current;
      break;
    case "/":
      if (current === 0) {
        alert("Cannot divide by zero");
        return;
      }
      result = prev / current;
      break;
    default:
      return;
  }

  previousInput = result.toString();
  currentInput = "";
  currentOperation = "";
  isResultDisplayed = true;
  updateDisplay();
}

function clearAll() {
  currentInput = "";
  previousInput = "";
  currentOperation = "";
  isResultDisplayed = false;
  updateDisplay();
}

// Event Listeners tombol angka
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    appendNumber(button.textContent);
  });
});

// Event Listeners tombol operator
operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    appendOperation(button.textContent);
  });
});

// Tombol sama dengan (=)
equalButton.addEventListener("click", () => {
  calculate();
});

// Tombol clear (C)
clearButton.addEventListener("click", () => {
  clearAll();
});

// Event listener keyboard
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") {
    appendNumber(e.key);
  } else if (["+", "-", "*", "/"].includes(e.key)) {
    appendOperation(e.key);
  } else if (e.key === "Enter" || e.key === "=") {
    calculate();
  } else if (e.key === "Backspace") {
    if (currentInput.length > 0) {
      currentInput = currentInput.slice(0, -1);
      updateDisplay();
    }
  } else if (e.key.toLowerCase() === "c") {
    clearAll();
  }
});
