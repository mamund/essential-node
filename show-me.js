/* show me node */

computeAndLog(5, 7);
console.log('computeAndReturn: ' + computeAndReturn(5, 7));
computeAndCallback(5, 7, showMe);
computeAndCallback(5, 7, doubleMe);

// call a function and print the result
function computeAndLog(x, y) {
  var r;
  r = x * y;
  console.log('computeAndLog: ' + r);
}

// defer the printing to the caller
function computeAndReturn(x, y) {
  var r;
  r = x * y;
  return r;
}

// defer the printing to a function to be named later
function computeAndCallback(x, y, fn) {
  var r;
  r = x * y;
  fn(r);
}

// does the printing
function showMe(r) {
  console.log('showMe: ' + r);
}

// does some computing and printing
function doubleMe(r) {
  console.log('DoubleMe: ' + r * 2);
}


/* all done */

/*
computeAndLog(5, 7);
console.log('computeAndReturn: ' + computeAndReturn(5, 7));
computeAndCallback(5, 7, showMe);
computeAndCallback(5, 7, doubleMe);

// the hard way
computeAndCallback(5, 7, function(r) {
  console.log('inline: ' + r);
});

*/
