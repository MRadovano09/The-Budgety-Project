
// WHAT I WILL LEARN:

// 1. How to use the module pattern;
// 2. More about private and public data, encapsulation and separation of concerns
// Encapsulation allows us to hide specific data from the outside scope so that we only expose a public interface which is called an API.
// API - application programming interface - a piece of code that enables different services and applications to communicate and share information with each other

// TO CREATE MODULES WE NEED KNOWLEDGE OF 1) CLOSURES  2) IIFE's 

// THIS IS THE MODULE PATTERN:
// the var will be an IIFE that will return an object




/************************************************************ */
// BUDGET CONTROLLER


var budgetController = (function() { //we return functions that we want the outside scope to have access to
    //first we're going to create a function constructor so that we can store income and expenses as separate objects with their own ID's
    
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1; //initially non-existent
    };
    
    Expense.prototype.calcPercentage = function(totalIncome) {
    
        if (totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage; //we just use this function so we can return the percentage otuside of this controller
    }




    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    // now that we have Income and Expense object-making automatized, we gotta store all of these new objects somewhere - let's make ARRAYS! And instead of just declaring these arrays and variables here willy-nilly, we're gonna structure them inside a data object to keep code tidy
    
    /* "Inefficient version:"
    var allExpenses = [];
    var allIncomes = [];
    var totalExpenses = 0;   
    var totalIncomes = 0; */
    // We will make an object containing two objects with both sets of data separately.
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1 // -1 is a value used to say that smth is "non-existent", there can be no percentage as no items are initially available
    };


var calculateTotal = function(type) {
    var sum = 0; // initial value of sum that we have to get by looping over the income and expenses array
   data.allItems[type].forEach(function(cur) {
    sum += cur.value

   }); //forEach accepts callback functions
   data.totals[type] = sum;



};


// with this method we're devising a way for this module to interact with and receive/send information to other modules. In order to avoid confusion, the arguments are named differently than in the function constructors
return { // the "type" is what we get from the "var input = UICtrl.getinput();" line
    addItem: function(type, des, val) {
        var newItem, ID;

        // ID = 0; //it's a unique item which every new item gets, so how do we specify it?      // [0 1 2 3 4 5], next ID = 6 -> using an array to store ID here would be a bad idea because once we had to remove items from the array the ID's would be like [1 2 4 6 7]. So if we were to say that the next ID =6, we could have two elements with ID 6. Each ID should only exist once. So we want the ID to be equal to:    ID = last ID + 1 
        // here we want ID = last ID + 1
        
        if (data.allItems[type].length > 0) {
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1; // what this says is that the ID is the last element of data.allItems[inc/exp] // the last element is essentially "array.length - 1" . Example [0, 1, 2, 3] - the length of this array is 4 but since we start counting with zero, we say 4 - 1 = 3, or the last array element.          // i.e. ID = data.allItems[inc][5] - because it's an array within an array - so ID equals array item no. 5 stored in data.allItems[inc]
        } else {
            ID = 0; //the if statement is here because it allows the first element to start as 0 element of array, if we don't define it as such, we get a bug.
        }
        // Create new item based on inc/exp type
        if ( type === "exp" ) {
            newItem = new Expense(ID, des, val);
 
        } else if (type === "inc") {
            newItem = new Income(ID, des, val);
        }
        // push the element into our data structure and return new element
    data.allItems[type].push(newItem);        
    return newItem;    //we're calling this because a new function from another module that will call this one can have direct access to the item we've just created 
    },


    deleteItem: function(type, id) {

        var ids, index;
        // i.e.   id = 6
        //data.allItems[type][id] - this method wouldn't work as basically ordering JS to erase id = 3 would basically erase, say, 6 here. They're not in order cos we can delete items
        // ids = [1 2 4 6 8]  // What we want to here is to create an array w/ all of the ID numbers that we have and then find out what the index of our input ID is (or, the index of the element we wanna remove)
        // index = 3
        ids = data.allItems[type].map(function(current) {
            return current.id;
        }); //the "map" has access to certain methods that apply to the array but the difference is that forEach won't create a new array, but "map" DOES. So we're gonna loop over an array now to create a new array
    
        index = ids.indexOf(id); //the indexOf method returns the index of the element of the array hthat we input in the argument
        
        if (index !== -1) {
            data.allItems[type].splice(index, 1); // "splice" starts removing items from arrays. The first argument tells which element to remove (the current element in the new array) and how many elements to remove (1)
        }

    },



    calculateBudget: function() {

        // calculate total income and expenses
        calculateTotal("exp");
        calculateTotal("inc");

        
        // calculate the budget: income - expenses
        data.budget = data.totals.inc - data.totals.exp;


        // calculate the percentage of income that we spent
        if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        } else {
            data.percentage = -1;
        }
            

    },

    calculatePercentages: function() {
        /*  
        Imagined expenses:
        a = 20
        b = 10
        c = 40
        income = 100
        a = 20 / 100 = 20%
        b = 10 / 100 = 10%
        c = 40 / 100 = 40%
        */     //We have to create a method which calculates the % of each of the expenses instead of just the total expenses % which we already have
        // We have to add a method to the prototype of the  Expense function constructor. We will also always need the total income as argument to be able to calculate it. We also have to add the percentage property tto Expense constructor

        data.allItems.exp.forEach(function(cur) {
            cur.calcPercentage(data.totals.inc);
        });


    },

    getPercentages: function() { //we use the 'map' here because unlike foreach it stores the results in an array whose info we'll need outside 
        var allPerc = data.allItems.exp.map(function(cur) {
            return cur.getPercentage();
        });     
        return allPerc;
    },

    getBudget: function() { //this function only returns an anonymous object (the most efficient way of returning sets of data) with the 4 calculations so that we can use them outside of this module, and in the controller module, we basically assign this anon. object to the var budget
        return {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage
        }


    },


    // here to check whether new info gets stored within the data variable: "budgetController.testing();" in console
    testing: function() {
        console.log(data);
    }    
}


}) ();






