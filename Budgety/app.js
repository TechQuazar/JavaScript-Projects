// -----------------------------------------------------
// Budget Controller IIFE
// -----------------------------------------------------

var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (current) {
      sum += current.value;
    });
    data.totals[type] = sum;
  };
  // ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // Main Data Storage structure
  // ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  // ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // Budget Controller Public Functions
  // ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  return {
    addItem: function (type, des, val) {
      var newItem;
      //[1,2,3,4,5] next ID=6
      //[1,2,4,6,8] next ID=9
      //therefore next ID= last ID+1
      //Create New ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id;
      } else {
        ID = 0;
      }

      //Create new Item based on 'inc' or 'exp'
      if (type == 'exp') {
        newItem = new Expense(ID, des, val);
      } else {
        newItem = new Income(ID, des, val);
      }
      //push it into the data structure and return the element
      data.allItems[type].push(newItem);
      return newItem;
    },
    calculateBudget: function () {
      //Calculate Total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');
      //calculate the total budget
      data.budget = data.totals.inc - data.totals.exp;
      if (data.totals.inc > 0) {
        //calculate the percentage income spent
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },
    testing: function () {
      console.log(data);
    },
  };
})();

// -----------------------------------------------------
// UI Controller IIFE
// -----------------------------------------------------
var uiController = (function () {
  //private variable to get all the .(classes)
  var domStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
  };
  // ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //UI Controller Public Functions
  // ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  return {
    getInput: function () {
      return {
        type: document.querySelector(domStrings.inputType).value,
        description: document.querySelector(domStrings.inputDescription).value,
        value: parseFloat(document.querySelector(domStrings.inputValue).value),
      };
    },
    addListItem: function (obj, type) {
      var html, newHtml, element;
      //Create html string with a placeholder text
      if (type == 'inc') {
        element = domStrings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        element = domStrings.expensesContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //Replace placeholder text with actual data from object
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      //Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    displayBudget: function (obj) {
      document.querySelector(domStrings.budgetLabel).textContent = obj.budget;
      document.querySelector(domStrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(domStrings.expensesLabel).textContent =
        obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(domStrings.percentageLabel).textContent =
          obj.percentage + '%';
      } else {
        document.querySelector(domStrings.percentageLabel).textContent = '---';
      }
    },

    clearFields: function () {
      var fields;
      let fieldsArr;
      fields = document.querySelectorAll(
        domStrings.inputDescription + ',' + domStrings.inputValue
      );
      fieldsArr = Array.prototype.slice.call(fields);
      // fieldsArr = JSON.parse(fields);
      fieldsArr.forEach(function (current, index, array) {
        current.value = '';
      });

      fieldsArr[0].focus();
    },
    getDOMStrings: function () {
      return domStrings;
    },
  };
})();

// -----------------------------------------------------
// Main Controller IIFE
// -----------------------------------------------------

var controller = (function (budgetCtrl, uiCtrl) {
  var setUpEventListeners = function () {
    var DOM = uiCtrl.getDOMStrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function (e) {
      if (e.keypress === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });
  };

  // ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // Update Budget Function
  // ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  var updateBudget = function () {
    //Calculate The budget
    budgetCtrl.calculateBudget();
    //return the budget
    var budget = budgetCtrl.getBudget();
    //Display the budget to the UI
    uiCtrl.displayBudget(budget);
  };

  // ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // Add Item Function
  // ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  var ctrlAddItem = function () {
    var input, newItem;
    //Get Inputs
    input = uiCtrl.getInput();
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      //Add item to the budgetControl
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      //Add list item to the UI
      uiCtrl.addListItem(newItem, input.type);
      //Clear the fields
      uiCtrl.clearFields();
      //Calculate and Update budget
      updateBudget();
    }
  };

  return {
    init: function () {
      //Init function to run the event listeners
      console.log('Application has started.');
      uiCtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      setUpEventListeners();
    },
  };
})(budgetController, uiController);

//To run all the event listeners
controller.init();
