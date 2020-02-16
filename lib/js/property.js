//Property Panel
define( ["qlik"], (qlik) => {
    'use strict';
	
	return {
		component: 'items',
      label: 'About',
      items: {
        header: {
          label: 'Master Library Viewer',
          style: 'header',
          component: 'text'
        },
        paragraph1: {
          label: `This extension displays all the master measures and dimensions of the app and their definitions. Please update the master library to see the changes here.`,
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
});