const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');
const connection = require("./connect.js");

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
        choices: [ "View Product Sales by Department","Create New Department","Exit"]
        })
        .then(function(answer) {
            if (answer.manager == "View Product Sales by Department") {
                readProductSales();
            }
            if (answer.manager == "Create New Department") {
                createNewDepartment();
            }
            if (answer.manager == "Exit") {
                connection.end();
            }
        });
}

function ProdSales(departName, overheadCost) {
    this.departName = departName;
    this.overheadCost = overheadCost;
  }

const readProductSales = () => {

    console.log("-----------------------------------");
    let sql = `
    SELECT departments.department_id, departments.department_name, departments.over_head_costs, 
    sum(products.product_sales) as sum FROM departments 
    LEFT JOIN 
    products ON departments.department_name = products.department_name 
    GROUP BY departments.department_id;`

    connection.query(sql, function(err, res) {
        if (err) throw err;

        let dbResultsObject = {}
        for (let i = 0; i < res.length; i++) {  
            totalProfitNum = res[i].sum - res[i].over_head_costs;
            dbResultsObject[i] = {department_id: res[i].department_id, department_name: res[i].department_name, overhead_cost : res[i].over_head_costs, product_sales: res[i].sum, total_profit:totalProfitNum};
        }
     
        let displayTableArray = [];
        for (key in dbResultsObject){
            if (dbResultsObject.hasOwnProperty){
                displayTableArray.push(dbResultsObject[key]);
            }
        }
        console.table(displayTableArray);
        start();
    });
} 

const createNewDepartment = () => {
    inquirer
    .prompt([
        {
            name: "name",
            type: "input",
            message: "Department name = "
        },
        {
            name: "cost",
            type: "input",
            message: "Overhead costs = ",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return 'You must enter a NUMBER';
            }
        },
    ])
    .then(function(answer) {
        let dbSql = "INSERT INTO departments (department_name, over_head_costs) VALUES ?";
        let inputArr = [
            [answer.name, answer.cost]
        ]
        connection.query(dbSql,[inputArr], function(err, res) {
            if (err) throw err;
            
        });
        start()
    });
};