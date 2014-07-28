angular
.module('Horn')
.factory('Tabs', function () {
  return {
    tabs: [],

    current: null,

    add: function (tab, switchToNewTab) {
      if (typeof switchToNewTab == 'undefined')
        switchToNewTab = true;

      var l = this.tabs.push(tab);
      if (switchToNewTab)
        this.set(l - 1);
    },

    set: function (number) {
      console.log('Tabs:current', this.current);
      this.current = this.tabs[number];
    }
  }
});