/********************************************************* */
// UI CONTROLLER


var UIController = (function() {

    var DOMstrings = { //used so class instances can be replaced with this in case class names in html get changed. (Very unnecessary IMHO)
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expensesLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensesPercLabel: ".item__percentage",
        dateLabel: ".budget__title--month"
    };

    var formatNumber = function(num, type) { //the number is the expense/income number we receive, and the type is exp or inc
        var numSplit, int, dec, type;
        // + or - before the number, exactly 2 decimal points AND comma separating the thousands. 
        // ie  2310.4567 ->  will look like  " + 2,310.46 "
        // 2000 -> + 2,000.00

        num = Math.abs(num); // we first convert the received number into an absolute -> eliminates "-"
        num = num.toFixed(2); //even a primitive can have a method - the JS converts it to an obj. It puts two decimals on the numbers
        // you can try it out in the console -> "(2.425555).toFixed(3)  ->   "2.425"
        // now we're gonna split the thousands with a comma, so we have to split the num into the decimal and the integer part. The trickiest.

        numSplit = num.split("."); //the split will give us an array with the decimal and the integer part of the number

        int = numSplit[0];
        dec = numSplit[1]

        if (int.length > 3) { //the number we get will be a string so we can use the length property on it, essentially saying that anything w/ more than 3 characters follows these guidelines:
         //   int = int.substr(0, 1) + "," + int.substr(1, 3);                               //the substring method only returns the part of the string that we actually want. The 1st argument says will start at first element (0) and 2nd that we'll read one element (1), which is in this case the 1st number. But we need to make it more dynamic so we're gonna use the length property since, with these rules 23110 would be 2,3110 instead of 23,110 so we need to switch it up a bit:
            int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3) // 24503  -> 24, 503
        }

        /* type === "exp" ? sign = "-" : sign = "+"
                return type + " " + int + dec; */

        return (type === "exp" ? "-" : "+") + " " + int + "." + dec;

    };

    var nodeListForEach = function(list, callback) {// list = the node list / this nodeListForEach function will be a loop which will in each iteration of the elements of the nodeList call the callback function. Simple and, by putting it in this function, it serves as separate, reusable code
        
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };
    return { //we're gonna return an object to the IIFE so we can use its data outside of this module. EVERYTHING within this is PUBLIC
        getinput: function() {
           
            /*
            var type = document.querySelector(".add__type").value; //Will be either "inc" or "exp" (income/expense)
            var description = document.querySelector(".add__description").value;
            var value = document.querySelector(".add__value").value;
                // now we gotta return these values that we gained from these three html input fields by rewriting them as an object that we return:
            */
        return {
            type: document.querySelector(DOMstrings.inputType).value, //za ovo su jedine values ono sto je u HTML-u u select kutiji - income ili expense
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value) //parseFloat will convert the value we type in from a string into a number 
        }

    }, 

    // the "obj" here will be the object we created with the function constructor and passed to our app controller.
    
     addListItem: function(obj, type) {
        var html, newHtml, element;
        // Create HTML string with placeholder text
        
        if (type === 'inc') {
            element = DOMstrings.incomeContainer;
            
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (type === 'exp') {
            element = DOMstrings.expensesContainer;
            
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        
        //2. Replace placeholder with received data  - using a new method - "REPLACE"
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

        //3. Insert HTML into DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); // we use "beforeend" as we want new items to be added one below the other



    },

    deleteListItem: function(selectorID) { //here we want the ID of the entire div container that's keeping our new info in the UI (the one with item clearfix class and i.e. inc-1 ID) 
    // !!! in JS we cannot delete an element, we can only remove a child. but first we start by selecting the element:
    var el = document.getElementById(selectorID)

    el.parentNode.removeChild(el) // this is weird but first we select the element we wanna remove, then MOVE UP one step via parentNode x1 and THEN we remove the element by using it as argument in removeChild method.



    },


    clearFields: function() {
        var fields;

        fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue); // we're basically selecting all of the ".add__description" and ".add__value" instances in the document
        
        var fieldsArr = Array.prototype.slice.call(fields) // the querySelectorAll does not return an array but a NODE LIST, so we're basically converting the node list into an array by invoking the slice method of the Array prototype and using the 'fields' node list as argument. We need to do this so we can loop the array with "forEach"
        
        fieldsArr.forEach(function(current, index, array) { //the "current" is the element being processed
            current.value = ""; // the value of both current elements of the array being processed are "" - clearing the field

        });

        fieldsArr[0].focus(); // JS method which goves focus to an HTML element. It sets it as the active element in the current document.
    },

    displayBudget: function(obj) {

        document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
        document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
        document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
        
        if (obj.percentage > 0) {
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
        } else {
            document.querySelector(DOMstrings.percentageLabel).textContent = "---";
        }
    },



    displayPercentages: function(percentages) { // we cant use vanilla query selector bcs the id's of the added elements will be added after the page is loaded

        var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
        // we'll have to loop over the nodes in the DOM and change properties for all of them, but the node list that we'll get doesn't have the forEach method. We could use the splice method as a workaround, but there's a more effective solution: creating a forEach function but for nodelists instead of arrays


      
        nodeListForEach(fields, function(current, index) { //this is the callback function invoked above that will update the DOM

            if (percentages[index] > 0) {
            current.textContent = percentages[index] + "%"; //we want DOM to be updated with percentages of the current index
            } else {
                current.textContent = "---";
            }
        });
    
    },

    
    displayMonth: function() { //This is called  in the init() so it starts when we load the page
       var now, year, month, months;
       now = new Date();
       // var christmas = new Date(2018, 11, 25)
       months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
       year = now.getFullYear(); // we use the getFullYear method on the Date prototype that it inherited
       month = now.getMonth();
       document.querySelector(DOMstrings.dateLabel).textContent = months[month] + " " + year;
    },


    changeType: function() {
            
        var fields = document.querySelectorAll(
            DOMstrings.inputType + ',' +
            DOMstrings.inputDescription + ',' +
            DOMstrings.inputValue);
        
        nodeListForEach(fields, function(cur) {
           cur.classList.toggle('red-focus'); 
        });
        
        document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        
    },
    
    
    getDOMstrings: function() {
        return DOMstrings;
    }
};

})();


