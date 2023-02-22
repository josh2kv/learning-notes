const TheatreSeats = (function () {
  let seats = [];

  function TheatreSeatsConstructor(numSeats) {
    this.maxSize = numSeats;
  }

  TheatreSeatsConstructor.prototype.placePerson = function (person) {
    seats.push(person);
  };

  TheatreSeatsConstructor.prototype.countOccupiedSeats = function () {
    return seats.length;
  };

  TheatreSeatsConstructor.prototype.isSoldOut = function () {
    return seats.length >= this.maxSize;
  };

  TheatreSeatsConstructor.prototype.countFreeSeats = function () {
    if (this.isSoldOut()) return 0;

    return this.maxSize - seats.length;
  };

  return TheatreSeatsConstructor;
})();

const cgv = new TheatreSeats(10);
const megaBox = new TheatreSeats(20);
cgv.placePerson('me');
console.log('🚀 > cgvSeats.countFreeSeats()', cgv.countFreeSeats());
console.log('🚀 > megaBoxSeats.countFreeSeats()', megaBox.countFreeSeats());
