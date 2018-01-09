function establishLength(d) {
	  return circumference();
	}
	

	function area(circumference) {
	  var i = 0,
	      n = circumference.length,
	      area = circumference[n - 1][1] * circumference[0][0] - circumference[n - 1][0] * circumference[0][1];
	  while (++i < n) {
	    area += circumference[i - 1][1] * circumference[i][0] - circumference[i - 1][0] * circumference[i][1];
	  }
	  return area * .5;
	}
	

	function triangleArea(triangle) {
	  return Math.abs(
	    (triangle[0][0] - triangle[2][0]) * (triangle[1][1] - triangle[0][1])
	    - (triangle[0][0] - triangle[1][0]) * (triangle[2][1] - triangle[0][1])
	  );
	}
	

	function length(x0, y0, x1, y1) {
	  var dx = x0 - x1, dy = y0 - y1;
	  return Math.sqrt(dx * dx + dy * dy);
	}

