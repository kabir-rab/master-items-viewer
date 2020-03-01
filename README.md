# master-items-viewer
Displays master dimensions and master measures with expressions and descriptions. This allows users to search the master items by description, expression, name or tags.

## Features
1. Ability to display - 
* All Master Measures.
* All Master Dimensions.
* Their IDs.
* Their Descriptions.
* Their Expressions.
* Stats count - No of times they have been used (unique number of times if its been used in master items).
* On mouse hove, display the sheet where the chart is located (if not master Items)
* Option to customise (header colours)
* Option to show/hide any columns.
* Option to seach the master measures and dimensions by tag or any of their attributes (including ids).

## Demo
<p align="center">
  <img width="70%" alt="Master Items Viewer" src="https://github.com/kabir-rab/master-items-viewer/blob/master/lib/img/master-items-viewer-new.gif">
</p>

# How to Install
## Desktop
Download [release v-1.0.0.2](https://github.com/kabir-rab/master-items-viewer/releases/download/v.1.0.0.2/master-items-viewer-v-1.0.0.2.zip). Once downloaded unzip all its content to the following folder 
> Documents\Qlik\Sense\Extensions\

## Enterprise Server
Download [release v-1.0.0.2](https://github.com/kabir-rab/master-items-viewer/releases/download/v.1.0.0.2/master-items-viewer-v-1.0.0.2.zip). Once downloaded, use the QMC to upload the zip file just like any other extensions.

# How to use
Go to "edit" mode of a Qlik sense app. Then Custom objects > "Kab-s Game Example Bundle" > Master Items Viewer. Drag this to the work space and resize to your requirement. You can use the property panel to show/hide columns, filters and change the table header appearance.

### _Note for developers - attached an angular service to Qlik's "qvangular". it contains a class which requires converting using babel to work in IE as IE does not recognise javascript classes. This is only if you are downloading the repo to build on top. I have already recomplied it for the release._
