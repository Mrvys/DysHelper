var expressionToFind;
var border = "4.2";
var userId = 0;

//add character between first and second element of string
String.prototype.splice = function(idx, str) {
    return this.slice(0, idx) + str + this.slice(idx);
};

//save characters to chrome storage
function saveString() {
    var value = expressionToFind;
    chrome.storage.sync.set({'data': value}, function() {
    });
}

//function to get matrix from server, parse it and base on these matrix slit characters on web pages
function divider(){
		//listener on event storage change
        chrome.storage.onChanged.addListener(function (changes, namespace) {
            for (key in changes) {
                if (key == 'userID') {
                    userId = changes[key].newValue;
                    //download matrix from server
                    $.ajax({
                        url: "http://is.muni.cz/www/409943/" + userId + ".txt",
                        success: function (data) {
                            var charsToStore = [];
                            var alphabet = [];
                            var counter = 0;
                            while (data[counter] != '\n') {
                                alphabet = alphabet + data[counter];
                                counter++;
                            }
                            alphabet = alphabet.replace(/,/g, "");
                            alphabet = $.trim(alphabet);
                            var sumOfCharsToDivide = 0;
                            var i = counter + 1;
                            var counterOfLines = 0;
							//parsing matrix to find chars that need to be split
                            while (i < data.length - 1) {
                                var line = [];
                                while (data[i] != '\n' && data.length > i) {
                                    line = line + data[i];
                                    i++;
                                }
                                var j = 0;
                                var counterOfWord = 0;
                                while (j < line.length - 1) {
                                    var word = [];
                                    while (line[j] != "," && line[j] != '\n' && j < line.length) {
                                        word = word + line[j];
                                        j++;
                                    }
                                    if (word > border) {
                                        var newCharacter = alphabet[counterOfLines] + alphabet[counterOfWord];
                                        charsToStore = charsToStore + " " + newCharacter;
                                        sumOfCharsToDivide++;
                                    }
                                    counterOfWord++;
                                    j++;
                                }
                                counterOfLines++;
                                i++;
                            }
                            var trimData = $.trim(charsToStore);
                            expressionToFind = trimData.replace(/ /g, '|');
                            saveString();
                        }
                    });
                }
            }
        });
		
		//get user id from storage
		chrome.storage.sync.get('userID', function (result) {
			userId = result.userID;
		});
		
		//get pair of characters from chrome storage
        chrome.storage.sync.get('data', function (result) {
            expressionToFind = result.data;
            if (expressionToFind) {
                var re = new RegExp(expressionToFind, "g");
				//find pair of characters that needs to be split a replace them
                $('*').contents().filter(function () {
                    return this.nodeType != 1
                }).each(function () {
                    this.textContent = this.textContent.replace(re, function (match) {
                        return match.splice(1, "-");
                    });
                });
            }
        });
}

//start afer document is ready
$(document).ready(divider());

