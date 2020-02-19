//Property Panel
define( ["qlik"],
function (qlik) {
    'use strict';
  var tagsFilter = {
    ref: "props.tagsFilter",
    label: "Show Tag Filters",
    type: "boolean",
    defaultValue: true
  }, 
  columnId = {
    ref: "props.showId",
    label: "Show Id",
    type: "boolean",
    defaultValue: true
  },
  columnName = {
    ref: "props.showName",
    label: "Show Name",
    type: "boolean",
    defaultValue: true
  },
  columnDescription = {
    ref: "props.showDesc",
    label: "Show Description",
    type: "boolean",
    defaultValue: true
  },
  columnExpression = {
    ref: "props.showExp",
    label: "Show Expression",
    type: "boolean",
    defaultValue: true
  },
  columnTag = {
    ref: "props.showTag",
    label: "Show Tags",
    type: "boolean",
    defaultValue: true
  },
  tableHeaderBackground = {
		label:"Header Background",
		component: "color-picker",
		ref: "headerColor",
		type: "object",
		defaultValue: {
			index: 1,
			color: "#fff"
    }
  },
  tableHeaderText = {
		label:"Header Text",
		component: "color-picker",
		ref: "headerTextColor",
		type: "object",
		defaultValue: {
			index: 15,
			color: "#000"
    }
  },
  settings = { 
    uses : "settings",
    items : {
        filtersShowHide: {
          type: "items",
          label: "Show/Hide Filters",
          items: {
              tagsFilter: tagsFilter
          }
        },                
        columnsShowHide: {
            type: "items",
            label: "Show/Hide Columns",
            items: {
                columnId: columnId,
                columnName: columnName,
                columnDescription: columnDescription,
                columnExpression: columnExpression,
                columnTag: columnTag
            }
        },
        colours: {
          type: "items",
          label: "Colour",
          items: {
            headerBackgroundColour: tableHeaderBackground,
            headerTextColour: tableHeaderText				
          }
        }
    }
  },
  about = {
    component: 'items',
    label: 'About',
    items: {
      header: {
        label: 'Master Library Viewer',
        style: 'header',
        component: 'text'
      },
      paragraph1: {
        label: 'This extension displays all the master measures and dimensions of the app and their definitions. Please update the master library to see the changes here.',
        component: 'text'
      },
      paragraph2: {
        label: 'This extension was developed by - Kabir Rab and its distributed under MIT license',
        component: 'text'
      },
      MyLink: {
        label:"https://www.kabonline.net",
        component: "link",
        url:"https://www.kabonline.net"
      }
    }
  }  
	
	return {
    type: "items",
        component: "accordion",
        items: {            
            settings: settings,            
			      addons: about
        }      
    }
});