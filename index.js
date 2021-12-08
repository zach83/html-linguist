#!/usr/bin/env node
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const fs = require("fs");
const process = require("process");
const languages = ["HTML", "CSS", "JS", "PHP"];
const tagLanguages = ["HTML", "CSS", "CSS", "JS", "JS", "PHP", "PHP"];
const languageTags = ["</html>", "<style>", "</style>", "<script>", "</script>", "<?php", "?>"]; // If <html> is written, it would cause an infinite loop
for (let i = 2; i < process.argv.length; i++) {
	let source = process.argv[i];
	if (fs.existsSync(source) && (source.includes(".html") || source.includes(".php"))) {
		calculate(source);
	} else {
		console.log(chalk.red.bold("THE SOURCE " + source + " DOES NOT EXIST OR IS NOT COMPATIBLE"));
	}
}


function calculate (target) {

	var targetFileContent = fs.readFileSync(target);
	var slicedCharLength = [];
	var sliceCounter = 0;
	var counter;
	var languageScores = [];
	languageScores.length = languages.length;
	languageScores.fill(0);
	var winningLanguage = "HTML";

	function checkpoint (mark) {counter.push(targetFileContent.indexOf(mark, sliceCounter + 1));} // Get the location of the tags and start w/ +1 to advance progress
	function numFilter (x) {return x !== -1;}

	do {

		counter = []; // Resets
		languageTags.forEach(checkpoint); // Let counter inherit scores

		var preppedNums = counter.filter(numFilter);
		var lowestNumber = Math.min.apply(null, preppedNums);
		languageScores[languages.indexOf(winningLanguage)] += lowestNumber - sliceCounter; // Round winner is the closest language to current checkpoint, and is qued to earn a score next round
		slicedCharLength.push(targetFileContent.slice(sliceCounter, lowestNumber).length);
		sliceCounter += lowestNumber - sliceCounter;
		winningLanguage = tagLanguages[counter.indexOf(lowestNumber)];

	} while (sliceCounter < counter[0])

	console.log(chalk.white.bold("=========="));
	console.log(chalk.white("The file ") + chalk.magenta.bold(target) + chalk.white(" is..."));
	for (let i in languageScores) {
		let languagePercent = Math.round((languageScores[i] / counter[0]) * 100);
		if (languagePercent === 0) {continue;}
		console.log(chalk.white.bold(" - ") + chalk.cyan.bold(`${languages[i]} `) + chalk.green.bold.italic(`${languagePercent}%`) + ",");
	}
	console.log(chalk.white.bold("=========="));

	return languages[languageScores.indexOf(Math.max.apply(null, languageScores))]; // Most common language in file

}

