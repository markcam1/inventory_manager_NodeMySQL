const inquirer = require("inquirer");
const connection = require("./connect.js");
const cTable = require('console.table');

connection.connect(function(err) {
  if (err) throw err;
  start();
});

function start() {
  inquirer
      .prompt({
      name: "manager",
      type: "rawlist",
      message: "Please choose an option:",
      choices: [ "Buy a super cool car from Fat Freddie's","Exit"]
      })
      .then(function(answer) {
          if (answer.manager == "Buy a super cool car from Fat Freddie's") {
            readInventory();
          }
          if (answer.manager == "Exit") {
              connection.end();
          }
      });
}
  
function readInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    let dbResultsObject = {}
    for (var i = 0; i < res.length; i++) {
      dbResultsObject[i] = {Vehicle_ID: res[i].item_id, Make_and_Model: res[i].product_name, Low_Price : res[i].price}
    }
    
    let displayTableArray = [];
    for (key in dbResultsObject){
      if (dbResultsObject.hasOwnProperty){
            displayTableArray.push(dbResultsObject[key]);
        }
    }
    console.table(displayTableArray);
    console.log("-----------------------------------")
    customerPrompt() 
  });
}

  function customerPrompt() {
    connection.query("SELECT * FROM products", function(err, results) {
      if (err) throw err;
      
      inquirer
        .prompt([
            {
            name: "choice",
            type: "rawlist",
            choices: function() {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                choiceArray.push(results[i].product_name);
                }
                return choiceArray;
            },
            message: "What is the vehicle_id of the  you would like to buy?",
            validate: function(value) {
              if (isNaN(value) === false) {
                return true;
              }
              return 'You must enter a NUMBER';
              }
            },
            {
            name: "qty",
            type: "input",
            message: "How many would you like to buy?",
            validate: function(value) {
              if (isNaN(value) === false) {
                return true;
              }
              return 'You must enter a NUMBER';
          }
            }
        ])
        .then(function(answer) { 
          
          console.log(answer.choice);

            var chosenItem;
            for (var i = 0; i < results.length; i++) {
              if (results[i].product_name === answer.choice) {
                chosenItem = results[i];
              }
            }
            if (chosenItem.stock_quantity - answer.qty >= 0){
                newProdSalesInt = parseInt(chosenItem.product_sales) ;
                let newQty = chosenItem.stock_quantity - answer.qty;
                let totalPrice = answer.qty * chosenItem.price;
                newProdSalesInt += parseInt(totalPrice);

                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                      {stock_quantity: newQty, product_sales : newProdSalesInt},
                      { item_id: chosenItem.item_id},
                    ],
                    function(error) {
                      if (error) throw err;
                      console.log('\x1b[32m%s\x1b[0m', "--------------------------\nYour order has been placed successfully!");
                      console.log('\x1b[32m%s\x1b[0m', "The total is: " + totalPrice);
                      console.log('\x1b[32m%s\x1b[0m', "\--------------------------");
                      start();
                    }
                  );
            }
            else{
                console.log('\x1b[41m%s\x1b[0m', "\nInsufficient quantity!");
                console.log('\x1b[41m%s\x1b[0m', "-----------------------------------");
                readInventory();
            }
        });
    });
  }