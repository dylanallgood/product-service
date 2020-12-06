const csvStringify = require('csv-writer').createObjectCsvStringifier;
const csv = require('csv-parser');
const Transform = require('stream').Transform;
const { Writable } = require('stream');
const fs = require('fs');
const fileName = __filename.slice(__dirname.length + 1, -3);

let readStream = fs.createReadStream(
  '../../../csv data/original-data/styles.csv'
);
let writeStream = fs.createWriteStream(
  '../../../csv data/clean-data/styles.csv'
);

const csvFormatter = csvStringify({
  header: [
    { id: 'id', title: 'style_id' },
    { id: 'productId', title: 'product_id' },
    { id: 'name', title: 'name' },
    { id: 'original_price', title: 'original_price' },
    { id: 'sale_price', title: 'sale_price' },
    { id: 'default_style', title: 'default_style' },
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
