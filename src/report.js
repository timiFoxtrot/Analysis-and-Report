const { getTrips, getDriver, getVehicle } = require('api');
// const analysis = require('./analysis');


/**
 * This function should return the data for drivers in the specified format
 *
 * Question 4
 *
 * @returns {any} Driver report data
 */
async function driverReport() {

  let result = [];
  
  const allTrips = await getTrips();
  
  function getTripsArr(allTrips) {
    let result = allTrips.map((trip) => {
      if (typeof(trip.billedAmount) === 'string') {
        let okx = (trip.billedAmount).replace(',', '');
        return Number(okx)
      } else return (trip.billedAmount)
    })
    return result
  }
  
  
  let driversStore = {};
  for (let i = 0; i < allTrips.length; i++) {
    if(!driversStore[allTrips[i].driverID]) {
      driversStore[allTrips[i].driverID] = 1;
    } else {
      driversStore[allTrips[i].driverID]++
    }
  }
  
  
  let driversIDArr = Object.keys(driversStore);
  driversIDArr
  
  for (let i = 0; i < driversIDArr.length; i++) {
    const driverObj = {};
    let driverID = driversIDArr[i];

    try {
      let driver = await getDriver(driverID);
      driver
      let fullName = driver.name;
      fullName
      let id = driverID;
      // id

      let phone = driver.phone;
      // phone

      let noOfTrips = allTrips.filter((trip) => trip.driverID === driverID).length;
      // noOfTrips
      let noOfVehicles = driver.vehicleID.length;
      noOfVehicles
      let vehicles = await Promise.all (driver.vehicleID.map(async (id) => {
        let vehicle = await getVehicle(id);
        vehicle;
        return await{ 
          plate: vehicle.plate,
          manufacturer: vehicle.manufacturer
          }
      }));
      // vehicles

      let cashTrips = allTrips.filter((trip) => trip.driverID === driverID && trip.isCash === true);
      // cashTrips
      let noOfCashTrips = cashTrips.length;
      // noOfCashTrips
      let nonCashTrips = allTrips.filter((trip) => trip.driverID === driverID && trip.isCash === false);
      // nonCashTrips
      let noOfNonCashTrips = nonCashTrips.length;
      // noOfNonCashTrips
      let driverFilter = allTrips.filter((trip) => trip.driverID === driverID);
      // driverFilter
      let totalAmountEarned = getTripsArr(driverFilter).reduce((a, b) => a + b);
      // totalAmountEarned
      
      let totalCashAmount = getTripsArr(cashTrips).reduce((a, b) => a + b, 0);
      // totalCashAmount
      
      let totalNonCashAmount = getTripsArr(nonCashTrips).reduce((a, b) => a + b, 0);
      // totalNonCashAmount
      
      let trips = driverFilter.map((trip) => {
        return trip.user
      })
      // trips

      driverObj["fullname"] = fullName;
      driverObj["id"] = id;
      driverObj["phone"] = phone;
      driverObj["noOfTrips"] = noOfTrips;
      driverObj["noOfVehicles"] = noOfVehicles;
      driverObj["vehicles"] = vehicles;
      driverObj["noOfCashTrips"] = noOfCashTrips;
      driverObj["noOfNonCashTrips"] = noOfNonCashTrips;
      driverObj["totalAmountEarned"] = totalAmountEarned;
      driverObj["totalCashAmount"] = totalCashAmount;
      driverObj["totalNonCashAmount"] = totalNonCashAmount;
      driverObj["trips"] = trips;

    

      result.push(driverObj);

    } catch (error) {
      
    }
  }
  result
  return result


}

driverReport();

module.exports = driverReport;
