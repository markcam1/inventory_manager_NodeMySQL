# Inventory Management Application NodeMySQL
This is a command line application that emulates an electronic inventory management system. 

The application functionality includes:
1. Displaying inventory from database to customer,
2. Allowing customer to buy inventory and deplete inventory stock,
3. Allowing user/manager to view and add to inventory,
4. Displays sales data to the user/manager. 

[Video Demonstration](https://youtu.be/5oP7jD8HZ6k) - this a demo of the full application


![node](https://github.com/markcam1/liri-node-app/blob/master/media/liri_node.png)

---

## Setup
### Prerequisites
```
*  Proficient JavaScript experience,
*  Basic knowledge of Node.js and the Command-line,
*  Basic knowledge of MySQL. 
```
### Installing

**Clone this repository to your local system**

 Use Git or checkout with SVN using the web URL. 
 [https://github.com/markcam1/inventory_manager_NodeMySQL.git]

_The relevant JavaScript files_:
1. __bamazonCustomer.js__: creates and manages the customer view (view inventory & purchase items/deplete inventory)
2. __bamazonManager.js__: creates and manages the manager view (View Products for Sale, View Low Inventory, Add to Inventory, Add New Product)
3. __bamazonSupervisor.js__: creates and manages the supervisor view (View Product Sales by Department, Create New Department)

**Install MySQL**
- If you do not have this installed, see the link to MySQL Tools [below](#tools) and install on your local system.
- Change your connection.js file to use the appropriate configurations. 

![mysql-connection](https://github.com/markcam1/inventory_manager_NodeMySQL/blob/beta_im/media/mysql_connect.png)

- Use your MySQL GUI or command-line application and run the SQL statement from the [DB file](#) or from the SQL statement below. 
- Insert data into the tables. Please create your own data or use my [csv file](#).


```
DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price decimal default 0,
  stock_quantity INT default 0,
  product_sales decimal default 0,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(45) NOT NULL,
  over_head_costs decimal default 0,
  PRIMARY KEY (department_id)
);
```
The statement above was used for my database but if you are  with the functionality feel free to adjust it as you'd like.
For instance, the column product_name might not need to be 100 characters long as defined in [VARCHAR](http://sqlines.com/mysql/datatypes/varchar). 


**Install Node & Node Packages**

_node.js NOT installed_
Make sure node.js is installed on your machine by going to a terminal and typing:

```
node -v
```

1. If it is not installed, please visit the [node.js](#tools) link and install it.
2. Then go to the root of this project and type:

```
npm init
```

or additionally if you want to skip the questions, you can create a [default](https://docs.npmjs.com/getting-started/using-a-package.json) file, using: 

```
npm init --yes
```


_node.js IS installed_
If you've cloned my repository to your local system then you notice:

1. package-lock.json
2. package.json

This means you can run the command:

```
npm install
```

and install the packages I used to verify my code.

If you interested in learning about the difference between package-lock.json & package.json, 
you can read the [technical-specs](https://docs.npmjs.com/files/package-locks)] 
or a more [casual-description](https://medium.com/@Quigley_Ja/everything-you-wanted-to-know-about-package-lock-json-b81911aa8ab8). 

_node.js packages_
If you are creating a repository from scratch, please see the packages I used for this project [below](#tools).


### Usage
1. **Customer View**
- open a terminal in the root of your project (I use git bash as my terminal of choice)
- run the command below to start the customer app

```
node bamazonCustomer.js
```

- a list of products is displayed
- choose and item and the number of units
- the app should display the total cost of the purchase

2.  **Manager View**
- In the root of your project, run the command below to start the Manager app

```
node bamazonManager.js
```

- Menu options are displayed
- *View Products for Sale:* the app shows every available item: the item IDs, names, prices, and quantities
- *View Low Inventory:* list all items with an inventory count lower than five
- *Add to Inventory:* allows user to "add more" inventory to current products
- *Add New Product:* allows the user to add a new product

3.  **Supervisor View**
- In the root of your project, run the command below to start the supervisor app

```
node bamazonSupervisor.js
```

- Menu options are displayed
- *View Product Sales by Department*: displays a summarized table in their terminal/bash window.

![supervisor-table](#)

- *Create New Department:* allows the user to add a new department


## Built With <a name="tools"></a>
* [MySQL Tools](https://dev.mysql.com/downloads/installer/) - MySQL is an open-source relational database management system.
* [mysql node](https://www.npmjs.com/package/mysql) - This is a node.js driver for mysql. 
* [inquirer](https://www.npmjs.com/package/inquirer) - A collection of common interactive command line user interfaces.
* [Node.js](https://nodejs.org/en/) - a JavaScript runtime built on Chrome's V8 JavaScript engine.
* [console.table](https://www.npmjs.com/package/console.table) - Adds console.table method to Node for convenience.


## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to me.

## Versioning
Use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/markcam1/node_word_guess/tags). 

## Authors
* **Mark Cameron** - *Initial work* - [Mark Cameron](https://markcam1.github.io/)

See also the list of [contributors](https://github.com/calendarapp1bootcamp/node_word_guess/graphs/contributors) who participated in this project.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
* UC Berkeley Extension
* Teachers [David Blanchard](https://www.linkedin.com/in/dblanchard13/), [Rai Lee](https://www.linkedin.com/in/rai-lee-38061696/), [Emma Brown](https://github.com/EmmaEm),