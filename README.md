# Table Editor

Table Editor to make main operation with file of table, that has delimiter - tab. Possible operation:
 - upload selected file to editor
 - download changed file
 - browse content of table
 - change content of rows in table
 - change name of file with table
 - sort columns of table

# Index file

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [readFile](#readfile)
    -   [Parameters](#parameters)
-   [Editor](#editor)
    -   [parseFile](#parsefile)
        -   [Parameters](#parameters-1)
    -   [tableToText](#tabletotext)
        -   [Parameters](#parameters-2)
    -   [download](#download)
        -   [Parameters](#parameters-3)
-   [Table](#table)
    -   [Parameters](#parameters-4)
    -   [createHeader](#createheader)
        -   [Parameters](#parameters-5)
    -   [createRow](#createrow)
        -   [Parameters](#parameters-6)
    -   [sortTableByColumn](#sorttablebycolumn)
        -   [Parameters](#parameters-7)
    -   [openModal](#openmodal)
        -   [Parameters](#parameters-8)

## readFile

Start function of app, execute all main operation with file

### Parameters

-   `input` **pbject** html object - selected file to work with

## Editor

Class representing a tool Editor

### parseFile

Convert a file into two arrays: array of rows of the table
and array of the headers of the table

#### Parameters

-   `file` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** file of data

Returns **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Object with fields: data(rows) and headers

### tableToText

Convert a table from html to string with tabs for saving in the file

#### Parameters

-   `headers` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** array of headers of the table
-   `rows` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** array of rows of the table

Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** String containing table with tabs, ready to download

### download

Method for downloading the table

#### Parameters

-   `filename` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** name of file to save
-   `text` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** file to save

## Table

Class representing a Table

### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Name of file
-   `data` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Data of file

### createHeader

Create a header of table

#### Parameters

-   `array` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Array of headers of the table

### createRow

Create rows of table

#### Parameters

-   `array` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Array of rows

### sortTableByColumn

Sort the table

#### Parameters

-   `column` **int** Number of column, that is sorted
-   `asc` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Identifier for sorting in direct or reverse order (optional, default `true`)

### openModal

Create a modal window

#### Parameters

-   `options` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Object with fields: {argForFn, defaultValue, fnForBtn, headerText, btnText}

