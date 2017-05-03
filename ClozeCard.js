var ClozeCard = function(text, cloze) {
	if(!(this instanceof ClozeCard)) {
		return new ClozeCard(text, cloze);
	}

	if (text.indexOf(cloze) !== -1) {
		var partial = text.replace(cloze, "...");
		this.cloze = cloze;
		this.partial = partial;
		this.fullText = text;
	} else {
		console.log("cloze deletion does not appear in the input text.");
	}
};

module.exports = ClozeCard;