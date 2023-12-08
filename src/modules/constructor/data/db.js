const descriptors1 = [
  {"id": "qwerty-1", "component": {"name": "group"}, "binding": "$.productInfo", "parentId": null},
  {
    "id": "qwerty-1.1",
    "component": {"name": "header", "parameters": {"level": 1}},
    "binding": "title",
    "parentId": "qwerty-1"
  },

  {"id": "qwerty-1.2", "component": {"name": "group"}, "binding": "videos", "parentId": "qwerty-1"},
  {
    "id": "qwerty-1.2.1",
    "component": {"name": "header", "parameters": {"level": 2}},
    "binding": "title",
    "parentId": "qwerty-1.2"
  },

  {
    "id": "qwerty-1.2.2",
    "component": {"name": "carousel", "parameters": {"contentType": "video"}},
    "binding": "files",
    "parentId": "qwerty-1.2"
  },
  {
    "id": "qwerty-1.2.2.1",
    "component": {"name": "video", "parameters": {"type": "embedded"}},
    "binding": "[0]",
    "parentId": "qwerty-1.2.2"
  },
  {
    "id": "qwerty-1.2.2.2",
    "component": {"name": "video", "parameters": {"type": "html"}},
    "binding": "[1]",
    "parentId": "qwerty-1.2.2"
  },

  {"id": "qwerty-1.3", "component": {"name": "group"}, "binding": "$.productInfo.featuresList", "parentId": "qwerty-1"},
  {
    "id": "qwerty-1.3.1",
    "component": {"name": "header", "parameters": {"level": 2}},
    "binding": "title",
    "parentId": "qwerty-1.3"
  },
  {
    "id": "qwerty-1.3.2",
    "component": {"name": "keyvalue_list", "parameters": {"icon": true}},
    "binding": "features",
    "parentId": "qwerty-1.3"
  },

  {
    "id": "qwerty-1.3.2.1",
    "component": {"namespace": "_pseudo", "name": "item"},
    "binding": "[0]",
    "parentId": "qwerty-1.3.2"
  },
  {"id": "qwerty-1.3.2.1.1", "component": {"name": "icon"}, "binding": "icon", "parentId": "qwerty-1.3.2.1"},
  {"id": "qwerty-1.3.2.1.2", "component": {"name": "text"}, "binding": "key", "parentId": "qwerty-1.3.2.1"},
  {"id": "qwerty-1.3.2.1.3", "component": {"name": "text"}, "binding": "value", "parentId": "qwerty-1.3.2.1"}
];

const data1 = {
  "productInfo": {
    "title": "Product info",
    "videos": {
      "title": "Videos",
      "files": ["https://url1.menchul.com", "https://url2.menchul.com"]
    },
    "featuresList": {
      "title": "Features list",
      "features": [
        {"key": "Platform switching", "value": "\"Switching\" of the platform", "icon": "https://icons.com/icon1.svg"},
        /* ... */
      ]
    }
  }
};


const descriptors2 = [
  {
    "id": "qwerty-1",
    "component": {"name": "group"},
    "binding": null,
    "parentId": null
  },
  {
    "id": "id_0",
    "component": {"name": "monoComponent"},
    "binding": "$.list",
    "parentId": 'qwerty-1'
  },
  {
    "id": "id_1",
    "component": {"name": "list"},
    "binding": "$.list",
    "parentId": null
  },
  {
    "id": "id_1.1",
    "component": {"name": "listItem", "parameters": {}},
    "binding": "[0]",
    "parentId": "id_1"
  },
  {
    "id": "id_1.2",
    "component": {"name": "listItem", "parameters": {}},
    "binding": "[1]",
    "parentId": "id_1"
  },


  // {
  //   "id": "id_2",
  //   "component": {"name": "header", "parameters": {
  //     "level": 2
  //   }},
  //   "binding": "$.title",
  //   "parentId": null
  // },
  // {
  //   "id": "id_2.1",
  //   "component": {"name": "header", "parameters": {
  //       "level": 3
  //     }},
  //   "binding": "$.title2",
  //   "parentId": "id_2"
  // }
];

