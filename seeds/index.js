const express=require('express');
const mongoose=require('mongoose');
const cities=require('./cities')
const path=require('path');
const ground=require('../model/grounds')
const puppeteer=require('puppeteer');
const { array } = require('joi');
const { disconnect } = require('process');
const { deleteMany } = require('../model/review');

const app=express();

mongoose.connect('mongodb://127.0.0.1:27017/ground')


const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("dtabase connected");
});


const seedDB=async()=>{
            await ground.deleteMany({});

            const browser = await puppeteer.launch();
            const page = await browser.newPage();
        
            // Go to the page and wait for the elements to load
            await page.goto('https://www.holidify.com/country/india/packages.html', { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('.row.no-gutters.inventory-card');  // Ensure the rows are loaded
        
            // Extract data from the page
            const alldata = await page.evaluate(() => {
                const data = document.querySelectorAll('.row.no-gutters.inventory-card');
        
                return Array.from(data).map((el) => {
              

            const titleElement = el.querySelector('.name.text-truncate');
            const title = titleElement ? titleElement.innerText.trim() : 'No title found';

            // Get the image URL
            const imgElement = el.querySelector('.w-100.lazy');
            const image = imgElement ? imgElement.getAttribute('data-original') : 'No image found';

            // Get the price
            const priceElement = el.querySelector('.price');
            let price = priceElement ? priceElement.innerText.trim() : 'No price found';
 
            price = price.replace(/[^\d.-]/g, ''); // Removes everything except digits, dots, and minus sign
            price = parseFloat(price); // Convert to number

            // Get the location (places covered)
            const locationElement = el.querySelector('.places-covered');
            const location = locationElement ? locationElement.innerText.trim() : 'No location found';

            const descriptionElement = el.querySelector('.places-covered');
            const description = descriptionElement ? descriptionElement.innerText.trim() : 'No description found';

           
                
            return { title, image, price, location };

                
 

        })
        
    })
 

 //   console.log(alldata);
    
    await browser.close();
    

    for (let data of alldata) {
        const newGround = new ground({
            title: data.title,
            location: data.location,
            description: data.description,
            image: data.image,
            price: data.price
        });

        try {
            await newGround.save();
            console.log(`Saved: ${data.title}`);
        } catch (err) {
            console.error(`Error saving ${data.title}:`, err);
        }
    }
    
    mongoose.connection.close();  // Close the DB connection after seeding
};

// Run the seeding function
seedDB().catch((err) => {
    console.error("Error during seeding:", err);
    mongoose.connection.close();
});