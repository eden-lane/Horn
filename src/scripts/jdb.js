var jdb = (function (undefined) {
  var self = this,
      data = [];

  console.log(this);
  console.log(data);

  var db = {
    get: function (obj) {
      if (!obj)
        return;
      var item,
          isIt = true,
          properties = [];

      for (var p in obj) {
        if (obj.hasOwnProperty(p))
          properties.push(p);
      };

      for (var i = 0, max = data.length; i < max; i++) {
        item = data[i];
        isIt = true;
        for (var x = 0, max2 = properties.length; x < max2; x++) {
          var prop = properties[x];
          if (item[prop] !== obj[prop])
            isIt = false;
        };
        if (isIt)
          return item;
      };
    },

    /**
     * Inserts a new object in array
     */
    insert: function (obj) {
      data.push(obj);
    },

    all: function () {
      return data;
    },

    toJSON: function () {
      return JSON.stringify(data);
    }
  }

  return function (data) {
    data = data;

    return db;
  };
})();
