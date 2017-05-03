var BasicCard = require("./BasicCard.js");
var ClozeCard = require("./ClozeCard.js");
var inquirer = require("inquirer");
var fs = require("fs");

var basicCards = JSON.parse(fs.readFileSync("basicCardQuestions.json", "utf8"));
var clozeCards = JSON.parse(fs.readFileSync("clozeCardQuestions.json", "utf8"));
var count = 0;

function createCard() {
	inquirer.prompt([
		{
			type: "list",
			message: "What type of card do you want to create?",
			choices: ["Basic Card", "Cloze Card"],
			name: "choice"
		},
		{
			type: "input",
			message: "Question / Text",
			name: "text"
		},
		{
			type: "input",
			message: "Answer / Cloze",
			name: "answer"
		},
		{
			type: "confirm",
			message: "Is this correct?",
			name: "confirm",
			default: true
		},
	]).then(function(data) {
		if (!data.confirm) {
			return createCard();
		} else {
			switch(data.choice) {
				case "Basic Card":
					var newBasicCard = new BasicCard(data.text, data.answer);
					basicCards.push(newBasicCard);
					fs.writeFileSync("basicCardQuestions.json", JSON.stringify(basicCards, null, 2), "utf8");
					break;

				case "Cloze Card":
					var newClozeCard = new ClozeCard(data.text, data.answer);
					clozeCards.push(newClozeCard);
					fs.writeFileSync("clozeCardQuestions.json", JSON.stringify(clozeCards, null, 2), "utf8");
					break;
			}

			console.log("");
			console.log("The card was succesfully created");
			console.log("");

			inquirer.prompt([
				{
					type: "confirm",
					message: "Do you want to create another card?",
					name: "confirm",
					default: true
				},
			]).then(function(data) {
				if (data.confirm) {
					return createCard();
				}
			});
		}
	});
}

function showBasicCards() {
	if (count < basicCards.length) {
		console.log("");
		console.log(count+1 + ") " + basicCards[count].front);
		console.log("");
		inquirer.prompt([
			{
				type: "list",
				message: "What do you want to do?",
				name: "choice",
				choices: ["Answer", "View Answer"]
			},
		]).then(function(data) {
			switch(data.choice) {
				case "Answer":
					inquirer.prompt([
						{
							type: "input",
							message: "Answer:",
							name: "answer"
						},
					]).then(function(data) {
						if (data.answer.toLowerCase() === basicCards[count].back.toLowerCase()) {
							console.log("Correct!");
						} else {
							console.log("Incorrect.\nThe correct answer was: " + basicCards[count].back);
						}
						count++;
						showBasicCards();
					});
					break;

				case "View Answer":
					console.log(basicCards[count].back);
					count++;
					showBasicCards();
					break;
			}
		});
	} else {
		count = 0;
		console.log("");
		inquirer.prompt([
			{
				type: "confirm",
				message: "There are no more questions. Do you want to answer them again?",
				name: "confirm",
				default: true
			},
		]).then(function(data) {
			if (data.confirm) {
				return showBasicCards();
			}
		});
	}
}

function showClozeCards() {
	if (count < clozeCards.length) {
		console.log("");
		console.log(count+1 + ") " + clozeCards[count].partial);
		console.log("");
		inquirer.prompt([
			{
				type: "list",
				message: "What do you want to do?",
				name: "choice",
				choices: ["Answer", "View Answer"]
			},
		]).then(function(data) {
			switch(data.choice) {
				case "Answer":
					inquirer.prompt([
						{
							type: "input",
							message: "Answer:",
							name: "answer"
						},
					]).then(function(data) {
						if (data.answer.toLowerCase() === clozeCards[count].cloze.toLowerCase()) {
							console.log("Correct!");
						} else {
							console.log("Incorrect.\nThe correct answer was: " + clozeCards[count].fullText);
						}
						count++;
						showClozeCards();
					});
					break;

				case "View Answer":
					console.log(clozeCards[count].fullText);
					count++;
					showClozeCards();
					break;
			}
		});
	} else {
		count = 0;
		console.log("");
		inquirer.prompt([
			{
				type: "confirm",
				message: "There are no more questions. Do you want to answer them again?",
				name: "confirm",
				default: true
			},
		]).then(function(data) {
			if (data.confirm) {
				return showClozeCards();
			}
		});
	}
}

inquirer.prompt([
	{
		type: "list",
		message: "What do you want to do?",
		choices: ["Answer questions", "Create card"],
		name: "choice"
	},
]).then(function(data) {
	switch(data.choice) {
		case "Answer questions":
			inquirer.prompt([
				{
					type: "list",
					message: "What type of cards do you want to use?",
					choices: ["Basic Card", "Cloze Card"],
					name: "choice"
				},
			]).then(function(data) {
				switch(data.choice) {
					case "Basic Card":
						showBasicCards();
						break;

					case "Cloze Card":
						showClozeCards();
						break;
				}
			});
			break;

		case "Create card":
			createCard();
			break;
	}
});