// we make these fully independent modules interact via the CONTROLLER module
// modules can also receive arguments bcs they are just function expressions so we can pass arguments into them. So we're gonna pass the previous two modules into it as argument so that it knows about the other two and can connect them.




/***************************************************************************** */
// GLOBAL APP CONTROLLER



var controller = (function(budgetCtrl, UICtrl) {


var setupEventListeners = function() {
    var DOM = UICtrl.getDOMstrings(); //now we've got the DOMstrings object available in this module too.

document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem); // this is a callback function that invokes the ctrlAddItem function when mouse is clicked
    
//We add keypress event in the global document as key press doesn't happen on any specific element. - EDITED - we placed it in a separate function to keep things tidy, used to be in the global document
document.addEventListener("keypress", function(event) {

    if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
    }
 });

 document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);

 document.querySelector(DOM.inputType).addEventListener("change", UICtrl.changeType)
};


// this function is the CONTROL CENTER of the APP - tells other modules what to do



var updateBudget = function() {
    
    //1. Calculate the budget
    budgetCtrl.calculateBudget();

    //2. Return the budget
    var budget = budgetCtrl.getBudget();

    //3. Display budget in UI
    //console.log(budget);
    UICtrl.displayBudget(budget);

};


var updatePercentages = function() { //similar to updateBudget

    // 1. Calculate percentages
    budgetCtrl.calculatePercentages();

    // 2. Read percentages from budgetCtrl
    var percentages = budgetCtrl.getPercentages();

    // 3. Update the UI with the new %
    UICtrl.displayPercentages(percentages);
    console.log(percentages);
};






