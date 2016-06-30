var userId;

$(document).ready(function(){
	loadId();
	//send user id from input to chrome storage after button click with acceptable value and clear label
	$("#changeButton").click(function(){
		if (document.getElementById("inputId").value) {
			userId = document.getElementById("inputId").value;
			document.getElementById("inputId").value = "";
			saveId();
			document.getElementById("currentId").innerHTML =
				userId.toString();
		}
	});
});

//save user id to chrome storage
function saveId() {
	var value = userId;
    chrome.storage.sync.set({'userID': value}, function() {
    });
}

//load user id from chrome storage and displey it on page
function loadId() {
	chrome.storage.sync.get('userID', function(result) {
		userId = result.userID;
		if (userId) {
			document.getElementById("currentId").innerHTML =
				userId.toString();
		}
		else {
			document.getElementById("currentId").innerHTML =
				"No user";
		}
	});
}