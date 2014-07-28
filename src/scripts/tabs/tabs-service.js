angular
  .module('Horn')
  .factory('Tabs', function () {

    var Tabs = {};

    Tabs.tabs = [];
    Tabs.current = {};


    Tabs.add = function (tab, switchToNewTab) {
      if (typeof switchToNewTab == 'undefined')
        switchToNewTab = true;

      var l = this.tabs.push(tab);
      if (switchToNewTab)
        this.set(l - 1);
    };

    Tabs.set = function (number) {
//      if (this.selected === number)
//        return;

      this.current.id = number;
      this.current.tab = Tabs.tabs[number];
      console.log(this.selected);
    }

    window.tabs = Tabs;
    return Tabs;
  }
);