var ctrlAddItem = function() {
    
    var input, newItem;
    
    
    //1. Get the filed input data
    input = UICtrl.getinput(); //this variable is basically a called function that will return the object from UI Controller containing our input values. We get object with our input values
    console.log(input);
    
    if (input.description !== "" && !isNaN(input.value) && input.value > 0 )  // with this we say "do this only if the description is not empty and the number is not "not a Number (Nan)" and the number is more than zero"
    {
    //2. Add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value); //since the function call gives us an object, we have to create a variable to store it in (newItem)
    
    //3. Add the item to the UI
    UICtrl.addListItem(newItem, input.type);
    
    //3a. Clear the fields
    UICtrl.clearFields();
    
    // 4. Calculate and update budget
    updateBudget();

    // 5. Calculate and update % 
    updatePercentages();

    };
    
};





var ctrlDeleteItem = function(event) { //we're putting the 'event' as argument bcs we need to know what the target element is as we're using event delegation to delete items which are not initially loaded within our DOM when we init. the page
var itemID, splitID, type, ID;


// console.log(event.target.parentNode.parentNode.parentNode.parentNode.id); //when we click the button on the target element, the console will give us the name of its parent element - this is DOM traversal - helps us identify components for event delegation. We use parentNode x4 so we can move up enough to actual element (check HTML - we need "item clearfix" class and then we retrieve its ID with this. Clicking on the delete btn will give use the parent element.
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; //the ID we're getting will be inc-0, inc-1, exp-0, exp-1, etc depending on which delete button on the list we click
    
    if (itemID) { //"if item has ID -> there's only one ID element in our html

        //inc-1    
        splitID = itemID.split("-"); //this is a METHOD applied to a STRING. Possible for strings to have methods as primitives in JS because JS actually uses a wrapper to convert the strings into objects when methods are called, essentially giving primitives access to methods. And "split" will actually take the results (say, "inc-1") and split the wrapped string into an array containing [inc, 1] -> it splits the string into an array by separating it with the declared symbol, in this case "-" in "inc-1"
        type = splitID[0]; //it will be either "inc" or "exp" based on the fact that the 0 element in the split array will be either one
        ID = parseInt(splitID[1]); // with 'parseInt' we convert the number string into an actual integer number so that we can use it in the method below as argument. Otherwise it doesn't work at all bcs that method expects a number and not a string 

        // 1. Delete item from data structure
        budgetCtrl.deleteItem(type, ID);

        // 2. Delete item from UI
        UICtrl.deleteListItem(itemID);

        // 3. Update and show the new budget
        updateBudget();

    }


};










