.factory('drive', function () {
  return {
    /**
     * Getting all files from app's drive folder
     * @param {Function(entries)} callback
     */
    getAll: function (callback) {
      if (typeof callback != 'function')
            return;
      chrome.syncFileSystem.requestFileSystem(function (fs) {
        var directoryReader = fs.root.createReader();
        directoryReader.readEntries(function (entries) {
          callback(entries);
        });
      });
    },

    /**
     * Generates new non-existing name for file
     * @param {Function(newFileName)} callback
     */
    getNewFileName: function (callback) {
      this.getDriveFiles(function (entries) {
        var regExp = /untitled (\d*)(\.v\d*)?\.md/,
            lastIndex = 0,
            newFileName;

        for (var i = 0, max = entries.length; i < max; i++) {
          var entry = entries[i],
              result = regExp.exec(entry.name);
          if (result && +result[1] > lastIndex)
            lastIndex = result[1];
        };

        lastIndex++;
        newFileName = "untitled " + lastIndex;

        callback(newFileName);
      });
    },

    save: function (name, body) {
      var self = this;
      chrome.syncFileSystem.requestFileSystem(function (fs) {
        fs.root.getFile(name + '.md', {create: true}, function (fileEntry) {
          fileEntry.createWriter(function (writer) {
            writer.write(new Blob([body]));
            current.isSaved = true;
            $rootScope.$apply();
          });
        });
      });
    }
  }
});
