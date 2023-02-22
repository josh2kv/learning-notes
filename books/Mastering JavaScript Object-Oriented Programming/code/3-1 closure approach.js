function TheatreSeats() {
  // PRIVATE
  var seats = [];

  // PRIVILEGED
  this.placePerson = function (person) {
    seats.push(person);
  };

  // PRIVILEGED
  this.countOccupiedSeats = function () {
    return seats.length;
  };

  // PUBLIC
  this.maxSize = 10;
}

// PUBLIC
TheatreSeats.prototype.isSoldOut = function () {
  return this.countOccupiedSeats() >= this.maxSize;
};

// PUBLIC
TheatreSeats.prototype.countFreeSeats = function () {
  return this.maxSize - this.countOccupiedSeats();
};

const cgv = new TheatreSeats();
const megaBox = new TheatreSeats();

cgv.placePerson('Kim');
megaBox.maxSize = 20;
console.log(
  'CGV:',
  cgv.countFreeSeats(),
  ',',
  'MegaBox:',
  megaBox.countFreeSeats(),
); // CGV: 9 , MegaBox: 20
console.log(cgv); // TheatreSeats {placePerson: ƒ(), countOccupiedSeats: ƒ(), maxSize: 10}
