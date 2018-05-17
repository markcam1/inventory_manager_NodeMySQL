const mysql = require("mysql");
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
    choices: ["View Products for Sale","View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    })
    .then(function(answer) {
        if (answer.manager == "View Products for Sale") {
            readInventory();
        }
        if (answer.manager == "View Low Inventory") {
            lowInventory();
        }
        if (answer.manager == "Add to Inventory") {
            addInventory();
        }
        if (answer.manager == "Add New Product") {
            addProduct();
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
            dbResultsObject[i] = {Prod_ID:res[i].item_id, Product_Name:res[i].product_name, Department_Name:res[i].department_name, Price:res[i].price, Stock_Quantity:res[i].stock_quantity}
        }
        
        let displayTableArray = [];
        for (key in dbResultsObject){
            if (dbResultsObject.hasOwnProperty){
                displayTableArray.push(dbResultsObject[key]);
            }
        }
        console.table(displayTableArray);
        console.log("-----------------------------------"); 
        start()
    });
}

const lowInventory = () => {
    connection.query("SELECT * FROM products where stock_quantity < 5", function(err, res) {
      if (err) throw err;

        let dbResultsObject = {}
        for (var i = 0; i < res.length; i++) {
            dbResultsObject[i] = {Prod_ID:res[i].item_id, Product_Name:res[i].product_name, Department_Name:res[i].department_name, Price:res[i].price, Stock_Quantity:res[i].stock_quantity}
        }

        let displayTableArray = [];
        for (key in dbResultsObject){
            if (dbResultsObject.hasOwnProperty){
                displayTableArray.push(dbResultsObject[key]);
            }
        }
        console.table(displayTableArray);
        console.log("-----------------------------------"); 
        start()
    });
};

const addInventory = () => {
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
              message: "Enter Item_ID to add more to the inventory?"
              },
              {
              name: "qty",
              type: "input",
              message: "How many to add?",
              validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return 'You must enter a NUMBER';
              }
              }
          ])
          .then(function(answer) {          
  
              var chosenItem;
              for (var i = 0; i < results.length; i++) {
                if (results[i].product_name === answer.choice) {
                  chosenItem = results[i];
                }
              }

              let newQty = 0;
              if (answer.qty > 0){
                    newQty = parseInt(chosenItem.stock_quantity) 
                    newQty += parseInt(answer.qty);
                    console.log("\n--------------------------")
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {stock_quantity: newQty},
                            { item_id: chosenItem.item_id}
                        ],
                        function(error) {
                        if (error) throw err;
                            console.log('\x1b[33m%s\x1b[0m', "\n--------------------------\nInventory update was successfully!\n");
                            readInventory();
                        }
                    );
              }
              else{
                  console.log('\x1b[41m%s\x1b[0m',"\nInventory must be a positive whole number!");
                  console.log("-----------------------------------");
                  readInventory();
              }
          });
    });
}
 
const addProduct = () => {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;


        inquirer
        .prompt([
            {
                name: "prod",
                type: "input",
                message: "Product name = "
            },
            {
                name: "department",
                type: "rawlist",
                choices: function() {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].department_name);
                    }
                    groupedArray = choiceArray.filter(function(item, pos) {
                        return choiceArray.indexOf(item) == pos;
                    })
                    return groupedArray;
                },
                message: "Choose Department number: ",
            },
            {
                name: "price",
                type: "input",
                message: "Unit wholesale price = ",
                validate: function(value) {
                    if (isNaN(value) === false) {
                    return true;
                    }
                    return 'You must enter a NUMBER';
                }
            },
            {
                name: "units",
                type: "input",
                message: "Number of units to add = ",
                validate: function(value) {
                    if (isNaN(value) === false) {
                    return true;
                    }
                    return 'You must enter a NUMBER';
                }
            },
        ])
    .then(function(answer) {
        var dbSql = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?";
        var inputArr = [
            [answer.prod, answer.department, answer.price, answer.units]
        ]
        connection.query(dbSql,[inputArr], function(err, res) {
            if (err) throw err;
            console.log('\x1b[33m%s\x1b[0m',"\n--------------------------\nProduct update was successfully!\n");
            });
            readInventory()
        });
    });
  };