const csvStringify = require('csv-writer').createObjectCsvStringifier;
const csv = require('csv-parser');
const Transform = require('stream').Transform;
const { Writable } = require('stream');
const fs = require('fs');
const fileName = __filename.slice(__dirname.length + 1, -3);

let readStream = fs.createReadStream(
  '../../../csv data/original-data/product.csv'
);
let writeStream = fs.createWriteStream(
  '../../../csv data/clean-data/products.csv'
);

const csvFormatter = csvStringify({
  header: [
    { id: 'id', title: 'product_id' },
    { id: 'name', title: 'name' },
    { id: 'slogan', title: 'slogan' },
    { id: 'description', title: 'description' },
    { id: 'category', title: 'category' },
    { id: 'default_price', title: 'default_price' },
  ],
  alwaysQuote: true,
});

// runs functions on data to align with schema
const transformData = () => {
  return new Transform({
    objectMode: true,
    transform: (chunk, _, done) => {
      for (let key in chunk) {
        chunk[key.trim()] = chunk[key].trim();
      }
      chunk.default_price = chunk.default_price.replace(/\D/g, '');
      chunk = csvFormatter.stringifyRecords([chunk]);
      done(null, chunk);
    },
  });
};

// takes in transformed data and writes it to clean csv
const writeNewData = () => {
  return new Writable({
    objectMode: true,
    write: (chunk, _, done) => {
      writeStream.write(chunk);
      // console.log('<-', chunk);
      done();
    },
  });
};

// sets headers for file
writeStream.write(csvFormatter.getHeaderString());

// reads from original csv file, manipulates data, write to clean csv
readStream
  .pipe(csv())
  .pipe(transformData())
  .pipe(writeNewData())
  .on('finish', () => console.log(`Finished Writing ${fileName}`));