const data2 = {
  "title": "title 1",
  "title2": "title 2",
  "list": [
    1, 2, 3, 4, 5
  ]
};


const descriptors3 = [
  {
    "id": "id_root",
    "component": {"name": "group"},
    "binding": null,
    "parentId": null
  }, {
    "id": "child1",
    "component": {"name": "group"},
    "binding": null,
    "parentId": 'id_root'
  },
];

const data3 = {};


const descriptors4 = [
  {
    "id": "id_root",
    "component": {"name": "group"},
    "binding": "$.idRootObj",
    "parentId": null
  },
  {
    "id": "a",
    "component": {"name": "header", "parameters": {"level": 1}},
    "binding": "title1",
    "parentId": "id_root",
  }, {
    "id": "b",
    "component": {"name": "header", "parameters": {"level": 1}},
    "binding": "title2",
    "parentId": "id_root",
    "prevId": "g"
  }, {
    "id": "c",
    "component": {"name": "header", "parameters": {"level": 1}},
    "binding": "title3",
    "parentId": "id_root",
  }, {
    "id": "d",
    "component": {"name": "header", "parameters": {"level": 1}},
    "binding": "title3",
    "parentId": "id_root",
    "prevId": "f"
  }, {
    "id": "e",
    "component": {"name": "header", "parameters": {"level": 1}},
    "binding": "title3",
    "parentId": "id_root",
  }, {
    "id": "f",
    "component": {"name": "header", "parameters": {"level": 1}},
    "binding": "title3",
    "parentId": "id_root",
  }, {
    "id": "g",
    "component": {"name": "header", "parameters": {"level": 1}},
    "binding": "title3",
    "parentId": "id_root",
    "prevId": "c"
  }, {
    "id": "h",
    "component": {"name": "header", "parameters": {"level": 1}},
    "binding": "title3",
    "parentId": "id_root"
  }
];

const descriptors5 = [
  {
    "id": "id_root",
    "component": {"name": "group"},
    "binding": null,
    "parentId": null
  },
  {
    "id": "a",
    "component": {"name": "header", "parameters": {"level": 1}},
    "binding": "title1",
    "parentId": "id_root",
  }, {
    "id": "b",
    "component": {"name": "header", "parameters": {"level": 1}},
    "binding": "title2",
    "parentId": "id_root",
    "prevId": "a"
  },
  {
    "id": "c",
    "component": {"name": "header", "parameters": {"level": 1}},
    "binding": "title3",
    "parentId": "id_root",
    "prevId": "b"
  }, {
    "id": "d",
    "component": {"name": "header", "parameters": {"level": 1}},
    "binding": "title3",
    "parentId": "id_root",
    "prevId": "c"
  }, {
    "id": "e",
    "component": {"name": "header", "parameters": {"level": 1}},
    "binding": "title3",
    "parentId": "id_root",
    "prevId": "d"
  }, {
    "id": "f",
    "component": {"name": "header", "parameters": {"level": 1}},
    "binding": "title3",
    "parentId": "id_root",
    "prevId": "e"
  }, {
    "id": "g",
    "component": {"name": "header", "parameters": {"level": 1}},
    "binding": "title3",
    "parentId": "id_root",
    "prevId": "f"
  }, {
    "id": "h",
    "component": {"name": "header", "parameters": {"level": 1}},
    "binding": "title3",
    "parentId": "id_root",
    "prevId": "g"
  }
];


const db = {
  '1': {descriptors: descriptors1, data: data1},
  '2': {descriptors: descriptors2, data: data2},
  '3': {descriptors: descriptors3, data: data3},
  '4': {descriptors: descriptors4, data: data3},
  '5': {descriptors: descriptors5, data: data3},
};

export default db;
