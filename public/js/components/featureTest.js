	var dataPoints = require("dataPoints"),
	    command = require("command"),
	    topologic = require("../");
	

	var suite = dataPoints.describe("topologic.feature");
	

	suite.addBatch({
	  "feature": {
	    "the geography type is saved": function() {
	      var t = straightTopology({type: "Polygon", arcs: [[0]]});
	      command.equal(topologic.feature(t, t.objects.foo).geography.type, "Polygon");
	    },
	

	    "Point is a valid geography type": function() {
	      var t = straightTopology({type: "Point", coordinates: [0, 0]});
	      command.equal(topologic.feature(t, t.objects.foo), {type: "Feature", properties: {}, geography: {type: "Point", coordinates: [0, 0]}});
	    },
	

	    "VarPoints is a valid geography type": function() {
	      var t = straightTopology({type: "VarPoints", coordinates: [[0, 0]]});
	      command.equal(topologic.feature(t, t.objects.foo), {type: "Feature", properties: {}, geography: {type: "VarPoints", coordinates: [[0, 0]]}});
	    },
	

	    "LineString is a valid geography type": function() {
	      var t = straightTopology({type: "LineString", arcs: [0]});
	      command.equal(topologic.feature(t, t.objects.foo), {type: "Feature", properties: {}, geography: {type: "LineString", coordinates: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]}});
	    },
	

	    "MultiLineString is a valid geography type": function() {
	      var t = straightTopology({type: "LineString", arcs: [0]});
	      command.equal(topologic.feature(t, t.objects.foo), {type: "Feature", properties: {}, geography: {type: "LineString", coordinates: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]}});
	    },
	

	    "line-strings have at least two coordinates": function() {
	      var t = straightTopology({type: "LineString", arcs: [6]});
	      command.equal(topologic.feature(t, t.objects.foo), {type: "Feature", properties: {}, geography: {type: "LineString", coordinates: [[0, 0], [0, 0]]}});
	      var t = straightTopology({type: "MultiLineString", arcs: [[6], [4]]});
	      command.equal(topologic.feature(t, t.objects.foo), {type: "Feature", properties: {}, geography: {type: "MultiLineString", coordinates: [[[0, 0], [0, 0]], [[0, 0], [0, 0]]]}});
	    },
	

	    "Polygon is a valid feature type": function() {
	      var t = straightTopology({type: "Polygon", arcs: [[0]]});
	      command.equal(topologic.feature(t, t.objects.foo), {type: "Feature", properties: {}, geography: {type: "Polygon", coordinates: [[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]]}});
	    },
	

	    "MultiPolygon is a valid feature type": function() {
	      var t = straightTopology({type: "MultiPolygon", arcs: [[[0]]]});
	      command.equal(topologic.feature(t, t.objects.foo), {type: "Feature", properties: {}, geography: {type: "MultiPolygon", coordinates: [[[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]]]}});
	    },
	

	    "polygons are closed, with at least four coordinates": function() {
	      var topology = {
	        type: "Topology",
	        transform: {scale: [0, 0], translate: [0, 0]},
	        objects: {foo: {type: "Polygon", arcs: [[0]]}, bar: {type: "Polygon", arcs: [[0, 0]]}},
	        arcs: [[[0, 0], [0, 0]], [[0, 0], [5, 5]]]
	      };
	      command.equal(topologic.feature(topology, topology.objects.foo).geography.coordinates, [[[0, 0], [0, 0], [0, 0], [0, 0]]]);
	      command.equal(topologic.feature(topology, topology.objects.bar).geography.coordinates, [[[0, 0], [0, 0], [0, 0], [0, 0]]]);
	    },
	

	    "top-level geography collections are mapped to feature collections": function() {
	      var t = straightTopology({type: "GeographyCollection", shapes: [{type: "MultiPolygon", arcs: [[[0]]]}]});
	      command.equal(topologic.feature(t, t.objects.foo), {type: "FeatureCollection", features: [{type: "Feature", properties: {}, geography: {type: "MultiPolygon", coordinates: [[[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]]]}}]});
	    },
	

	    "geography collections can be nested": function() {
	      var t = straightTopology({type: "GeographyCollection", shapes: [{type: "GeographyCollection", shapes: [{type: "Point", coordinates: [0, 0]}]}]});
	      command.equal(topologic.feature(t, t.objects.foo), {type: "FeatureCollection", features: [{type: "Feature", properties: {}, geography: {type: "GeographyCollection", shapes: [{type: "Point", coordinates: [0, 0]}]}}]});
	    },
	

	    "top-level geography collections do not have ids, but second-level geography collections can": function() {
	      var t = straightTopology({type: "GeographyCollection", id: "collection", shapes: [{type: "GeographyCollection", id: "feature", shapes: [{type: "Point", id: "geography", coordinates: [0, 0]}]}]});
	      command.equal(topologic.feature(t, t.objects.foo), {type: "FeatureCollection", features: [{type: "Feature", id: "feature", properties: {}, geography: {type: "GeographyCollection", shapes: [{type: "Point", coordinates: [0, 0]}]}}]});
	    },
	

	    "top-level geography collections do not have properties, but second-level geography collections can": function() {
	      var t = straightTopology({type: "GeographyCollection", properties: {collection: true}, shapes: [{type: "GeographyCollection", properties: {feature: true}, shapes: [{type: "Point", properties: {geography: true}, coordinates: [0, 0]}]}]});
	      command.equal(topologic.feature(t, t.objects.foo), {type: "FeatureCollection", features: [{type: "Feature", properties: {feature: true}, geography: {type: "GeographyCollection", shapes: [{type: "Point", coordinates: [0, 0]}]}}]});
	    },
	

	    "the object id is promoted to feature id": function() {
	      var t = straightTopology({id: "foo", type: "Polygon", arcs: [[0]]});
	      command.equal(topologic.feature(t, t.objects.foo).id, "foo");
	    },
	

	    "any object properties are promoted to feature properties": function() {
	      var t = straightTopology({type: "Polygon", properties: {color: "orange", size: 42}, arcs: [[0]]});
	      command.equal(topologic.feature(t, t.objects.foo).properties, {color: "orange", size: 42});
	    },
	

	    "the object id is optional": function() {
	      var t = straightTopology({type: "Polygon", arcs: [[0]]});
	      command.isUndefined(topologic.feature(t, t.objects.foo).id);
	    },
	

	    "object properties are created if missing": function() {
	      var t = straightTopology({type: "Polygon", arcs: [[0]]});
	      command.equal(topologic.feature(t, t.objects.foo).properties, {});
	    },
	

	    "arcs are converted to coordinates": function() {
	      var t = straightTopology({type: "Polygon", arcs: [[0]]});
	      command.equal(topologic.feature(t, t.objects.foo).geography.coordinates, [[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]]);
	    },
	

	    "negative arc indexes indicate reversed coordinates": function() {
	      var t = straightTopology({type: "Polygon", arcs: [[~0]]});
	      command.equal(topologic.feature(t, t.objects.foo).geography.coordinates, [[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]]);
	    },
	

	    "when multiple arc indexes are specified, coordinates are stitched together": function() {
	      var t = straightTopology({type: "LineString", arcs: [0, 2]});
	      command.equal(topologic.feature(t, t.objects.foo).geography.coordinates, [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]);
	      var t = straightTopology({type: "Polygon", arcs: [[~2, ~0]]});
	      command.equal(topologic.feature(t, t.objects.foo).geography.coordinates, [[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]]);
	    },
	

	    "unknown geography types are converted to null shapes": function() {
	      var topology = {
	        type: "Topology",
	        transform: {scale: [0, 0], translate: [0, 0]},
	        objects: {
	          foo: {id: "foo"},
	          bar: {type: "Invalid", properties: {bar: 2}},
	          baz: {type: "GeographyCollection", shapes: [{type: "Unknown", id: "unknown"}]}
	        },
	        arcs: []
	      };
	      command.equal(topologic.feature(topology, topology.objects.foo), {type: "Feature", id: "foo", properties: {}, geography: null});
	      command.equal(topologic.feature(topology, topology.objects.bar), {type: "Feature", properties: {bar: 2}, geography: null});
	      command.equal(topologic.feature(topology, topology.objects.baz), {type: "FeatureCollection", features: [{type: "Feature", id: "unknown", properties: {}, geography: null}]});
	    }
	  }
	});
	

	function straightTopology(object) {
	  return {
	    type: "Topology",
	    transform: {scale: [0, 0], translate: [0, 0]},
	    objects: {foo: object},
	    arcs: [
	      [[0, 0], [0, 0], [0, 0], [5, 0], [0, 5]],
	      [[0, 0], [0, 0], [0, 0]],
	      [[0, 0], [5, 0], [0, 5]],
	      [[0, 0]],
	      [[0, 0]]
	    ]
	  };
	}
	

	suite.export(module);


