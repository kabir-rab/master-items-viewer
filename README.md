### _This is for Qlik Sense November 2019 or later versions. For earlier Qlik Sense versions - Please use the lite version [master-items-viewer-lite](https://github.com/kabir-rab/master-items-viewer-lite)._
# master-items-viewer
Displays master dimensions and master measures with expressions and descriptions. This allows users to search the master items by description, expression, name or tags.

## Features
1. Ability to display - 
* All Master Measures.
* All Master Dimensions.
* Their IDs.
* Their Descriptions.
* Their Expressions.
* Stats count - No of times they have been used (unique number of times if it’s been used in master items).
* On mouse hover, display the sheet where the chart is located (if not master Items)
* Option to customise (header colours)
* Option to show/hide any columns.
* Option to search the master measures and dimensions by tag or any of their attributes (including ids).

## Demo
<p align="center">
  <img width="70%" alt="Master Items Viewer - version 1.0.0.2" src="https://github.com/kabir-rab/master-items-viewer/blob/master/lib/img/preview-release-1.0.0.2.png">
</p>
<p align="center">
  <img width="70%" alt="Master Items Viewer" src="https://github.com/kabir-rab/master-items-viewer/blob/master/lib/img/master-items-viewer-new.gif">
</p>

# How to Install
## Desktop
Download [release v-1.0.0.3](https://github.com/kabir-rab/master-items-viewer/releases/download/1.0.0.3/master-items-viewer-v-1.0.0.3.zip). Once downloaded unzip all its content to the following folder 
> Documents\Qlik\Sense\Extensions\

## Enterprise Server
Download [release v-1.0.0.3](https://github.com/kabir-rab/master-items-viewer/releases/download/1.0.0.3/master-items-viewer-v-1.0.0.3.zip). Once downloaded, use the QMC to upload the zip file just like any other extensions.

# How to use
Go to "edit" mode of a Qlik sense app. Then Custom objects > "Kab-s Game Example Bundle" > Master Items Viewer. Drag this to the workspace and resize to your requirement. You can use the property panel to show/hide columns, filters and change the table header appearance.