return {
    init: function() {
            console.log("Application has started")
            UICtrl.displayMonth();
            UICtrl.displayBudget({  // we set the initial displayed values to 0 by initializing the function by using an anonymous object as argument
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners(); //this calls the eventListeners function so it can exit into the global, public scope
        }
    };


}) (budgetController, UIController);

controller.init(); // the return command for this function in the controller IIFE only returns the function to the global scope and makes it public, we still gotta call it the old-fashioned way here.




// LESSON 2 : How to set up event listeners for keypress events / how to use EVENT OBJECT
// LESSON 3: how to read data from different HTML input types; 
// LESSON 4: creating an INITIALIZATION function (like in the pig game)
// LESSON 5: creating income/expense function constructors - how to choose function constructors that meet app's needs / how to set up a proper data structure for the budget controller
// LESSON 6: How to avoid conflicts in the data structure / how and why to pass data from one module to another
// LESSON 7: A technique for adding big chunks of HTML into the DOM / how to replace parts of strings / how to do DOM manipulation via the "insertAdjacentHTML" method
// LESSON 8 : CLEARING OUR INPUT FIELDS - how to clear HTML fields / use querySelectorAll / convert list into an array / a better way to loop over an array then "for" loops: foreach
// 9. Updating the budget: Controller // how to convert field inputs to numbers / how to prevent false inputs
// 10. Updating the budget controller: How and why to create simple reusable functions w/ only one purpose / how to sum all elements of an array using the forEach method
// 11. EVENT DELEGATION - Basically the intro to deleting our inputs / how to use it / How to use ID's in HTML to connect the UI with the data model / How to use the "parentNoder" property for DOM traversal
// 12. DELETING ITEM FROM BUDGET CONTROLLER - Will learn another method to loop over array: "map" / How to remove elements from an array using the "splice" method
// 13. DELETING ITEM FROM THE UI - More DOM manipulation / How to remove DOM element / 
// 14. UPDATING THE PERCENTAGES - How to make the budgetCtrl interact with the Expense prototype

/******************************
 * EVENT DELEGATION
 * *****************************/

/*    1) EVENT BUBBLING - when an event has triggered on some DOM element (i.e. btn click) then the exact same event is also triggered on all the parent elements up until the HTML element which is the root. It "bubbles up". The event that caused it to happen is the TARGET ELEMENT
     2) EVENT DELEGATION - if we know whhere the event was fired, we can attach an event handler to a parent element and wait for the event to bubble up and then we can do what we intended to the target element. - event delegation - basically attaching the event handler to parent element and waiting for event to bubble up


     USE CASES FOR EVENT DELEGATION:
     1) Whhen we have an element with lots of child elements that we are interested in
     (We will have a lot of new budgety items as we add 'em up)

     2) When we want an event handler attached to an element that is not yet in the DOM when our page is loaded.
     (useful here because we'll wanna delete items from Budgety that are non-existent when we first load the app) */

// 15. UPDATING PERCENTAGES - How to create our own forEach function but for nodeLists instead of arrays 
// 16. DISPLAYINHG THE MONTH - how to get the current date by using the Date object constructor
// 17. POLISHING UP - How and when to use "change" events - changing the color of input boxes to red when expenses are selected