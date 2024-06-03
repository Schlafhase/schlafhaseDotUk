function updatePronouns() {
    var e = document.getElementById("pronounSelection");
    var smallText = document.getElementById("smallText");
    var pronounIndex = parseInt(e.value);
    var pronouns = [["They", "Their", "them", "like"], ["She", "Her", "her", "likes"], ["They", "Her", "him", "like"], ["He", "His", "him", "likes"], ["Them", "They", "their"], ["Bom", "Bies", "bie", "likes"], ["<input type=\"text\" size=\"5\"></input>", "<input type=\"text\" size=\"5\"></input>", "<input type=\"text\" size=\"5\"></input>", "likes"]];
    pronouns[7] = [pronouns[Math.floor(Math.random() * pronouns.length)][0], pronouns[Math.floor(Math.random() * pronouns.length)][1], pronouns[Math.floor(Math.random() * pronouns.length)][2], pronouns[Math.floor(Math.random() * pronouns.length)][3]]
    
    smallText.innerHTML = `<span class="pronoun">${pronouns[pronounIndex][0]}</span> ${pronouns[pronounIndex][3]} coding. <span class="pronoun">${pronouns[pronounIndex][1]}</span> code is very messy sometimes. Ndim is an esoteric programming language created by <span class="pronoun">${pronouns[pronounIndex][2]}</span>.`;
}