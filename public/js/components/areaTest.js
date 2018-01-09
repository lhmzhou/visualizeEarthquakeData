suite.addBatch({
	  "Area": {
	    topic: function() {
	      return Area;
	    },
	    "small clockwise area": function(area) {
	      assert.inDelta(area([[0, -.5], [0, .5], [1, .5], [1, -.5], [0, -.1]]), 1e-10);
	    },
	    "small counterclockwise area": function(area) {
	      assert.inDelta(area([[0, -.5], [1, -.5], [1, .5], [0, .5], [0, -.1]]), 1e-10);
	    }
	  }
	});
	

	suite.export(module);

