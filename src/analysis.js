const { getTrips, getDriver, getVehicle } = require('api');
/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */


async function analysis() {

  const trips = await getTrips();
 
  let cashTrips = trips.filter((trip) => trip.isCash === true);
  let noOfCashTrips = cashTrips.length;

  let nonCashTrips = trips.filter((trip) => trip.isCash === false);
  let noOfNonCashTrips = nonCashTrips.length;


  //Helper function to remove comma from the amount string and convert to number
  //It returns an array of the billed amount from the trips array passed in
  function getTripsArr(trips) {
    let result = trips.map((trip) => {
      if (typeof(trip.billedAmount) === 'string') {
        let okx = (trip.billedAmount).replace(',', '');
        return Number(okx)
      } else return (trip.billedAmount)
    })
    return result
  }

      
  let cashBilledTotal = getTripsArr(cashTrips).reduce((a, b) => a + b, 0);

  let nonCashBilledTotal = Number(getTripsArr(nonCashTrips).reduce((a, b) => a + b, 0.00).toFixed(2));
  nonCashBilledTotal

  let billedTotal = cashBilledTotal + nonCashBilledTotal;
  billedTotal


  //A store containing drivers Id against the number of trips covered
  let driversStore = {};
  for (let i = 0; i < trips.length; i++) {
    if(!driversStore[trips[i].driverID]) {
      driversStore[trips[i].driverID] = 1;
    } else {
      driversStore[trips[i].driverID]++
    }
  };
  let driversIDArr = Object.keys(driversStore);
  


  //Storing the drivers details in an array
  let drivers = []
  try {
    for (const id of driversIDArr) {
      let driver = getDriver(id);
        drivers.push(driver);
    }
  } catch (error) {

  }
  drivers = await Promise.allSettled(drivers)


  //Getting the number of drivers with more than one vehicle
  let noOfVehiclesArr = [];
  let noOfVehiclesArrMap = drivers.map((driver) => {
    if (driver.status === 'fulfilled' && driver.value.vehicleID.length > 1){
      noOfVehiclesArr.push(driver)
    }
  })

  let noOfDriversWithMoreThanOneVehicle = noOfVehiclesArr.length;

  let driverEarningsArr = driversIDArr.map((driverID) => {
    let filterTripsById = trips.filter((trip) => trip.driverID === driverID);
    let driverEarnings = getTripsArr(filterTripsById).reduce((a, b) => a + b);
    return { driverID, driverEarnings }
  })

  driverEarningsArr.sort((a, b) => a.driverEarnings - b.driverEarnings);

  let mostTrips = Math.max(...Object.values(driversStore));
  let mostTripsDriverId = Object.keys(driversStore).find((key) => driversStore[key] === mostTrips);
  let mostTripsByDriverObj = await getDriver(mostTripsDriverId);
  let mostTripsDriverEarningAmount = driverEarningsArr.filter((obj) => obj.driverID === mostTripsDriverId)[0].driverEarnings;
  


  let highestEarningDriver = driverEarningsArr.at(-1);
  let highestDriver = await getDriver(highestEarningDriver.driverID);
  let highestEarningDriverNoOfTrips = driversStore[highestEarningDriver.driverID];


  let res = 
  {
    "noOfCashTrips": +noOfCashTrips,
    "noOfNonCashTrips": +noOfNonCashTrips,
    "billedTotal": +billedTotal,
    "cashBilledTotal": +cashBilledTotal,
    "nonCashBilledTotal": +nonCashBilledTotal,
    "noOfDriversWithMoreThanOneVehicle": +noOfDriversWithMoreThanOneVehicle,
    "mostTripsByDriver": {
      "name": mostTripsByDriverObj.name,
      "email": mostTripsByDriverObj.email,
      "phone": mostTripsByDriverObj.phone,
      "noOfTrips": +mostTrips,
      "totalAmountEarned": +mostTripsDriverEarningAmount
    },
    "highestEarningDriver": {
      "name": highestDriver.name,
      "email": highestDriver.email,
      "phone": highestDriver.phone,
      "noOfTrips": +highestEarningDriverNoOfTrips,
      "totalAmountEarned": +highestEarningDriver.driverEarnings
    },
  }
  return res;
   
}

analysis()

module.exports = analysis;
