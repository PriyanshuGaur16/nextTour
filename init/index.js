const mongoose = require('mongoose');
const Listing = require("../models/listing");
const initData = require("./data");



main()
    .then((res) => {console.log("connected to dB")})
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/nextTour');
}

const initdb = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => {
      return {...obj,owner : '6818580fa97963111845d924'}
    })
    await Listing.insertMany(initData.data);
};
initdb();