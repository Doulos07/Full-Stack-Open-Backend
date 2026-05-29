const mongoose = require("mongoose");
const process = require("node:process");

const argv = process.argv;

const password = argv[2];

const url = `mongodb+srv://santiiariel2004:${password}@cluster0.ewxj3of.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (argv.length > 3) {
  const person = new Person({
    name: argv[3],
    number: argv[4],
  });

  person.save().then((result) => {
    console.log(`added ${result.name + " " + result.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(person.name + " " + person.number);
    });
    mongoose.connection.close();
  });
}
